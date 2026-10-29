class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  get titleLimit() {
    return Number(this.getAttribute('title-limit')) || 50;
  }

  get bodyMin() {
    return Number(this.getAttribute('body-min')) || 10;
  }

  connectedCallback() {
    this.render();
    this._form = this._shadow.querySelector('form');
    this._title = this._shadow.querySelector('#title');
    this._body = this._shadow.querySelector('#body');
    this._button = this._shadow.querySelector('button');

    [this._title, this._body].forEach((field) => {
      field.addEventListener('input', () => this.validate(field));
      field.addEventListener('blur', () => this.validate(field));
    });
    this._form.addEventListener('submit', (event) => this.handleSubmit(event));
    this.updateButton();
  }

  messageFor(field) {
    const value = field.value.trim();
    if (field === this._title) {
      if (!value) return 'Judul wajib diisi.';
      if (value.length > this.titleLimit) {
        return `Judul maksimal ${this.titleLimit} karakter.`;
      }
    } else {
      if (!value) return 'Isi catatan wajib diisi.';
      if (value.length < this.bodyMin) {
        return `Isi catatan minimal ${this.bodyMin} karakter.`;
      }
    }
    return '';
  }

  validate(field) {
    const message = this.messageFor(field);
    this._shadow.querySelector(`#${field.id}-error`).textContent = message;
    field.classList.toggle('invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (field === this._title) {
      this._shadow.querySelector('#counter').textContent =
        `${field.value.length}/${this.titleLimit}`;
    }
    this.updateButton();
  }

  updateButton() {
    this._button.disabled = Boolean(
      this.messageFor(this._title) || this.messageFor(this._body),
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this._button.disabled) return;
    this.dispatchEvent(
      new CustomEvent('note-added', {
        bubbles: true,
        composed: true,
        detail: {
          title: this._title.value.trim(),
          body: this._body.value.trim(),
        },
      }),
    );
  }

  reset() {
    this._form.reset();
    this._shadow.querySelectorAll('.error').forEach((el) => {
      el.textContent = '';
    });
    this._shadow.querySelector('#counter').textContent = `0/${this.titleLimit}`;
    this.updateButton();
  }

  render() {
    this._shadow.innerHTML = `
      <style>
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: block; }
        form {
          background: #09251c;
          color: #f8eadc;
          padding: 1.5rem;
          border-radius: 14px;
          font-family: 'Figtree', system-ui, sans-serif;
        }
        h2 {
          margin: 0 0 1rem;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.4rem;
        }
        label { display: block; font-weight: 600; margin-bottom: 0.3rem; }
        .row { display: flex; justify-content: space-between; align-items: baseline; }
        #counter { font-size: 0.8rem; color: #f3d2af; }
        input, textarea {
          width: 100%;
          padding: 0.7rem 0.8rem;
          border: 2px solid transparent;
          border-radius: 8px;
          background: #f8eadc;
          color: #09251c;
          font: inherit;
        }
        textarea { min-height: 140px; resize: vertical; }
        input:focus, textarea:focus { outline: 3px solid #f3d2af; }
        .invalid { border-color: #ff9d7a; }
        .error {
          min-height: 1.3rem;
          margin: 0.25rem 0 0.5rem;
          font-size: 0.85rem;
          color: #ffb899;
        }
        button {
          width: 100%;
          padding: 0.8rem;
          border: 0;
          border-radius: 8px;
          cursor: pointer;
          background: #a55704;
          color: #f8eadc;
          font: inherit;
          font-weight: 600;
        }
        button:hover:not(:disabled) { background: #bd6508; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        button:focus-visible { outline: 3px solid #f3d2af; outline-offset: 2px; }
      </style>
      <form novalidate>
        <h2>Catatan baru</h2>
        <div class="row">
          <label for="title">Judul</label>
          <span id="counter">0/${this.titleLimit}</span>
        </div>
        <input id="title" type="text" name="title" autocomplete="off" aria-describedby="title-error" />
        <p class="error" id="title-error" aria-live="polite"></p>

        <label for="body">Isi catatan</label>
        <textarea id="body" name="body" aria-describedby="body-error"></textarea>
        <p class="error" id="body-error" aria-live="polite"></p>

        <button type="submit">Simpan catatan</button>
      </form>`;
  }
}

customElements.define('note-form', NoteForm);
