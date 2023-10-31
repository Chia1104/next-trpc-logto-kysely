"use client";

import { type FC, useOptimistic, useTransition, memo } from "react";
import { api, type RouterOutputs } from "@/server/trpc/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, type CreateTodo } from "@/utils/validators";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  type ButtonProps,
  Accordion,
  AccordionItem,
  Checkbox,
  Skeleton,
} from "@nextui-org/react";
import { toast } from "sonner";
import { cn } from "@/utils";
import { type ClassValue } from "clsx";
import { Status } from "@/server/db/enums";
import { revalidate } from "./revalidate-todos.action";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import { useAction } from "@/server/trpc/client";
import { updateStatusAction } from "@/app/update-status.action";

const EditButton = dynamic(() => import("./edit"), {
  ssr: false,
  loading: () => <Skeleton className="h-8 w-8 rounded-lg" />,
});

interface TodoProps {
  todos: Todos;
  className?: ClassValue;
}

type Todos = RouterOutputs["todo"]["read"]["data"];

const AddTodoForm: FC<{ onOpenChange?: () => void }> = ({ onOpenChange }) => {
  const { control, handleSubmit } = useForm<CreateTodo>({
    resolver: zodResolver(createTodoSchema),
  });
  const { mutate, isLoading } = api.todo.create.useMutation({
    onSuccess: () => {
      revalidate();
      onOpenChange?.();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const onSubmit = handleSubmit((data) => mutate(data));

  const { theme } = useTheme();
  const color = theme === "dark" ? "secondary" : "primary";

  return (
    <form onSubmit={onSubmit}>
      <ModalHeader className="flex flex-col gap-1">Add Todo</ModalHeader>
      <ModalBody>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <>
              <Input
                {...field}
                isRequired
                label="Title"
                color={invalid ? "danger" : color}
                errorMessage={error?.message}
              />
            </>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <>
              <Textarea
                {...field}
                label="Description"
                color={invalid ? "danger" : color}
                errorMessage={error?.message}
              />
            </>
          )}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          variant="light"
          onClick={onOpenChange}
          disabled={isLoading}>
          Close
        </Button>
        <Button color={color} type="submit" isLoading={isLoading}>
          Save
        </Button>
      </ModalFooter>
    </form>
  );
};

const AddTodo: FC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button {...props} onPress={onOpen}>
        Add Todo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <AddTodoForm onOpenChange={onOpenChange} />
        </ModalContent>
      </Modal>
    </>
  );
};

interface CheckTodoProps {
  todo: Todos[0];
}

const CheckTodo = memo(
  ({ todo }: CheckTodoProps) => {
    const [optimisticTodo, setOptimisticTodo] = useOptimistic<
      Todos[0],
      Todos[0]["status"]
    >(todo, (prevTodo, status) => {
      return {
        ...prevTodo,
        status,
      };
    });
    const [, startTransition] = useTransition();
    const mutation = useAction(updateStatusAction, {
      onSuccess() {
        toast.success("Todo updated");
      },
      onError() {
        toast.error("Something went wrong");
      },
    });
    const handleCheck = () =>
      startTransition(async () => {
        try {
          setOptimisticTodo(
            todo.status === Status.COMPLETED
              ? Status.UNCOMPLETED
              : Status.COMPLETED
          );
          mutation.mutate({
            id: todo.id,
            status:
              todo.status === Status.COMPLETED
                ? Status.UNCOMPLETED
                : Status.COMPLETED,
          });
          revalidate();
        } catch (error) {
          toast.error("Something went wrong");
        }
      });
    return (
      <div className="wi-full flex justify-between">
        <Checkbox
          isSelected={optimisticTodo.status === Status.COMPLETED}
          onValueChange={handleCheck}
          lineThrough>
          {todo.title}
        </Checkbox>
        <EditButton todo={todo} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.todo.status === nextProps.todo.status &&
      prevProps.todo.title === nextProps.todo.title &&
      prevProps.todo.description === nextProps.todo.description
    );
  }
);
CheckTodo.displayName = "CheckTodo";

const Todos: FC<TodoProps> = ({ todos, className }) => {
  return (
    <div
      className={cn(
        "w-full max-w-[800px] rounded-2xl bg-light p-2 transition-all dark:bg-dark",
        className
      )}>
      {todos?.length ? (
        <Accordion>
          {todos.map((todo) => (
            <AccordionItem
              key={todo.id}
              aria-label={todo.title}
              title={
                <CheckTodo
                  todo={todo}
                  /**
                   * @todo fix optimistic state
                   * enforce rerender on status change
                   */
                  key={todo.status}
                />
              }>
              <p className="ml-10">{todo.description}</p>
              <br />
              <p className="mr-14 text-end">
                {dayjs(todo.createdAt).format("DD/MM/YYYY")}
              </p>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-lg">No todos yet</p>
      )}
    </div>
  );
};

export default Todos;
export { AddTodo, Skeleton, CheckTodo };
