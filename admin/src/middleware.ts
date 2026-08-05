import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/login' || context.url.pathname.startsWith('/_astro')) return next();
  const supabase = createServerClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name: string) => context.cookies.get(name)?.value,
      set: (name: string, value: string, options: Record<string, unknown>) => context.cookies.set(name, value, options),
      remove: (name: string, options: Record<string, unknown>) => context.cookies.delete(name, options)
    }
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return context.redirect('/login');
  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== 'aal2' && assurance?.nextLevel === 'aal2') return context.redirect('/login?mfa=required');
  return next();
});
