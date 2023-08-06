import { type FC } from "react";
import {
  Button,
  type ButtonProps,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { cn } from "@/utils";
import { type RouterOutputs } from "@/server/trpc";

type Todos = RouterOutputs["todo"]["read"]["data"];

interface CheckTodoProps<TTodo = unknown> {
  todo: Todos[0];
  action?: (action: TTodo) => void;
}

const EditButton: FC<ButtonProps & CheckTodoProps> = ({
  todo,
  action,
  ...props
}) => {
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
        onPress={onOpen}>
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
          <p>{todo.title}</p>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditButton;
