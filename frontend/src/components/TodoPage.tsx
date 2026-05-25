"use client";

import { api } from "@/services/api";
import { Todo } from "@/types/todo";
import { useEffect, useRef, useState } from "react";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { toast } from "sonner";

export function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const pendingDeletes = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    fetchTodos();
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos", {
        params: selectedCategory
          ? {
              category: selectedCategory,
            }
          : {},
      });

      const filteredTodos = response.data.filter(
        (todo: Todo) => !pendingDeletes.current.has(todo.id),
      );

      setTodos(filteredTodos);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteTodo = (todo: Todo) => {
    const originalIndex = todos.findIndex((t) => t.id === todo.id);

    setTodos((prev) => prev.filter((t) => t.id !== todo.id));

    const timeout = setTimeout(async () => {
      try {
        await api.delete(`/todos/${todo.id}`);

        fetchCategories();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");

        fetchTodos();
      } finally {
        pendingDeletes.current.delete(todo.id);
      }
    }, 5000);

    pendingDeletes.current.set(todo.id, timeout);

    toast("Todo deleted", {
      id: `todo-${todo.id}`,
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(timeout);

          pendingDeletes.current.delete(todo.id);

          setTodos((prev) => {
            const updated = [...prev];

            updated.splice(originalIndex, 0, todo);

            return updated;
          });
        },
      },
    });
  };

  const handleCompleteTodo = async (todo: Todo) => {
    const originalTodo = { ...todo };

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: true } : t)),
    );

    const timeout = setTimeout(async () => {
      try {
        setTodos((prev) => prev.filter((t) => t.id !== todo.id));

        await api.delete(`/todos/${todo.id}`);

        fetchCategories();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");

        fetchTodos();
      } finally {
        pendingDeletes.current.delete(todo.id);
      }
    }, 5000);

    pendingDeletes.current.set(todo.id, timeout);

    toast.success("Todo completed", {
      id: `todo-${todo.id}`,
      description: "Undo available for 5 seconds",
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(timeout);

          pendingDeletes.current.delete(todo.id);

          setTodos((prev) =>
            prev.map((t) => (t.id === todo.id ? originalTodo : t)),
          );
        },
      },
    });
  };

  const handleUndoComplete = (todo: Todo) => {
    const timeout = pendingDeletes.current.get(todo.id);

    if (timeout) {
      clearTimeout(timeout);

      pendingDeletes.current.delete(todo.id);
    }

    toast.dismiss(`todo-${todo.id}`);

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: false } : t)),
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-4xl font-bold">Todo Categories App</h1>

        <TodoForm
          onCreated={() => {
            fetchTodos();
            fetchCategories();
          }}
        />

        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 p-3"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border p-10 text-center">
            <p className="text-lg font-medium">Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="text-lg font-medium">No todos found</p>

            <p className="mt-2 text-sm text-gray-500">
              Create a new todo to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onComplete={handleCompleteTodo}
                onDeleted={handleDeleteTodo}
                onUndoComplete={handleUndoComplete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
