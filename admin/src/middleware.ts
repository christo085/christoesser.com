import { defineMiddleware } from 'astro:middleware';
import { isValidSession } from './lib/session';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/login' || context.url.pathname === '/api/admin-auth' || context.url.pathname.startsWith('/_astro')) return next();
  if (!await isValidSession(context.cookies.get('admin_session')?.value)) return context.redirect('/login');
  return next();
});
