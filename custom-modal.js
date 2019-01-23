class CustomModal extends HTMLElement {
  constructor() {
    super();
    this._text = 'hi';
    this.attachShadow({ mode: 'open' });
  
    this.shadowRoot.innerHTML = `
      <style>
      
      </style>
      <button>Show</button>
      <p>
          <span><slot></slot></span>
      </p>
    `;
  }
}

customElements.define('jv-modal', CustomModal);