/**
 * Bottom Sheet Web Component
 * A customizable bottom sheet component with declarative API
 * 
 * @example
 * <!-- Declarative usage -->
 * <bottom-sheet heading="Welcome" open>
 *   <p>Content here</p>
 * </bottom-sheet>
 * 
 * @example
 * // Programmatic usage
 * const sheet = document.createElement('bottom-sheet');
 * sheet.heading = 'Title';
 * sheet.open();
 */

class BottomSheet extends HTMLElement {
  static get observedAttributes() {
    return [
      'heading',
      'description',
      'size',
      'open',
      'block-bg',
      'drag-close',
      'icon-left',
      'icon-right',
      'progress-mode'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Internal state
    this._isOpen = false;
    this._progress = 0;
    this._dragStartY = 0;
    this._dragCurrentY = 0;
    
    // Bind methods
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
    this._handleBackdropClick = this._handleBackdropClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    // If open attribute exists, open the sheet
    if (this.hasAttribute('open')) {
      setTimeout(() => this.open(), 10);
    }
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch(name) {
      case 'open':
        if (newValue !== null && !this._isOpen) {
          this.open();
        } else if (newValue === null && this._isOpen) {
          this.close();
        }
        break;
      case 'heading':
        this._updateHeading(newValue);
        break;
      case 'description':
        this._updateDescription(newValue);
        break;
      case 'size':
        this._updateSize(newValue);
        break;
      case 'block-bg':
        this._updateBlockBg(newValue !== null);
        break;
      case 'drag-close':
        this._updateDragClose(newValue !== null);
        break;
      case 'icon-left':
        this._updateIcon('left', newValue);
        break;
      case 'icon-right':
        this._updateIcon('right', newValue);
        break;
      case 'progress-mode':
        this._updateProgressMode(newValue);
        break;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          --sheet-bg: #ffffff;
          --sheet-border-radius: 16px;
          --sheet-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          --sheet-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --sheet-max-width: 600px;
          --sheet-header-padding: 16px;
          --sheet-content-padding: 20px;
          --sheet-footer-padding: 16px;
          --backdrop-bg: rgba(0, 0, 0, 0.5);
          --drag-handle-width: 40px;
          --drag-handle-height: 4px;
          --drag-handle-bg: #d0d0d0;
          --icon-size: 24px;
          --progress-height: 3px;
          --progress-bg: #e0e0e0;
          --progress-fill: #2196f3;
          
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          pointer-events: none;
        }

        :host([open]) {
          pointer-events: auto;
        }

        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--backdrop-bg);
          opacity: 0;
          transition: opacity var(--sheet-transition);
          pointer-events: none;
          z-index: -1;
        }

        :host([open]) .backdrop {
          opacity: 1;
          pointer-events: auto;
        }

        :host([block-bg]) .backdrop {
          display: block;
        }

        :host(:not([block-bg])) .backdrop {
          display: none;
        }

        .sheet-container {
          background: var(--sheet-bg);
          border-radius: var(--sheet-border-radius) var(--sheet-border-radius) 0 0;
          box-shadow: var(--sheet-shadow);
          max-width: var(--sheet-max-width);
          margin: 0 auto;
          transform: translateY(100%);
          transition: transform var(--sheet-transition);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        :host([open]) .sheet-container {
          transform: translateY(0);
        }

        :host([size="full"]) .sheet-container {
          max-height: 100vh;
          border-radius: 0;
        }

        :host([size="content"]) .sheet-container {
          max-height: 90vh;
        }

        /* Header */
        .sheet-header {
          flex-shrink: 0;
        }

        .drag-handle-wrapper {
          display: flex;
          justify-content: center;
          padding: 12px;
          cursor: grab;
        }

        .drag-handle-wrapper:active {
          cursor: grabbing;
        }

        .drag-handle {
          width: var(--drag-handle-width);
          height: var(--drag-handle-height);
          background: var(--drag-handle-bg);
          border-radius: 2px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: var(--sheet-header-padding);
          padding-top: 0;
        }

        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
          color: inherit;
          flex-shrink: 0;
        }

