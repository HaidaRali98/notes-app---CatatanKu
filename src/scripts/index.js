import Swal from 'sweetalert2';
import '../styles/style.css';
import './components/app-bar.js';
import './components/loading-indicator.js';
import './components/note-item.js';
import './components/note-list.js';
import './components/note-form.js';
import {
  archiveNote,
  createNote,
  deleteNote,
  getNotes,
  unarchiveNote,
} from './api.js';

const noteList = document.querySelector('note-list');
const noteForm = document.querySelector('note-form');
const loader = document.querySelector('loading-indicator');
const counter = document.getElementById('noteCount');
const tabButtons = document.querySelectorAll('.tabs__button');

let currentView = 'active';
let pendingRequests = 0;

function setLoading(isLoading) {
  pendingRequests += isLoading ? 1 : -1;
  loader.toggleAttribute('active', pendingRequests > 0);
}

function showError(error) {
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error.message,
    confirmButtonColor: '#a55704',
  });
}

async function withLoading(task) {
  setLoading(true);
  try {
    return await task();
  } catch (error) {
    showError(error);
    return null;
  } finally {
    setLoading(false);
  }
}

async function loadNotes() {
  const notes = await withLoading(() => getNotes(currentView === 'archived'));
  if (!notes) return;
  noteList.notes = notes;
  counter.textContent = `(${notes.length})`;
}

async function runAndReload(task) {
  const result = await withLoading(task);
  if (result) await loadNotes();
  return result;
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentView = button.dataset.view;
    tabButtons.forEach((tab) => {
      tab.setAttribute('aria-pressed', String(tab === button));
    });
    loadNotes();
  });
});

noteForm.addEventListener('note-added', async (event) => {
  const created = await runAndReload(() => createNote(event.detail));
  if (created) noteForm.reset();
});

noteList.addEventListener('note-toggle-archive', (event) => {
  const { id } = event.detail;
  const action = currentView === 'archived' ? unarchiveNote : archiveNote;
  runAndReload(() => action(id));
});

noteList.addEventListener('note-delete', async (event) => {
  const { id } = event.detail;
  const { isConfirmed } = await Swal.fire({
    icon: 'warning',
    title: 'Hapus catatan?',
    text: 'Catatan yang dihapus tidak bisa dikembalikan.',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#a55704',
  });
  if (isConfirmed) runAndReload(() => deleteNote(id));
});

loadNotes();
