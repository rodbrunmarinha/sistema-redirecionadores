"use client";

import { useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush, checkSubscription } from "@/app/tenant/[subdomain]/app/(customer)/_actions/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager({ subdomain }: { subdomain: string }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        // Validate with server
        const isValid = await checkSubscription(sub.endpoint, subdomain);
        setIsSubscribed(isValid);
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }

  async function subscribe() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      
      // Save to database via server action
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeToPush(serializedSub, subdomain);
      setIsSubscribed(true);
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Falha ao ativar notificações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribe() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await unsubscribeFromPush(sub.endpoint, subdomain);
      }
      setIsSubscribed(false);
    } catch (error) {
      console.error("Unsubscribe failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="text-xs text-zinc-500">
        Notificações Push não são suportadas no seu navegador atual.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div>
          <h4 className="text-sm font-semibold text-white">Notificações em Tempo Real</h4>
          <p className="text-xs text-zinc-400 mt-0.5">Seja avisado assim que suas caixas chegarem</p>
        </div>
        <button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
            isSubscribed 
              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" 
              : "bg-amber-600 text-white hover:bg-amber-500"
          }`}
        >
          {isLoading ? "Processando..." : isSubscribed ? "Desativar" : "Ativar Notificações"}
        </button>
      </div>
    </div>
  );
}
