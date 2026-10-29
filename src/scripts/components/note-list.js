import { gsap } from 'gsap';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._notes = [];
  }

  set notes(value) {
    this._notes = value;
    this.render();
  }

  get notes() {
    return this._notes;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._shadow.innerHTML = `
      <style>
        :host { display: block; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .empty {
          color: #a55704;
          font-family: 'Figtree', system-ui, sans-serif;
        }
      </style>
      <div class="grid"></div>`;

    const grid = this._shadow.querySelector('.grid');
    if (this._notes.length === 0) {
      grid.innerHTML = '<p class="empty">Belum ada catatan di sini.</p>';
      return;
    }

    const items = this._notes.map((note) => {
      const item = document.createElement('note-item');
      item.setAttribute('note-id', note.id);
      item.setAttribute('note-title', note.title);
      item.setAttribute('note-body', note.body);
      item.setAttribute('created-at', note.createdAt);
      if (note.archived) item.setAttribute('archived', '');
      grid.appendChild(item);
      return item;
    });

    gsap.from(items, {
      opacity: 0,
      y: 16,
      duration: 0.4,
      stagger: 0.05,
    });
  }
}

customElements.define('note-list', NoteList);
