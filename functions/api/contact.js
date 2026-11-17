// Cloudflare Pages Function: POST /api/contact
// Lives in the waitlist project (waitlist.eviephillips.com/api/contact) and is called by
// the contact page at www.eviephillips.com/contact.
// Checks the message, then forwards it to the GoHighLevel inbound webhook stored in the
// GHL_CONTACT_WEBHOOK_URL environment variable (Pages > Settings > Variables).
// The URL is never in this repo.

const ALLOWED = ['https://www.eviephillips.com', 'https://eviephillips.com'];

const cors = (request) => {
  const origin = request.headers.get('origin') || '';
  return {
    'access-control-allow-origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'origin',
  };
};

const json = (request, body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...cors(request) },
  });

const FRIENDLY_ERROR = 'Sorry, your message didn’t go through. Please try again, or email evie@eviephillips.com.';
const TOPICS = ['General question', 'The rested community', 'One-on-one coaching', 'Press, partnerships or speaking'];

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return json(request, { ok: false, error: 'Please try again.' }, 400); }
  if (!d || typeof d !== 'object') return json(request, { ok: false, error: 'Please try again.' }, 400);

  // Honeypot: a hidden field people never see. Bots fill it in; pretend it worked and drop it.
  if (typeof d.website === 'string' && d.website.trim() !== '') return json(request, { ok: true });

  const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const first = str(d.first_name, 80);
  const last = str(d.last_name, 80);
  const email = str(d.email, 254).toLowerCase();
  const message = str(d.message, 5000);
  const topic = TOPICS.includes(d.topic) ? d.topic : 'General question';
  const digits = String(d.phone || '').replace(/\D/g, '');
  let phone = null;
  if (digits.length === 10) phone = '+1' + digits;
  else if (digits.length === 11 && digits[0] === '1') phone = '+' + digits;

  if (!first) return json(request, { ok: false, error: 'Please add your first name.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(request, { ok: false, error: 'Please enter a valid email address.' }, 400);
  if (message.length < 2) return json(request, { ok: false, error: 'Please write a message.' }, 400);

  if (!env.GHL_CONTACT_WEBHOOK_URL) return json(request, { ok: false, error: FRIENDLY_ERROR }, 503);

  // The keys the GoHighLevel "Contact form" workflow is mapped to.
  const payload = {
    first_name: first,
    last_name: last,
    email,
    phone,
    topic,
    message,
    source: 'eviephillips.com/contact',
    submitted_at: new Date().toISOString(),
  };

  try {
    const r = await fetch(env.GHL_CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return json(request, { ok: false, error: FRIENDLY_ERROR }, 502);
  } catch {
    return json(request, { ok: false, error: FRIENDLY_ERROR }, 502);
  }
  return json(request, { ok: true });
}

export const onRequest = ({ request }) => json(request, { ok: false, error: 'method not allowed' }, 405);
