class CustomModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  
    this.shadowRoot.innerHTML = `
      <style>
      
        #backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, .75);
          z-index: 10;
          
          /* Hide modal by default */
          opacity: 0;
          pointer-events: none;
        }
        
        #modal {
          position: fixed;
          top: 10vh;
          left: 25%;
          width: 50%;
          /* height: 30rem; Set to have a height with no content */
          background: white;
          z-index: 100;
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, .26);
          
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          /* Hide modal by default */
          opacity: 0;
          pointer-events: none;
          
          /* Animate on appearance */
          transition: all .3s ease-out;
        }
        
        /* Show modal if opened attribute */
        :host([opened]) #backdrop,
        :host([opened]) #modal {
          opacity: 1;
          pointer-events: all;
        }
        
        /* For transition */
        :host([opened]) #modal {
          top: 15vh;
        }
        
        header {
          padding: 1rem;
          border-bottom: 1px solid #ccc;
        }
        
        ::slotted(h1) {
          font-size: 1.25rem;
          margin: 0;
        }
        
        #main {
          padding: 1rem;
        }
        
        #actions {
          border-top: 1px solid #ccc;
          padding: 1rem;
          
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }
        
        #actions button {
          margin: 0 .25rem;
        }
        
        #actions__cancel {
          color: white;
          background-color: red;
        }
        
        #actions__confirm {
          color: white;
          background-color: green;
        }
        
      </style>
      <div id="backdrop">
      
      </div>
      <div id="modal">
        <header>
          <slot name="title">Please confirm payment</slot>
        </header>
        <section id="main">
          <slot></slot>
        </section>
        <section id="actions">
          <button id="actions__cancel">Cancel</button>
          <button id="actions__confirm">Confirm</button>
        </section>
      </div>
    `;
  
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots[1].addEventListener('slotchange', event => {
      console.dir(slots[1].assignedNodes()[2].assignedSlot);
    });
    
    // Create listeners to our modal buttons
    const cancelBtn = this.shadowRoot.querySelector('#actions__cancel');
    const confirmBtn = this.shadowRoot.getElementById('actions__confirm');
    
    cancelBtn.addEventListener('click', this._cancel.bind(this));
    confirmBtn.addEventListener('click', this._confirm.bind(this));
    
    // Close modal on clicking in backdrop
    const backdrop = this.shadowRoot.getElementById('backdrop');
    backdrop.addEventListener('click', this._cancel.bind(this));
  }
  
  // Change styles or do other JS operations when attribute changes
  // Changed for CSS attribute selector: :host([opened]){ }
  // attributeChangedCallback(name, oldValue, newValue) {
  //   if (name === 'opened') {
  //     if (this.hasAttribute('opened')) {
  //       this.shadowRoot.querySelector('#backdrop').style.opacity = '1';
  //       this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
  //
  //       this.shadowRoot.querySelector('#modal').style.opacity = '1';
  //       this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
  //     }
  //   }
  // }
  //
  // static get observedAttributes() {
  //   return ['opened'];
  // }
  
  open() {
    this.setAttribute('opened', '');
  }
  
  hide() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened');
    }
  }
  
  _cancel(event) {
    const cancelEvent = new Event('cancel', {
      bubbles: true,
      composed: true
    });
    // This is the button generated event and we are creating a new event out of it.
    event.target.dispatchEvent(cancelEvent);
    this.hide();
  }
  
  _confirm(event) {
    this.hide();
    const confirmEvent = new Event('confirm');
    this.dispatchEvent(confirmEvent);
  }
}

customElements.define('jv-modal', CustomModal);