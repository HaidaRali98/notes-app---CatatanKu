class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'created-at', 'archived'];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  emit(name) {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        detail: { id: this.getAttribute('note-id') },
      }),
    );
  }

  render() {
    const date = new Date(this.getAttribute('created-at'));
    const dateText = Number.isNaN(date.getTime())
      ? ''
      : new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(date);
    const isArchived = this.hasAttribute('archived');

    this._shadow.innerHTML = `
      <style>
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: block; }
        article {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f3d2af;
          color: #09251c;
          border-left: 6px solid #a55704;
          border-radius: 4px 14px 14px 4px;
          padding: 1.1rem 1.25rem;
          font-family: 'Figtree', system-ui, sans-serif;
        }
        h3 {
          margin: 0 0 0.25rem;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          overflow-wrap: anywhere;
        }
        time {
          display: block;
          font-size: 0.8rem;
          color: #a55704;
          font-weight: 600;
          margin-bottom: 0.6rem;
        }
        p {
          flex: 1;
          margin: 0 0 1rem;
          white-space: pre-line;
          overflow-wrap: anywhere;
        }
        .actions { display: flex; gap: 0.5rem; }
        button {
          padding: 0.35rem 0.8rem;
          border: 2px solid #09251c;
          border-radius: 8px;
          background: transparent;
          color: #09251c;
          font: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover { background: #09251c; color: #f8eadc; }
        .delete { border-color: #a55704; color: #a55704; }
        .delete:hover { background: #a55704; color: #f8eadc; }
      </style>
      <article>
        <h3></h3>
        <time></time>
        <p></p>
        <div class="actions">
          <button class="toggle" type="button"></button>
          <button class="delete" type="button">Hapus</button>
        </div>
      </article>`;

    this._shadow.querySelector('h3').textContent =
      this.getAttribute('note-title') || '';
    this._shadow.querySelector('time').textContent = dateText;
    this._shadow.querySelector('p').textContent =
      this.getAttribute('note-body') || '';
    this._shadow.querySelector('.toggle').textContent = isArchived
      ? 'Pulihkan'
      : 'Arsipkan';

    this._shadow
      .querySelector('.toggle')
      .addEventListener('click', () => this.emit('note-toggle-archive'));
    this._shadow
      .querySelector('.delete')
      .addEventListener('click', () => this.emit('note-delete'));
  }
}

customElements.define('note-item', NoteItem);
