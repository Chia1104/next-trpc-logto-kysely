"use client";

import {
  type FC,
  useCallback,
  experimental_useOptimistic as useOptimistic,
  useTransition,
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
} from "@nextui-org/react";
import { toast } from "sonner";
import { cn } from "@/utils";
import { type ClassValue } from "clsx";
import { Status } from "@/server/db/enums";
import { revalidate } from "./revalidate-todos";

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
                color={invalid ? "danger" : "primary"}
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
                color={invalid ? "danger" : "primary"}
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
        <Button color="primary" type="submit" isLoading={isPending}>
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

interface CheckTodoProps<TTodo = unknown> {
  todo: Todos[0];
  action?: (action: TTodo) => void;
}

const CheckTodo = <TTodo = unknown,>({ todo }: CheckTodoProps<TTodo>) => {
  return (
    <Checkbox defaultSelected={todo.status === Status.COMPLETED} lineThrough>
      {todo.title}
    </Checkbox>
  );
};

const Todos: FC<TodoProps> = ({ todos, className }) => {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic<Todos, Todos[0]>(
    todos,
    (state, newTodo) => [...state, newTodo]
  );
  return (
    <div
      className={cn(
        "w-full max-w-[800px] rounded-2xl bg-light p-2 transition-all dark:bg-dark",
        className
      )}>
      <Accordion>
        {optimisticTodos.map((todo) => (
          <AccordionItem
            key={todo.id}
            aria-label={todo.title}
            title={
              <CheckTodo<Todos[0]> todo={todo} action={setOptimisticTodos} />
            }>
            {todo.description}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Todos;
export { AddTodo };
