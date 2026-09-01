import { Suspense } from "react";
import ClientPurchaseGroupOrdersClient from "./ClientPurchaseGroupOrdersClient";

export default async function ClientPurchaseGroupOrdersPage(props: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { id } = await props.params;

  // Dummy data based on the provided HTML layout.
  // In a real scenario, fetch this from Supabase using the `id` and `subdomain`.
  const dummyClient = {
    id: id,
    name: "Bruno de Souza",
    email: "rodbrun_dragon@hotmail.com",
    suite: "Suíte 1001",
    initials: "B",
    status: "active",
  };

  const dummyOrders: any[] = []; // Empty as per HTML

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 flex justify-center items-center h-full">Carregando pedidos em grupo...</div>}>
      <ClientPurchaseGroupOrdersClient client={dummyClient} orders={dummyOrders} />
    </Suspense>
  );
}
