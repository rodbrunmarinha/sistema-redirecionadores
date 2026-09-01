"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/app/login");
    router.refresh(); // Força a atualização do layout do servidor para detectar a falta de sessão
  };

  return (
    <button 
      onClick={handleLogout} 
      className="p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" 
      title="Sair da conta"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
