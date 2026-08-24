const BASE_URL = 'https://widely.app/api/public/v1';

export function createWidelyClient(apiKey: string) {
  async function request(method: string, path: string, body?: unknown) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const json = await res.json() as Record<string, unknown>;
    if (!res.ok) throw new Error(`Widely API ${res.status}: ${JSON.stringify(json)}`);
    return json;
  }

  return {
    links: {
      list:    ()                           => request('GET',    '/links'),
      get:     (id: string)                 => request('GET',    `/links/${id}`),
      create:  (body: unknown)              => request('POST',   '/links', body),
      update:  (id: string, body: unknown)  => request('PATCH',  `/links/${id}`, body),
      remove:  (id: string)                 => request('DELETE', `/links/${id}`),
      reorder: (ids: string[])              => request('POST',   '/links/reorder', { ids }),
    },
    profile: {
      get:    ()             => request('GET',   '/profile'),
      update: (body: unknown) => request('PATCH', '/profile', body),
    },
    clicks: {
      list:  (id: string, params?: { limit?: number; offset?: number }) =>
        request('GET', `/links/${id}/clicks${toQuery(params)}`),
      stats: (id: string, params?: { days?: number }) =>
        request('GET', `/links/${id}/stats${toQuery(params)}`),
    },
  };
}

function toQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}
