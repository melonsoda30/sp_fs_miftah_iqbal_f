"use client";

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
  DragStartEvent,
  UniqueIdentifier,
  DragEndEvent,
} from "@dnd-kit/core";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { BoardContainer } from "../board/board-container";
import { BoardCard } from "../board/board-card";
import { useParams } from "next/navigation";
import { TaskWithAssigneeProps } from "@/types/db";

// Memoized column data to prevent unnecessary re-renders
const COLUMNS = [
  { label: "To Do", value: "todo" },
  { label: "Progress", value: "in-progress" },
  { label: "Done", value: "done" },
] as const;

export function DndContainer({
  task = [],
}: {
  task: TaskWithAssigneeProps[] | [];
}) {
  const [data, setData] = useState<TaskWithAssigneeProps[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { id } = useParams();

  // Use ref to track if update is in progress to prevent duplicate calls
  const updateInProgressRef = useRef(false);

  // Memoized sensors configuration
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 0 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 0, tolerance: 0 },
    })
  );

  // Update data when task prop changes
  useEffect(() => {
    if (task.length > 0) {
      setData(task);
    }
  }, [task]);

  // Optimized update function with debouncing and duplicate prevention
  const updateTask = useCallback(
    async (taskId: UniqueIdentifier, updatedTask: TaskWithAssigneeProps) => {
      if (updateInProgressRef.current) return;

      updateInProgressRef.current = true;

      try {
        const response = await fetch(`/api/projects/${id}/task`, {
          method: "PATCH",
          body: JSON.stringify({
            taskId,
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            assigneeId: updatedTask.assigneeId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Task updated successfully");
      } catch (error) {
        console.error("Update task error:", error);
        // Optionally revert the local state change on error
        // You might want to show a toast notification here
      } finally {
        updateInProgressRef.current = false;
      }
    },
    [id]
  );

  // Memoized grouped data by status to prevent unnecessary filtering
  const groupedData = useMemo(() => {
    return COLUMNS.reduce((acc, col) => {
      acc[col.value] = data.filter((task) => task.status === col.value);
      return acc;
    }, {} as Record<string, TaskWithAssigneeProps[]>);
  }, [data]);

  // Memoized active task to prevent unnecessary lookups
  const activeTask = useMemo(() => {
    return activeId ? data.find((task) => task.id === activeId) : null;
  }, [data, activeId]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log("Drag started:", event.active.id);
    setActiveId(event.active.id);
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setIsDragging(false);

      if (!over) {
        console.log("No drop target");
        return;
      }

      const taskId = active.id;
      const newStatus = over.id as string;

      // Find current task and check if status change is needed
      const currentTask = data.find((task) => task.id === taskId);
      if (!currentTask || currentTask.status === newStatus) {
        console.log("Same status or task not found, no update needed");
        return;
      }

      console.log("Moving task:", taskId, "to status:", newStatus);

      // Optimistically update local state
      const updatedTask = { ...currentTask, status: newStatus };

      setData((prevData) =>
        prevData.map((task) => (task.id === taskId ? updatedTask : task))
      );

      // Update server
      updateTask(taskId, updatedTask);
    },
    [data, updateTask]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setIsDragging(false);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className={`flex gap-4 w-full h-[calc(100vh-160px)] px-4 transition-none ${
          isDragging ? "overflow-hidden" : "overflow-x-auto overflow-y-hidden"
        }`}
      >
        {COLUMNS.map((col) => (
          <div key={col.value} className="w-[320px] shrink-0 h-full">
            <BoardContainer column={col} value={groupedData[col.value] || []} />
          </div>
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 0,
          easing: "ease",
        }}
        style={{ transition: "none" }}
      >
        {activeTask && (
          <div
            className="transform rotate-3 opacity-90"
            style={{
              transition: "none",
              transform: "rotate(3deg)",
            }}
          >
            <BoardCard item={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
