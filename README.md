# Christo Esser — Digital Headquarters

A dark, cinematic personal portfolio and private CMS for photography, filmmaking, technology, coding, 3D printing, engineering, self-hosting, and creative work.

## Structure

```text
website/  Public Astro portfolio: christoesser.com
admin/    Private Astro CMS: admin.christoesser.com
shared/   Shared TypeScript content models and validation
supabase/ Database migrations and storage policies
```

## Local development

Requirements: Node.js 20+, npm, and a Supabase project.

```bash
npm install
cp website/.env.example website/.env
cp admin/.env.example admin/.env
npm run dev:website
# in another terminal
npm run dev:admin
```

Apply `supabase/migrations/001_initial.sql` in the Supabase SQL editor. Create the first account in Supabase Auth, enable TOTP MFA, and add the account ID to the `admin_users` table.

## Environment variables

Both apps require `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`. The admin app also requires `PUBLIC_SITE_URL`. Never commit real values or service-role keys.

## Deployment

Create two Netlify sites pointing at this repository:

1. Public site: base directory `website`, build command `npm run build`, publish directory `website/dist` (or use the app-local `netlify.toml`). Set the custom domain to `christoesser.com`.
2. Admin site: base directory `admin`, build command `npm run build`, publish directory `admin/dist`. Set the custom domain to `admin.christoesser.com`.

Set the relevant environment variables in each Netlify site. Netlify Forms must be enabled for the public site. Both builds are deployment-ready with the included Netlify configuration and Node 20 setting.

## Cloudflare DNS

Keep the domain in Cloudflare and add the Netlify-provided CNAME/verification records for the apex and `admin` host. Use DNS-only mode while validating the Netlify custom domains if required, then enable proxying once TLS and routing are confirmed. Reserve `photos` as a separate DNS record for the future Immich host; it is intentionally not proxied through this application.

## Content and storage

The public site reads only published rows from Supabase. The dashboard writes albums, photos, projects, and site settings under Row Level Security. Images are stored in the `portfolio-images` bucket with a stable storage adapter boundary, so an Immich-backed adapter can replace the current provider later without changing gallery components.

## Maintenance

Run `npm run check` and `npm run build` before deployment. Keep Supabase migrations versioned, rotate credentials through Netlify/Supabase settings, and maintain regular storage/database backups.
