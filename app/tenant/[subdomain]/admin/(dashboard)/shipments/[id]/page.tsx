import { Suspense } from "react";
import ShipmentsClient from "./ShipmentsClient";

export default async function ShipmentsPage(props: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { id } = await props.params;

  // Dummy data based on the provided HTML layout.
  // In a real scenario, fetch this from Supabase using the `id` and `subdomain`.
  const dummyClient = {
    id: id,
    name: "Bruno de Souza",
    email: "rodbrun_dragon@hotmail.com",
    suite: "Dock 1001",
    initials: "B",
    status: "active"
  };

  const dummyStats = {
    pendingPayment: 0,
    awaiting: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0
  };

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 flex justify-center items-center h-full">Carregando envios...</div>}>
      <ShipmentsClient client={dummyClient} stats={dummyStats} />
    </Suspense>
  );
}
