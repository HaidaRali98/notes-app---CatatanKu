class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ['app-title', 'subtitle'];
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

  render() {
    this._shadow.innerHTML = `
      <style>
        *, *::before, *::after { box-sizing: border-box; }
        :host {
          display: block;
          background: #09251c;
          color: #f8eadc;
          border-bottom: 6px solid #a55704;
        }
        .bar { max-width: 1200px; margin: 0 auto; padding: 1.5rem 1.25rem; }
        h1 {
          margin: 0;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
        }
        p { margin: 0.25rem 0 0; color: #f3d2af; }
      </style>
      <header class="bar">
        <h1></h1>
        <p></p>
      </header>`;
    this._shadow.querySelector('h1').textContent =
      this.getAttribute('app-title') || 'Notes App';
    this._shadow.querySelector('p').textContent =
      this.getAttribute('subtitle') || '';
  }
}

customElements.define('app-bar', AppBar);
