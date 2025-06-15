import { useDroppable } from "@dnd-kit/core";
import { BoardCard } from "./board-card";
import { TaskWithAssigneeProps } from "@/types/db";
import { memo } from "react";

interface BoardContainerProps {
  column: {
    label: string;
    value: string;
  };
  value: TaskWithAssigneeProps[];
}

export const BoardContainer = memo<BoardContainerProps>(({ column, value }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.value,
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-4 py-4 border-b">
        <h5 className="text-md font-semibold tracking-wider mb-2">
          {column.label}
          <span className="ml-4 text-xs bg-primary rounded-full py-1 px-2 text-white">
            {value.length ?? 0}
          </span>
        </h5>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-4 p-4 flex-1 overflow-y-auto min-h-[200px] transition-colors duration-200 ${
          isOver ? "bg-muted/50 border-2 border-dashed border-primary" : ""
        }`}
      >
        {value.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Drop items here
          </div>
        ) : (
          value.map((item) => <BoardCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
});

BoardContainer.displayName = "BoardContainer";
