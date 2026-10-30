# Marble City

A natural-stone catalog built with the Next.js App Router, TypeScript, and
Tailwind CSS.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse the catalog.

## Pages

- `/` — Filterable stone collection and product prices.
- `/about` — Sourcing, fabrication, and installation information.
- `/contact` — Client-side inquiry form demonstration.
- `/admin/products` — Public product management page for creating, editing,
  and deleting catalog items.

The floating WhatsApp button opens a chat with the business number configured
in `src/components/whatsapp-button.tsx`.
Product changes are stored in the browser's local storage and are not shared
between devices. The contact form is a front-end demonstration and does not
send messages to a server. Admin routes intentionally have no authentication.
