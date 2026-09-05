import { Suspense } from "react";
import WalletDetailClient from "./WalletDetailClient";

export default async function WalletDetailPage(props: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { id } = await props.params;
  
  // Dummy data based on the provided HTML layout.
  // In a real scenario, fetch this from Supabase using the `id` and `subdomain`.
  const dummyWallet = {
    id: id,
    customerName: "Bruno de Souza",
    suite: "Dock #1001",
    email: "rodbrun_dragon@hotmail.com",
    initials: "BR",
    availableBalance: 2000.0,
    stats: {
      totalIn: 20000.0,
      totalOut: 18000.0,
      monthIn: 20000.0,
      monthOut: 18000.0,
    },
    transactions: [
      {
        id: "1",
        date: "27/08/2026",
        time: "12:59:10",
        type: "spend",
        description: "Loja Virtual - Pedido #ORD-6A905ECEB7CFD",
        reference: "e708f1d6-8202-4850-a...",
        value: -18000.0,
        balanceAfter: 2000.0,
        balanceBefore: 20000.0,
        status: "confirmed",
        meta: {
          order_id: 90,
          order_number: "ORD-6A905ECEB7CFD",
          allow_negative_balance: false
        }
      },
      {
        id: "2",
        date: "27/08/2026",
        time: "12:58:29",
        type: "adjustment",
        description: "Um Bonus de boas vindas",
        reference: "b52b3547-d1b7-4390-9...",
        value: 20000.0,
        balanceAfter: 20000.0,
        balanceBefore: 0.0,
        status: "confirmed",
        meta: {
          reason: "bonus",
          reason_label: "bonus",
          internal_notes: null,
          admin_id: 92,
          admin_name: "Gabi Vieira",
          ip_address: "177.26.81.165",
          user_agent: "Mozilla/5.0..."
        }
      }
    ]
  };

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 flex justify-center items-center h-full">Carregando carteira...</div>}>
      <WalletDetailClient wallet={dummyWallet} />
    </Suspense>
  );
}
