-- Dar permissão de leitura para usuários logados nas carteiras e transações
GRANT SELECT ON public.wallets TO authenticated;
GRANT SELECT ON public.wallet_transactions TO authenticated;

-- Garantir que a API consiga acessar
GRANT SELECT ON public.wallets TO anon;
GRANT SELECT ON public.wallet_transactions TO anon;
GRANT SELECT ON public.wallets TO service_role;
GRANT SELECT ON public.wallet_transactions TO service_role;