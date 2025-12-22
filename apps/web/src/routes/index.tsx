import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";
import { clientTreaty } from "@/lib/client-treaty";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  const { data, isLoading } = useQuery({
    queryKey: ["hi"],
    queryFn: async () => {
      const result = await clientTreaty.hi.get();
      return result.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { id: number; name: string }) => {
      const result = await clientTreaty.mirror.post({
        id: data.id,
        name: data.name,
      });
      return result.data;
    },
  });

  const handleClick = () => {
    mutation.mutate({
      id: 1,
      name: "John Doe",
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">Elysia + tanstack start</pre>
      {isLoading ? <div>Loading...</div> : <div>result: {data}</div>}
      <button onClick={handleClick}>Click me</button>
      {/* <div>result: {data.data}</div> */}
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
