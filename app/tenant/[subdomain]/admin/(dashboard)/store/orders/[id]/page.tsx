import { Suspense } from "react";
import ClientOrdersClient from "./ClientOrdersClient";

export default async function ClientOrdersPage(props: {
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
    status: "active",
    requiresPicking: false
  };

  const dummyOrders = [
    {
      id: "90",
      number: "ORD-6A905ECEB7CFD",
      date: "27/08/2026",
      time: "12:59",
      items: 1,
      total: 18000.00,
      status: "delivered", // pending, processing, shipped, delivered, cancelled
      payment: "paid" // paid, pending
    }
  ];

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 flex justify-center items-center h-full">Carregando pedidos...</div>}>
      <ClientOrdersClient client={dummyClient} orders={dummyOrders} />
    </Suspense>
  );
}
