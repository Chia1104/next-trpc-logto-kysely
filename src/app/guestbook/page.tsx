import { api } from "@/server/trpc/server";

export default async function Home() {
  const message = await api.example.hello.query();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{message}</p>
    </main>
  );
}