        .icon-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .icon-button:active {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .icon-button.hidden {
          display: none;
        }

        .sheet-info {
          flex: 1;
          min-width: 0;
        }

        .sheet-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.3;
        }

        .sheet-title:empty {
          display: none;
        }

        .sheet-description {
          font-size: 14px;
          color: #666;
          margin: 4px 0 0;
          line-height: 1.4;
        }

        .sheet-description:empty {
          display: none;
        }

        .progress-bar {
          height: var(--progress-height);
          background: var(--progress-bg);
          position: relative;
          overflow: hidden;
        }

        .progress-bar.hidden {
          display: none;
        }

        .progress-fill {
          height: 100%;
          background: var(--progress-fill);
          transition: width 0.3s ease;
          width: 0%;
        }

        .progress-bar[data-mode="inf"] .progress-fill {
          width: 30%;
          animation: indeterminate 1.5s infinite ease-in-out;
        }

        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        /* Content */
        .content-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--sheet-content-padding);
          overscroll-behavior: contain;
        }

        .content-container::-webkit-scrollbar {
          width: 6px;
        }

        .content-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .content-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }

        /* Footer */
        .sheet-footer {
          flex-shrink: 0;
          padding: var(--sheet-footer-padding);
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .sheet-footer:empty {
          display: none;
        }

        ::slotted([slot="cta-primary"]),
        ::slotted([slot="cta-secondary"]) {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        ::slotted([slot="cta-primary"]) {
          background: #2196f3;
          color: white;
        }

        ::slotted([slot="cta-secondary"]) {
          background: transparent;
          color: #2196f3;
          border: 1px solid #2196f3;
        }

        /* Material Icons Support */
        .material-symbols-outlined {
          font-size: var(--icon-size);
          user-select: none;
        }

        /* Parts for external styling */
        .sheet-container {
          /* can be styled with ::part(container) */
        }
      </style>

      <div class="backdrop" part="backdrop"></div>
      
      <div class="sheet-container" part="container">
        <div class="sheet-header" part="header">
          <div class="drag-handle-wrapper" part="drag-handle-wrapper">
            <div class="drag-handle" part="drag-handle"></div>
          </div>

          <div class="header-content">
            <button class="icon-button icon-left" part="icon-left" aria-label="Back">
              <slot name="icon-left">
                <span class="material-symbols-outlined">arrow_back</span>
              </slot>
            </button>

            <div class="sheet-info">
              <h2 class="sheet-title" part="title"></h2>
              <p class="sheet-description" part="description"></p>
            </div>

            <button class="icon-button icon-right" part="icon-right" aria-label="Close">
              <slot name="icon-right">
                <span class="material-symbols-outlined">close</span>
              </slot>
            </button>
          </div>

          <div class="progress-bar hidden" part="progress">
            <div class="progress-fill"></div>
          </div>
        </div>

        <div class="content-container" part="content">
          <slot></slot>
        </div>

        <div class="sheet-footer" part="footer">
          <slot name="cta-secondary"></slot>
          <slot name="cta-primary"></slot>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const iconLeft = this.shadowRoot.querySelector('.icon-left');
    const iconRight = this.shadowRoot.querySelector('.icon-right');
    const backdrop = this.shadowRoot.querySelector('.backdrop');
    const dragHandle = this.shadowRoot.querySelector('.drag-handle-wrapper');

    iconLeft.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('icon-left-click', { 
        bubbles: true, 
        composed: true,
        detail: { sheet: this }
      }));
    });

    iconRight.addEventListener('click', () => {
      this.close();
    });

    backdrop.addEventListener('click', this._handleBackdropClick);

    // Setup drag close if enabled
    if (this.hasAttribute('drag-close') || !this.hasAttribute('drag-close')) {
      this._setupDragClose();
    }

    // Handle escape key
    this._handleEscape = (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', this._handleEscape);
  }

  cleanup() {
    const dragHandle = this.shadowRoot.querySelector('.drag-handle-wrapper');
    if (dragHandle) {
      dragHandle.removeEventListener('mousedown', this._handleDragStart);
      dragHandle.removeEventListener('touchstart', this._handleDragStart);
    }
    
    document.removeEventListener('mousemove', this._handleDragMove);
    document.removeEventListener('touchmove', this._handleDragMove);
    document.removeEventListener('mouseup', this._handleDragEnd);
    document.removeEventListener('touchend', this._handleDragEnd);
    document.removeEventListener('keydown', this._handleEscape);
  }

  _setupDragClose() {
    const dragHandle = this.shadowRoot.querySelector('.drag-handle-wrapper');
    if (!dragHandle) return;

    dragHandle.addEventListener('mousedown', this._handleDragStart);
    dragHandle.addEventListener('touchstart', this._handleDragStart, { passive: true });
  }

  _handleDragStart(e) {
    if (!this.hasAttribute('drag-close') && this.getAttribute('drag-close') !== '') return;

    this._dragStartY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    this._isDragging = true;

    document.addEventListener('mousemove', this._handleDragMove);
    document.addEventListener('touchmove', this._handleDragMove, { passive: true });
    document.addEventListener('mouseup', this._handleDragEnd);
    document.addEventListener('touchend', this._handleDragEnd);
  }

  _handleDragMove(e) {
    if (!this._isDragging) return;

    const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    this._dragCurrentY = currentY - this._dragStartY;

    // Only allow dragging down
    if (this._dragCurrentY > 0) {
      const container = this.shadowRoot.querySelector('.sheet-container');
      container.style.transform = `translateY(${this._dragCurrentY}px)`;
      container.style.transition = 'none';
    }
  }

  _handleDragEnd() {
    if (!this._isDragging) return;

    this._isDragging = false;
    const container = this.shadowRoot.querySelector('.sheet-container');
    
    // Close if dragged more than 100px
    if (this._dragCurrentY > 100) {
      this.close();
    } else {
      // Reset position
      container.style.transform = '';
      container.style.transition = '';
    }

    this._dragCurrentY = 0;

    document.removeEventListener('mousemove', this._handleDragMove);
    document.removeEventListener('touchmove', this._handleDragMove);
    document.removeEventListener('mouseup', this._handleDragEnd);
    document.removeEventListener('touchend', this._handleDragEnd);
  }

  _handleBackdropClick(e) {
    if (e.target === this.shadowRoot.querySelector('.backdrop')) {
      this.close();
    }
  }

  _updateHeading(value) {
    const title = this.shadowRoot.querySelector('.sheet-title');
    if (title) {
      title.textContent = value || '';
    }
  }

  _updateDescription(value) {
    const description = this.shadowRoot.querySelector('.sheet-description');
    if (description) {
      description.textContent = value || '';
    }
  }

  _updateSize(value) {
    // Size is handled by attribute in CSS
  }

  _updateBlockBg(enabled) {
    // Block-bg is handled by attribute in CSS
  }

  _updateDragClose(enabled) {
    const dragHandle = this.shadowRoot.querySelector('.drag-handle-wrapper');
    if (dragHandle) {
      dragHandle.style.display = enabled ? 'flex' : 'none';
    }
  }

  _updateIcon(position, value) {
    const icon = this.shadowRoot.querySelector(`.icon-${position} .material-symbols-outlined`);
    if (icon && value) {
      icon.textContent = value;
    }
    
    const button = this.shadowRoot.querySelector(`.icon-${position}`);
    if (button) {
      button.classList.toggle('hidden', !value);
    }
  }

  _updateProgressMode(mode) {
    const progressBar = this.shadowRoot.querySelector('.progress-bar');
    if (progressBar) {
      if (mode) {
        progressBar.classList.remove('hidden');
        progressBar.dataset.mode = mode;
      } else {
        progressBar.classList.add('hidden');
      }
    }
  }

  // Public API - Properties
  get open() {
    return this._isOpen;
  }

  set open(value) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get heading() {
    return this.getAttribute('heading') || '';
  }

  set heading(value) {
    this.setAttribute('heading', value);
  }

  get description() {
    return this.getAttribute('description') || '';
  }

  set description(value) {
    this.setAttribute('description', value);
  }

  get size() {
    return this.getAttribute('size') || 'content';
  }

  set size(value) {
    this.setAttribute('size', value);
  }

  get blockBg() {
    return this.hasAttribute('block-bg');
  }

  set blockBg(value) {
    if (value) {
      this.setAttribute('block-bg', '');
    } else {
      this.removeAttribute('block-bg');
    }
  }

  get dragClose() {
    return this.hasAttribute('drag-close');
  }

  set dragClose(value) {
    if (value) {
      this.setAttribute('drag-close', '');
    } else {
      this.removeAttribute('drag-close');
    }
  }

  get progress() {
    return this._progress;
  }

  set progress(value) {
    this._progress = Math.max(0, Math.min(1, value));
    this.setProgress(this._progress);
  }

  // Public API - Methods
  /**
   * Opens the bottom sheet
   * @fires sheet-open
   * @returns {BottomSheet} Returns this for chaining
   */
  open() {
    if (this._isOpen) return this;
    
    this._isOpen = true;
    this.setAttribute('open', '');
    
    this.dispatchEvent(new CustomEvent('sheet-open', {
      bubbles: true,
      composed: true,
      detail: { sheet: this }
    }));

    // Prevent body scroll when sheet is open
    document.body.style.overflow = 'hidden';

    return this;
  }

  /**
   * Closes the bottom sheet
   * @fires sheet-close
   * @returns {BottomSheet} Returns this for chaining
   */
  close() {
    if (!this._isOpen) return this;

    this._isOpen = false;
    
    this.dispatchEvent(new CustomEvent('sheet-close', {
      bubbles: true,
      composed: true,
      detail: { sheet: this }
    }));

    // Wait for animation before removing attribute
    setTimeout(() => {
      this.removeAttribute('open');
      document.body.style.overflow = '';
    }, 300);

    return this;
  }

  /**
   * Toggles the bottom sheet open/closed state
   * @returns {BottomSheet} Returns this for chaining
   */
  toggle() {
    return this._isOpen ? this.close() : this.open();
  }

  /**
   * Updates the content of the sheet
   * @param {HTMLElement|string} content - New content to display
   * @returns {BottomSheet} Returns this for chaining
   */
  updateContent(content) {
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    const container = slot?.parentElement;
    
    if (container) {
      // Clear existing content
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      
      // Add new content
      if (typeof content === 'string') {
        this.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        this.appendChild(content);
      }
    }

    return this;
  }

  /**
   * Sets the progress bar value
   * @param {number} value - Progress value between 0 and 1
   * @returns {BottomSheet} Returns this for chaining
   */
  setProgress(value) {
    const progressBar = this.shadowRoot.querySelector('.progress-bar');
    const progressFill = this.shadowRoot.querySelector('.progress-fill');
    
    if (progressBar && progressFill) {
      if (value >= 1) {
        progressBar.classList.add('hidden');
      } else {
        progressBar.classList.remove('hidden');
        progressFill.style.width = `${value * 100}%`;
      }
    }

    return this;
  }

  /**
   * Sets the heading text
   * @param {string} text - New heading text
   * @returns {BottomSheet} Returns this for chaining
   */
  setHeading(text) {
    this.heading = text;
    return this;
  }

  /**
   * Sets the description text
   * @param {string} text - New description text
   * @returns {BottomSheet} Returns this for chaining
   */
  setDescription(text) {
    this.description = text;
    return this;
  }
}

