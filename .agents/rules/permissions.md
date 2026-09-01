---
name: Enforce Role Permissions
description: Always use hasPermission for new UI elements and requirePermission for Server Actions.
trigger: always_on
---
# Role Permissions Rule
Toda página ou botão novo que criarmos daqui pra frente, só precisamos usar `hasPermission('nome_da_permissao')` para a UI (via `usePermissions()` do `PermissionsProvider`) e `await requirePermission('nome_da_permissao')` para Server Actions (`@/utils/auth`), com base nas opções de permissão que temos na página de permissões (`PermissionsClient.tsx`).
