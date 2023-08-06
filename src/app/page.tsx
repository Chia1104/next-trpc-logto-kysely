import { api } from "@/server/trpc/server";
import Todos, { AddTodo, Skeleton } from "@/app/todos";
import { fetchUser } from "@/server/logto/fetch-user";
import { Suspense } from "react";

const TodoList = async () => {
  const todos = (await api.todo.read.query()).data;
  return <Todos todos={todos} className="mt-10" />;
};

const Unauthorized = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">You are not logged in</h1>
      <p className="text-xl">Please login to view this page</p>
    </div>
  );
};

export default async function Home() {
  const { isAuthenticated } = await fetchUser();
  return (
    <main className="flex min-h-screen flex-col items-center p-5 py-24 md:p-24">
      {isAuthenticated && <AddTodo className="justify-self-start" />}
      {isAuthenticated ? (
        <Suspense
          fallback={[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="mb-5 h-10 w-full max-w-[800px] rounded-xl"
            />
          ))}>
          <TodoList />
        </Suspense>
      ) : (
        <Unauthorized />
      )}
    </main>
  );
}
