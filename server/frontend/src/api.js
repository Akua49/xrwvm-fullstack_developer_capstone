export async function api(url, options={}) {
  const headers = {'Content-Type':'application/json', ...(options.headers || {})};
  if (options.method && options.method !== 'GET') {
    const session = await fetch('/djangoapp/session').then(r=>r.json());
    headers['X-CSRFToken'] = session.csrfToken;
  }
  const res = await fetch(url, {...options, headers, credentials:'same-origin'});
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
