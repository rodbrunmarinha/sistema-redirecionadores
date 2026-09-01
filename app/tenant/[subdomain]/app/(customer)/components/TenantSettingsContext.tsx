"use client";
import React, { createContext, useContext, ReactNode } from "react";

type TenantSettingsContextType = {
  settings: any;
  currency: string;
  currencySymbol: string;
  weightUnit: string;
};

const TenantSettingsContext = createContext<TenantSettingsContextType | null>(null);

export function TenantSettingsProvider({ 
  children, 
  settings 
}: { 
  children: ReactNode; 
  settings: any; 
}) {
  const currency = settings?.operations?.currency || "USD";
  const currencySymbol = currency === "BRL" ? "R$" : currency === "EUR" ? "€" : currency === "JPY" ? "¥" : "$";
  const weightUnit = settings?.operations?.weightUnit || "kg";

  return (
    <TenantSettingsContext.Provider value={{ settings, currency, currencySymbol, weightUnit }}>
      {children}
    </TenantSettingsContext.Provider>
  );
}

export function useTenantSettings() {
  const context = useContext(TenantSettingsContext);
  if (!context) {
    throw new Error("useTenantSettings must be used within a TenantSettingsProvider");
  }
  return context;
}
