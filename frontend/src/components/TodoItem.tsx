"use client";

import { api } from "@/services/api";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onComplete: (todo: Todo) => void;
  onDeleted: (todo: Todo) => void;
  onUndoComplete: (todo: Todo) => void;
}

export function TodoItem({
  todo,
  onComplete,
  onDeleted,
  onUndoComplete,
}: TodoItemProps) {
  const handleToggleCompleted = () => {
    if (todo.completed) {
      onUndoComplete(todo);
      return;
    }

    onComplete(todo);
  };

  const handleDelete = async () => {
    onDeleted(todo);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleCompleted}
          className="h-5 w-5"
        />

        <div className="min-w-0 flex-1">
          <p
            className={`break-words ${
              todo.completed ? "text-gray-400 line-through" : "font-medium"
            }`}
          >
            {todo.text}
          </p>

          <p className="break-words text-sm text-gray-500">{todo.category}</p>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="ml-4 shrink-0 rounded-lg bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}
