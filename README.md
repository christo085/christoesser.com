# Christo Esser

A personal portfolio for Christo Esser: a developer, designer, and maker based in Edinburgh, Scotland.

## Structure

```text
website/  Astro portfolio: christoesser.com
shared/   Shared TypeScript content models
supabase/ Database migrations and storage policies
```

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev:website
```

## Environment variables

The public website requires no environment variables.

## Deployment

Create a Netlify site pointing at this repository:

1. Public site: base directory `website`, build command `npm run build`, publish directory `website/dist` (or use the app-local `netlify.toml`). Set the custom domain to `christoesser.com`.
Set the site base directory to `website`, or use the root configuration.

## Cloudflare DNS

Keep the domain in Cloudflare and add the Netlify-provided CNAME/verification record for the site.

## Content and storage

Project content currently lives in `website/src/lib/content.ts`. The retained `supabase/` migration is not used by the public site.

## Maintenance

Run `npm run check` and `npm run build` before deployment. Keep Supabase migrations versioned, rotate credentials through Netlify/Supabase settings, and maintain regular storage/database backups.
