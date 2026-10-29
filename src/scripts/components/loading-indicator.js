class LoadingIndicator extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'label'];
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
    const isActive = this.hasAttribute('active');
    this._shadow.innerHTML = `
      <style>
        :host { display: block; }
        .loader {
          display: ${isActive ? 'flex' : 'none'};
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          color: #a55704;
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 600;
        }
        .spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 3px solid #f3d2af;
          border-top-color: #a55704;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
      <div class="loader" role="status" aria-live="polite">
        <span class="spinner"></span>
        <span class="label"></span>
      </div>`;
    this._shadow.querySelector('.label').textContent =
      this.getAttribute('label') || 'Memuat...';
  }
}

customElements.define('loading-indicator', LoadingIndicator);
