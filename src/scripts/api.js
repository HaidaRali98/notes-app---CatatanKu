const BASE_URL = 'https://notes-api.dicoding.dev/v2';

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksimu.');
  }

  const result = await response.json();
  if (!response.ok || result.status !== 'success') {
    throw new Error(result.message || 'Terjadi kesalahan pada server.');
  }
  return result;
}

export async function getNotes(archived = false) {
  const path = archived ? '/notes/archived' : '/notes';
  const { data } = await request(path);
  return data;
}

export async function createNote({ title, body }) {
  const { data } = await request('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  return data;
}

export function deleteNote(id) {
  return request(`/notes/${id}`, { method: 'DELETE' });
}

export function archiveNote(id) {
  return request(`/notes/${id}/archive`, { method: 'POST' });
}

export function unarchiveNote(id) {
  return request(`/notes/${id}/unarchive`, { method: 'POST' });
}
