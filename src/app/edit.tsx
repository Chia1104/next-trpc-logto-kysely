import { type FC } from "react";
import {
  Button,
  type ButtonProps,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { cn } from "@/utils";
import { api, type RouterOutputs } from "@/server/trpc/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTodoSchema, type UpdateTodo } from "@/utils/validators";
import { revalidate } from "@/app/revalidate-todos.action";
import { toast } from "sonner";
import { useTheme } from "next-themes";

type Todos = RouterOutputs["todo"]["read"]["data"];

interface CheckTodoProps {
  todo: Todos[0];
}

const Form: FC<{ onOpenChange?: () => void } & CheckTodoProps> = ({
  onOpenChange,
  todo,
}) => {
  const { control, handleSubmit } = useForm<UpdateTodo>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      id: todo.id,
      title: todo.title,
      description: todo.description ?? "",
      status: todo.status,
    },
  });
  const { mutate, isLoading } = api.todo.update.useMutation({
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      revalidate();
      onOpenChange?.();
    },
  });
  const { mutate: deleteAction, isLoading: isDeleting } =
    api.todo.delete.useMutation({
      onError: () => {
        toast.error("Something went wrong");
      },
      onSuccess: () => {
        revalidate();
        onOpenChange?.();
      },
    });
  const onSubmit = handleSubmit((data) => mutate(data));

  const handleDelete = () =>
    deleteAction({
      id: todo.id,
    });

  const { theme } = useTheme();
  const color = theme === "dark" ? "secondary" : "primary";

  return (
    <form onSubmit={onSubmit}>
      <ModalHeader className="flex flex-col gap-2">
        <p>Update Todo</p>
        <div className="flex w-full justify-between">
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <div className="flex items-center gap-1">
                <Switch
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value ? "COMPLETED" : "UNCOMPLETED");
                  }}
                  isSelected={field.value === "COMPLETED"}
                  color={invalid ? "danger" : color}
                />
                <p className="text-sm">
                  {field.value === "COMPLETED" ? "Completed" : "Not Completed"}
                </p>
              </div>
            )}
          />
          <Button
            isIconOnly
            isLoading={isDeleting}
            size="sm"
            color="warning"
            className="text-white"
            onClick={handleDelete}>
            {!isDeleting && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            )}
          </Button>
        </div>
      </ModalHeader>
      <ModalBody>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <>
              <Input
                {...field}
                label="Title"
                color={invalid ? "danger" : color}
                errorMessage={error?.message}
                defaultValue={todo.title}
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
                defaultValue={todo.description ?? ""}
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
          disabled={isLoading || isDeleting}>
          Close
        </Button>
        <Button color={color} type="submit" isLoading={isLoading || isDeleting}>
          Save
        </Button>
      </ModalFooter>
    </form>
  );
};

const EditButton: FC<ButtonProps & CheckTodoProps> = ({ todo, ...props }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        {...props}
        isIconOnly
        size="sm"
        className={cn(
          "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
          props.className
        )}
        onClick={onOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <Form todo={todo} onOpenChange={onOpenChange} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditButton;
