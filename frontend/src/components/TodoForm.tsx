"use client";

import { api } from "@/services/api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormValues {
  text: string;
  category: string;
}

interface TodoFormProps {
  onCreated: () => void;
}

export function TodoForm({ onCreated }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const textValue = watch("text") || "";
  const categoryValue = watch("category") || "";

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post("/todos", data);

      reset();

      onCreated();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-8 rounded-xl border p-4"
    >
      <div className="mb-4">
        <div className="relative">
          <input
            {...register("text")}
            maxLength={100}
            placeholder="Todo text"
            className="w-full rounded-lg border border-gray-300 p-3 pr-20 outline-none transition focus:border-black"
          />

          <span
            className={`absolute bottom-3 right-3 text-xs ${
              textValue.length === 100 ? "text-orange-500" : "text-gray-400"
            }`}
          >
            {textValue.length} / 100
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            {...register("category")}
            maxLength={30}
            placeholder="Category"
            className="w-full rounded-lg border border-gray-300 p-3 pr-20 outline-none transition focus:border-black"
          />

          <span
            className={`absolute bottom-3 right-3 text-xs ${
              categoryValue.length === 30 ? "text-orange-500" : "text-gray-400"
            }`}
          >
            {categoryValue.length} / 30
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
}
