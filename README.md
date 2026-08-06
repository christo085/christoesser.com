# Christo Esser

A dark, brutalist personal portfolio and private CMS for photography, filmmaking, technology, coding, 3D printing, engineering, self-hosting, and creative work.

## Structure

```text
website/  Public Astro portfolio: christoesser.com
admin/    Private Astro CMS: admin.christoesser.com
shared/   Shared TypeScript content models and validation
supabase/ Database migrations and storage policies
```

## Local development

Requirements: Node.js 20+ and npm. Supabase is not required for the current public site or temporary admin dashboard.

```bash
npm install
cp website/.env.example website/.env
cp admin/.env.example admin/.env
npm run dev:website
# in another terminal
npm run dev:admin
```

The admin dashboard currently uses temporary password authentication. Set `ADMIN_PASSWORD` in the admin environment before running or deploying it. The password is checked server-side and stored in an HTTP-only session cookie. This is a temporary bridge, not the final identity system.

## Environment variables

The public website requires no environment variables. The temporary admin dashboard requires only the server-side `ADMIN_PASSWORD`. Do not use a shared password as the final production authentication system.

## Deployment

Create two Netlify sites pointing at this repository:

1. Public site: base directory `website`, build command `npm run build`, publish directory `website/dist` (or use the app-local `netlify.toml`). Set the custom domain to `christoesser.com`.
2. Admin site: base directory `admin`, build command `npm run build`, publish directory `admin/dist`. Set the custom domain to `admin.christoesser.com`.

Set the relevant environment variables in each Netlify site. Netlify Forms must be enabled for the public site. Both builds are deployment-ready with the included Netlify configuration and Node 20 setting.

## Cloudflare DNS

Keep the domain in Cloudflare and add the Netlify-provided CNAME/verification records for the apex and `admin` host. Use DNS-only mode while validating the Netlify custom domains if required, then enable proxying once TLS and routing are confirmed. Reserve `photos` as a separate DNS record for the future Immich host; it is intentionally not proxied through this application.

## Content and storage

The admin dashboard now stores content and uploaded images in a Netlify Blobs site store named `christo-content`. Set `PUBLIC_CONTENT_API_URL` on the public Netlify site to the admin endpoint, for example `https://admin.christoesser.com/api/content`; the public app reads only published content and still builds without that variable by showing empty states. The retained `supabase/` migration documents an optional future backend and is not required.

## Maintenance

Run `npm run check` and `npm run build` before deployment. Keep Supabase migrations versioned, rotate credentials through Netlify/Supabase settings, and maintain regular storage/database backups.
