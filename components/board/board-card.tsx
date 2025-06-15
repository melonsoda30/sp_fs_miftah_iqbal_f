import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, GripVertical, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import { TaskForm } from "../form/task-form";
import { toast } from "sonner";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import { TaskWithAssigneeProps } from "@/types/db";
import { memo, useCallback, useMemo } from "react";
import { CustomAvatar } from "../ui/custom-avatar";

interface BoardCardProps {
  item: TaskWithAssigneeProps;
}

export const BoardCard = memo<BoardCardProps>(({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const { id } = useParams();
  const { mutate } = useSWR(`/api/projects/${id}/task`, fetcher);

  // Memoized transform style to prevent unnecessary recalculations
  const style = useMemo(
    () =>
      transform
        ? {
            transform: CSS.Translate.toString(transform),
            opacity: isDragging ? 0.8 : 1,
            zIndex: isDragging ? 1000 : "auto",
          }
        : undefined,
    [transform, isDragging]
  );

  // Memoized formatted date to prevent repeated date parsing
  const formattedDate = useMemo(
    () => (item.createdAt ? new Date(item.createdAt).toDateString() : ""),
    [item.createdAt]
  );

  // Memoized initial values for TaskForm to prevent object recreation
  const taskFormInitialValues = useMemo(
    () => ({
      title: item.title,
      description: item.description,
      status: item.status,
      assigneeId: item.assignee?.id,
    }),
    [item.title, item.description, item.status, item.assignee?.id]
  );

  const handleDeleteClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        const response = await fetch(`/api/projects/${id}/task`, {
          method: "DELETE",
          body: JSON.stringify({ taskId: item.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          toast.success("Task deleted successfully");
          await mutate();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Delete task error:", error);
        toast.error("Failed to delete task. Please try again.");
      }
    },
    [id, item.id, mutate]
  );

  // Prevent drag when interacting with buttons
  const handleButtonPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 w-full max-w-full cursor-grab active:cursor-grabbing ${
        isDragging ? "shadow-lg rotate-2" : "hover:shadow-md"
      }`}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-row justify-between items-center min-w-0">
          <span className="text-sm text-foreground/60 flex-shrink-0">
            {formattedDate}
          </span>

          <div className="flex">
            <TaskForm type="edit" initialValues={taskFormInitialValues}>
              <Button
                variant="ghost"
                size="sm"
                onPointerDown={handleButtonPointerDown}
                className="z-10 relative flex-shrink-0 ml-1"
                aria-label="Edit task"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TaskForm>
            <Button
              variant="ghost"
              size="sm"
              className="z-10 relative flex-shrink-0 ml-1"
              onClick={handleDeleteClick}
              onPointerDown={handleButtonPointerDown}
              aria-label="Delete task"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h5
          className="text-md font-semibold min-w-0 break-words hyphens-auto"
          title={item.title}
        >
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
            {item.title}
          </span>
        </h5>
      </CardHeader>

      <CardDescription className="px-6 pb-4">
        <p className="text-sm text-foreground/50 min-w-0 break-words hyphens-auto leading-relaxed max-h-[100px]">
          <span className="block overflow-hidden line-clamp-3">
            {item.description}
          </span>
        </p>
      </CardDescription>

      <CardFooter className="flex justify-between items-center pt-0 min-w-0">
        <div className="flex flex-row gap-2">
          <Badge className="text-xs flex-shrink-0 max-w-[120px]">
            <span className="truncate">{item.status}</span>
          </Badge>
          <CustomAvatar data={[item.assignee]} />
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50 flex-shrink-0 ml-2" />
      </CardFooter>
    </Card>
  );
});

BoardCard.displayName = "BoardCard";
