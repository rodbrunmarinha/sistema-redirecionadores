"use client";

import React, { createContext, useContext } from 'react';

type PermissionsContextType = {
  permissions: string[];
  hasPermission: (perm: string) => boolean;
};

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: [],
  hasPermission: () => false,
});

export function PermissionsProvider({ 
  children, 
  permissions 
}: { 
  children: React.ReactNode; 
  permissions: string[];
}) {
  const hasPermission = (perm: string) => {
    if (permissions.includes('ALL')) return true;
    return permissions.includes(perm);
  };

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}
