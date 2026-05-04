export interface Env {
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  STATE_SECRET: string;
  ALLOWED_ORIGIN?: string;
}

const AUTH_PATH = '/auth';
const CALLBACK_PATH = '/callback';
const STATE_COOKIE = 'oauth_state';
const STATE_TTL_SECONDS = 600;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === AUTH_PATH) return startAuth(url, env);
    if (url.pathname === CALLBACK_PATH) return handleCallback(req, url, env);
    return new Response('Decap OAuth proxy', { status: 200 });
  },
};

async function startAuth(url: URL, env: Env): Promise<Response> {
  const provider = url.searchParams.get('provider') ?? 'github';
  if (provider !== 'github') {
    return new Response('Unsupported provider', { status: 400 });
  }

  const scope = url.searchParams.get('scope') ?? 'repo,user';
  const state = crypto.randomUUID();
  const signedState = await signState(state, env.STATE_SECRET);
  const redirectUri = `${url.origin}${CALLBACK_PATH}`;

  const ghUrl = new URL('https://github.com/login/oauth/authorize');
  ghUrl.searchParams.set('client_id', env.OAUTH_CLIENT_ID);
  ghUrl.searchParams.set('redirect_uri', redirectUri);
  ghUrl.searchParams.set('scope', scope);
  ghUrl.searchParams.set('state', signedState);

  return new Response(null, {
    status: 302,
    headers: {
      Location: ghUrl.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${signedState}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${STATE_TTL_SECONDS}`,
    },
  });
}

async function handleCallback(req: Request, url: URL, env: Env): Promise<Response> {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) {
    return renderResult({ error: 'missing_code_or_state' }, 'error', env);
  }

  const cookie = parseCookie(req.headers.get('Cookie'), STATE_COOKIE);
  if (!cookie || !timingSafeEqual(cookie, state) || !(await verifyState(state, env.STATE_SECRET))) {
    return renderResult({ error: 'invalid_state' }, 'error', env);
  }

  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'decap-oauth-proxy',
    },
    body: JSON.stringify({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenResp.ok) {
    return renderResult({ error: 'token_exchange_failed' }, 'error', env);
  }

  const data = (await tokenResp.json()) as { access_token?: string; error?: string };
  if (!data.access_token) {
    return renderResult({ error: data.error ?? 'oauth_failed' }, 'error', env);
  }

  return renderResult({ token: data.access_token, provider: 'github' }, 'success', env);
}

function renderResult(
  payload: Record<string, unknown>,
  status: 'success' | 'error',
  env: Env,
): Response {
  const safePayload = JSON.stringify(payload).replace(/</g, '\\u003c');
  const targetOrigin = env.ALLOWED_ORIGIN ? JSON.stringify(env.ALLOWED_ORIGIN) : `'*'`;
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Authorizing</title></head>
<body><script>
(function() {
  if (!window.opener) {
    document.body.textContent = 'No opener window. Close and retry.';
    return;
  }
  function receive(e) {
    window.opener.postMessage('authorization:github:${status}:${safePayload}', e.origin);
    window.removeEventListener('message', receive, false);
    window.close();
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', ${targetOrigin});
})();
</script></body></html>`;
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    },
  });
}

function parseCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

async function signState(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${value}.${sigB64}`;
}

async function verifyState(signed: string, secret: string): Promise<boolean> {
  const dot = signed.lastIndexOf('.');
  if (dot < 0) return false;
  const value = signed.slice(0, dot);
  const expected = await signState(value, secret);
  return timingSafeEqual(signed, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
