"use client";

import {
  type FC,
  useCallback,
  experimental_useOptimistic as useOptimistic,
  useTransition,
  useMemo,
} from "react";
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
import { revalidate } from "./revalidate-todos";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import dayjs from "dayjs";

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
  const [isPending, startTransition] = useTransition();
  const onSubmit = useCallback(
    handleSubmit((data) => {
      startTransition(async () => {
        try {
          await api.todo.create.mutate(data);
          await revalidate();
          onOpenChange?.();
        } catch (error) {
          toast.error("Something went wrong");
        }
      });
    }),
    [handleSubmit, onOpenChange]
  );

  const { theme } = useTheme();
  const color = useMemo(() => {
    return theme === "dark" ? "secondary" : "primary";
  }, [theme]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
          disabled={isPending}>
          Close
        </Button>
        <Button color={color} type="submit" isLoading={isPending}>
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

const CheckTodo = ({ todo }: CheckTodoProps) => {
  const [optimisticTodo, setOptimisticTodo] = useOptimistic<
    Todos[0],
    Todos[0]["status"]
  >(todo, (state, status) => {
    return {
      ...state,
      status,
    };
  });
  const handleCheck = useCallback(async () => {
    try {
      setOptimisticTodo(
        todo.status === Status.COMPLETED ? Status.UNCOMPLETED : Status.COMPLETED
      );
      await api.todo.update.mutate({
        id: todo.id,
        status:
          todo.status === Status.COMPLETED
            ? Status.UNCOMPLETED
            : Status.COMPLETED,
      });
      await revalidate();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [setOptimisticTodo, todo]);
  return (
    <div className="wi-full flex justify-between">
      <Checkbox
        isSelected={optimisticTodo.status === Status.COMPLETED}
        onValueChange={() => void handleCheck()}
        lineThrough>
        {optimisticTodo.title}
      </Checkbox>
      <EditButton todo={optimisticTodo} />
    </div>
  );
};

const Todos: FC<TodoProps> = ({ todos, className }) => {
  return (
    <div
      className={cn(
        "w-full max-w-[800px] rounded-2xl bg-light p-2 transition-all dark:bg-dark",
        className
      )}>
      <Accordion>
        {todos.map((todo) => (
          <AccordionItem
            key={todo.id}
            aria-label={todo.title}
            title={<CheckTodo todo={todo} />}>
            <p className="ml-10">{todo.description}</p>
            <br />
            <p className="mr-14 text-end">
              {dayjs(todo.createdAt).format("DD/MM/YYYY")}
            </p>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Todos;
export { AddTodo, Skeleton };
