import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}
