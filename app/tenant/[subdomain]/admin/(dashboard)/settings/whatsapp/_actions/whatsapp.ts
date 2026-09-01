"use server";

import { createClient } from "@supabase/supabase-js";

// Utilitário para pegar o cliente Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EVO_URL = process.env.EVOLUTION_API_URL?.replace(/\/$/, "");
const EVO_KEY = process.env.EVOLUTION_API_KEY;

const getHeaders = () => ({
  "Content-Type": "application/json",
  "apikey": EVO_KEY || "",
});

export async function getWhatsAppStatus(subdomain: string) {
  if (!EVO_URL) throw new Error("EVOLUTION_API_URL não configurada no .env.local");

  const instanceName = `wa_${subdomain}`;

  try {
    const res = await fetch(`${EVO_URL}/instance/connectionState/${instanceName}`, {
      headers: getHeaders(),
      cache: 'no-store'
    });

    const text = await res.text();
    console.log("Evolution STATUS Body:", text.substring(0, 150));

    if (res.status === 404) {
      return { status: "disconnected" };
    }

    const data = JSON.parse(text);
    
    // Mapeamento do status da Evolution para o nosso painel
    // status da evolution: "open", "close", "connecting"
    if (data.instance?.state === "open") return { status: "connected", connected_phone: data.instance?.owner };
    if (data.instance?.state === "connecting") return { status: "connecting" };
    
    return { status: "disconnected" };
  } catch (error: any) {
    console.error("Erro ao checar status da Evolution API:", error);
    return { status: "failed", last_error: error.message };
  }
}

export async function generateWhatsAppQR(subdomain: string) {
  if (!EVO_URL) throw new Error("EVOLUTION_API_URL não configurada");

  const instanceName = `wa_${subdomain}`;

  try {
    // 1. Primeiro tentamos criar a instância
    const createRes = await fetch(`${EVO_URL}/instance/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        instanceName: instanceName,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      })
    });
    
    // Ler como texto primeiro para podermos ver o erro HTML se houver
    const createText = await createRes.text();
    console.log("Evolution CREATE Status:", createRes.status);
    console.log("Evolution CREATE Body:", createText.substring(0, 150)); // Log parcial para debug

    // 2. Conectar e pegar o QR Code base64
    const connectRes = await fetch(`${EVO_URL}/instance/connect/${instanceName}`, {
      headers: getHeaders(),
      cache: 'no-store'
    });

    const connectText = await connectRes.text();
    console.log("Evolution CONNECT Status:", connectRes.status);
    console.log("Evolution CONNECT Body:", connectText.substring(0, 150));

    if (!connectRes.ok) {
       throw new Error(`Erro na API (${connectRes.status}): ${connectText.substring(0, 50)}`);
    }

    const connectData = JSON.parse(connectText);

    if (connectData.base64) {
      return { status: "qr_ready", qr_code: connectData.base64 };
    }

    // Se já estiver conectado, ele não retorna o QR
    if (connectData.instance?.state === "open") {
      return { status: "connected" };
    }

    return { status: "pairing" };

  } catch (error: any) {
    console.error("Erro ao gerar QR Code:", error);
    throw new Error("Não foi possível se comunicar com o servidor de WhatsApp.");
  }
}

export async function disconnectWhatsApp(subdomain: string) {
  if (!EVO_URL) throw new Error("EVOLUTION_API_URL não configurada");

  const instanceName = `wa_${subdomain}`;

  try {
    await fetch(`${EVO_URL}/instance/logout/${instanceName}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    // Também deletamos a instância para limpar tudo
    await fetch(`${EVO_URL}/instance/delete/${instanceName}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao desconectar:", error);
    throw new Error("Erro ao tentar desconectar o WhatsApp.");
  }
}

export async function getWhatsAppGroups(subdomain: string) {
  if (!EVO_URL) throw new Error("EVOLUTION_API_URL não configurada");

  const instanceName = `wa_${subdomain}`;

  try {
    const res = await fetch(`${EVO_URL}/group/fetchAllGroups/${instanceName}?getParticipants=false`, {
      headers: getHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Erro ao buscar grupos:", text);
      throw new Error("Falha ao buscar os grupos na Evolution API.");
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Erro getWhatsAppGroups:", error);
    throw new Error("Erro ao listar os grupos do WhatsApp.");
  }
}
