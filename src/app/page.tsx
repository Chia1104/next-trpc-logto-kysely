import { api } from "@/server/trpc/server";
import { type RouterOutputs } from "@/server/trpc";

/**
 * @TODO
 */
export default async function Home() {
  let todos: RouterOutputs["todo"]["read"]["data"] = [];
  const message = await api.example.hello.query();
  try {
    todos = (await api.todo.read.query()).data;
  } catch (error) {
    todos = [];
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{message}</p>
      {todos?.map((todo) => (
        <div key={todo.id}>
          <p>{todo.title}</p>
        </div>
      ))}
    </main>
  );
}
