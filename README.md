# The Rested + Evie Phillips — marketing pages

One GitHub repo, three websites (the homepage site also serves /links and /book). Each website is its own Cloudflare Pages project
that publishes automatically a minute or two after a commit to `main`.

| Website | What it's for | Folder in this repo | Cloudflare Pages project |
|---|---|---|---|
| https://www.eviephillips.com | Evie's homepage / About. Linked from "About" in the Kajabi member menu. | `home/` | `evie-phillips-home` |
| https://www.eviephillips.com/links | Link in bio (replaces Stan Store). Put this in Instagram/TikTok bios. | `home/links/` | `evie-phillips-home` |
| https://www.eviephillips.com/book | 1:1 coaching booking page ($597 → $333), GHL calendar embedded. | `home/book/` | `evie-phillips-home` |
| https://join.eviephillips.com | The Rested **sales page** (cart open). Buttons go to Kajabi checkout. | `sales/` | `rested-community-join` |
| https://waitlist.eviephillips.com | The Rested **waitlist** (cart closed). Form sends signups to GoHighLevel. | root: `index.html`, `assets/`, `functions/` | `rested-community-waitlist` |

Lives in **Kajabi**, not here: checkout, the Builders' Circle upsell page, the member library,
and the Contact page. (`upgrade/` is an old placeholder and isn't used.)

## The funnel

eviephillips.com → "Join the Rested" → join.eviephillips.com → Kajabi checkout ($27/mo)
→ Builders' Circle upsell (Kajabi) → member library (Kajabi).
When doors close, the homepage buttons switch to the waitlist (see below).

## Rules

- Change only the folder for the website you mean to change. Editing `sales/` never touches
  the waitlist or homepage, and the other way around.
- Never push without Evie's yes.
- Never print or change `GHL_WEBHOOK_URL` (waitlist form setting in Cloudflare).
- Contact email everywhere: evie@eviephillips.com.

## Common edits

- **Close doors (Sunday):** in `home/index.html`, find `joinMode: "open"` near the bottom and change it to
  `joinMode: "waitlist"`. Every Join button on the homepage then goes to the waitlist.
- **Booking link:** in `home/index.html`, `bookUrl:` points to `/book/` (the branded booking page).
- **Link in bio:** `home/links/` → eviephillips.com/links. Replaces Stan Store.
- **Booking page:** `home/book/` → eviephillips.com/book. $597 → $333 offer with the GHL calendar embedded (The Rested sub-account, "One-on-One Coaching Call with Evie").
- **My Story photos:** `home/story/photos/` → eviephillips.com/story/photos/… These are the photos for the "My Story: Defined by Grace" lesson in Kajabi (Start Here). Swap a photo by replacing the file with one of the same name.
- **Homepage photos:** put the new photo in `home/assets/` and change the matching `src="assets/..."`.

## How an edit goes live

1. Edit the file (in a Claude session, or GitHub → the file → pencil icon).
2. Commit to `main` with a short note of what changed.
3. Cloudflare publishes it. Check the live site after a minute or two.

## Link in bio + 1:1 booking

**eviephillips.com/links** (`home/links/index.html`) is the link in bio for Instagram and TikTok. It replaced Stan Store.
- Buttons: Join the rested Community → join.eviephillips.com · Work with Evie → /book · More about Evie → / (homepage).
- Icons, in order: Instagram, TikTok, LinkedIn, email (evie@eviephillips.com).
- Photo: `home/assets/links-hero.jpg`. To change it, replace that file with a new one of the same name.

**eviephillips.com/book** (`home/book/index.html`) sells the 1:1 coaching call.
- Shows $597 crossed out and $333. These are just text on the page; edit both spots if the price changes.
- The calendar on the page is embedded from GoHighLevel: sub-account **The Rested by Evie Phillips** → Calendars →
  **One-on-One Coaching Call with Evie** (1 hour, assigned to Evie, weekdays 8–5 ET by default).
- Payment happens inside that GHL calendar: Advanced settings → Payments, Live mode, charges $333 upfront through
  the sub-account's Stripe connection. **If the price changes, change it in GHL too**, or the page and the charge won't match.
- Direct booking link (no branding): https://api.leadconnectorhq.com/widget/bookings/coaching-call-with-evie
- The homepage's "Book a 1:1" button goes here (`bookUrl: "/book/"` in `home/index.html`).

## Re-exporting the waitlist from the design canvas

`tools/export.py <Main.dc.html> <folder with the canvas's /_blob images> <this repo>` turns the canvas file into
`index.html` + `assets/`. The hand-drawn icons live in `assets/icons/`.
