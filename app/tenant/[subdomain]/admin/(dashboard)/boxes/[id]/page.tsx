import { Suspense } from "react";
import ClientBoxesClient from "./ClientBoxesClient";

export default async function ClientBoxesPage(props: {
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

  const dummyBoxes = [
    {
      id: "6332",
      date: "27/08/2026 12:59",
      tracking: "STORE-ORD-6A905ECEB7CFD",
      store: "Loja Virtual",
      location: null,
      products: [
        { image: "https://gabisdaily.boxsuite.com.br/storage/received-products/rp_6a905ecebe4ec.jpg", isBox: false }
      ],
      weight: "1,600 kg"
    },
    {
      id: "5874",
      date: "23/08/2026 20:07",
      tracking: "PROD123456",
      store: "Mercari",
      location: "A-01-01",
      products: [
        { image: "https://gabisdaily.boxsuite.com.br/storage/received-boxes/YfOPd46O8szMMFl5wCpr5UwhaO4MSYnz7RrPfikK.png", isBox: true },
        { image: "https://gabisdaily.boxsuite.com.br/storage/received-products/xns1Her9CbztXRu8g8qfedOQP1a6sO8wBvuqbpZY.webp", isBox: false },
        { image: "https://gabisdaily.boxsuite.com.br/storage/received-products/dUhVJzWz2mAhCNEd8MWBf0NymUlIvxxjqRbu925L.png", isBox: false }
      ],
      weight: "3,380 kg"
    }
  ];

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 flex justify-center items-center h-full">Carregando caixas...</div>}>
      <ClientBoxesClient client={dummyClient} boxes={dummyBoxes} />
    </Suspense>
  );
}