// Register the custom element
customElements.define('bottom-sheet', BottomSheet);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BottomSheet;
}

/**
 * USAGE EXAMPLES
 * 
 * 1. Declarative HTML:
 * 
 * <bottom-sheet heading="Welcome" description="Get started" open block-bg drag-close>
 *   <p>Your content here</p>
 *   <button slot="cta-primary">Continue</button>
 *   <button slot="cta-secondary">Cancel</button>
 * </bottom-sheet>
 * 
 * 
 * 2. Programmatic JavaScript:
 * 
 * const sheet = document.createElement('bottom-sheet');
 * sheet.heading = 'Settings';
 * sheet.description = 'Manage your preferences';
 * sheet.blockBg = true;
 * sheet.innerHTML = '<p>Settings content</p>';
 * document.body.appendChild(sheet);
 * sheet.open();
 * 
 * 
 * 3. With Event Listeners:
 * 
 * const sheet = document.querySelector('bottom-sheet');
 * 
 * sheet.addEventListener('sheet-open', (e) => {
 *   console.log('Sheet opened!', e.detail.sheet);
 * });
 * 
 * sheet.addEventListener('sheet-close', (e) => {
 *   console.log('Sheet closed!', e.detail.sheet);
 * });
 * 
 * sheet.addEventListener('icon-left-click', (e) => {
 *   console.log('Left icon clicked!');
 *   sheet.close();
 * });
 * 
 * 
 * 4. Chaining Methods:
 * 
 * sheet
 *   .setHeading('Loading...')
 *   .setProgress(0.5)
 *   .open();
 * 
 * setTimeout(() => {
 *   sheet.setProgress(1).setHeading('Complete!');
 * }, 2000);
 * 
 * 
 * 5. Custom Icons with Slots:
 * 
 * <bottom-sheet heading="Menu">
 *   <span slot="icon-left" class="material-symbols-outlined">menu</span>
 *   <span slot="icon-right" class="material-symbols-outlined">close</span>
 *   <p>Content</p>
 * </bottom-sheet>
 * 
 * 
 * 6. Dynamic Content Update:
 * 
 * const content = document.createElement('div');
 * content.innerHTML = '<h3>New Content</h3><p>Updated!</p>';
 * sheet.updateContent(content);
 * 
 * 
 * 7. Progress Bar:
 * 
 * <bottom-sheet heading="Upload" progress-mode="int" open>
 *   <p>Uploading file...</p>
 * </bottom-sheet>
 * 
 * // In JavaScript
 * let progress = 0;
 * const interval = setInterval(() => {
 *   progress += 0.1;
 *   sheet.setProgress(progress);
 *   if (progress >= 1) clearInterval(interval);
 * }, 500);
 * 
 * 
 * 8. Indeterminate Progress:
 * 
 * <bottom-sheet heading="Loading" progress-mode="inf" open>
 *   <p>Please wait...</p>
 * </bottom-sheet>
 * 
 * 
 * 9. Full Size Sheet:
 * 
 * <bottom-sheet heading="Full Screen" size="full" open>
 *   <p>This takes up the full viewport</p>
 * </bottom-sheet>
 * 
 * 
 * 10. Custom Styling with CSS Parts:
 * 
 * <style>
 *   bottom-sheet::part(container) {
 *     background: linear-gradient(to bottom, #667eea 0%, #764ba2 100%);
 *   }
 *   
 *   bottom-sheet::part(title) {
 *     color: white;
 *   }
 *   
 *   bottom-sheet::part(content) {
 *     padding: 40px;
 *   }
 * </style>
 * 
 * 
 * 11. With Form:
 * 
 * <bottom-sheet heading="Login" block-bg>
 *   <form>
 *     <input type="email" placeholder="Email" />
 *     <input type="password" placeholder="Password" />
 *   </form>
 *   <button slot="cta-primary" type="submit">Login</button>
 *   <button slot="cta-secondary">Cancel</button>
 * </bottom-sheet>
 */
