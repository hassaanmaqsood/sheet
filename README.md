# Bottom Sheet Web Component

A modern, declarative, framework-agnostic bottom sheet component built with Web Components.

## 🚀 Quick Start

### 1. Include the component
```html
<script src="bottom-sheet.js"></script>
```

### 2. Use it declaratively
```html
<bottom-sheet heading="Welcome" description="Get started" open block-bg>
  <p>Your content here</p>
  <button slot="cta-primary">Continue</button>
  <button slot="cta-secondary">Cancel</button>
</bottom-sheet>
```

### 3. Or create programmatically
```javascript
const sheet = document.createElement('bottom-sheet');
sheet.heading = 'Settings';
sheet.blockBg = true;
sheet.innerHTML = '<p>Settings content</p>';
document.body.appendChild(sheet);
sheet.open();
```

## 📋 Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | string | '' | Sheet title |
| `description` | string | '' | Sheet description |
| `size` | 'content' \| 'full' | 'content' | Sheet size |
| `open` | boolean | false | Whether sheet is open |
| `block-bg` | boolean | false | Show backdrop overlay |
| `drag-close` | boolean | true | Enable drag-to-close |
| `icon-left` | string | 'arrow_back' | Left icon (Material Symbol) |
| `icon-right` | string | 'close' | Right icon (Material Symbol) |
| `progress-mode` | 'int' \| 'inf' | - | Progress bar mode |

## 🎯 Methods

```javascript
const sheet = document.querySelector('bottom-sheet');

// Open/Close/Toggle
sheet.open();
sheet.close();
sheet.toggle();

// Update content
sheet.updateContent('<p>New content</p>');

// Set properties
sheet.setHeading('New Title');
sheet.setDescription('New description');
sheet.setProgress(0.5); // 0 to 1

// Method chaining
sheet
  .setHeading('Loading...')
  .setProgress(0.3)
  .open();
```

## 📡 Events

```javascript
sheet.addEventListener('sheet-open', (e) => {
  console.log('Opened!', e.detail.sheet);
});

sheet.addEventListener('sheet-close', (e) => {
  console.log('Closed!', e.detail.sheet);
});

sheet.addEventListener('icon-left-click', (e) => {
  console.log('Left icon clicked!');
});
```

## 🎨 Custom Styling with CSS Parts

```css
/* Style the container */
bottom-sheet::part(container) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Style the title */
bottom-sheet::part(title) {
  color: white;
  font-size: 24px;
}

/* Style the content area */
bottom-sheet::part(content) {
  padding: 40px;
}

/* Other available parts */
bottom-sheet::part(backdrop) { }
bottom-sheet::part(header) { }
bottom-sheet::part(description) { }
bottom-sheet::part(icon-left) { }
bottom-sheet::part(icon-right) { }
bottom-sheet::part(progress) { }
bottom-sheet::part(footer) { }
```

## 🎭 Slots

```html
<bottom-sheet heading="Custom">
  <!-- Default slot for main content -->
  <div>Main content here</div>
  
  <!-- Named slots -->
  <span slot="icon-left" class="material-symbols-outlined">menu</span>
  <span slot="icon-right" class="material-symbols-outlined">close</span>
  <button slot="cta-primary">Save</button>
  <button slot="cta-secondary">Cancel</button>
</bottom-sheet>
```

## 🌟 Usage Examples

### Basic Sheet
```html
<bottom-sheet heading="Welcome" open>
  <p>Content here</p>
</bottom-sheet>
```

### Modal Sheet with Backdrop
```html
<bottom-sheet heading="Settings" block-bg open>
  <p>Modal behavior</p>
</bottom-sheet>
```

### Full Size Sheet
```html
<bottom-sheet heading="Full Screen" size="full" open>
  <p>Takes full viewport</p>
</bottom-sheet>
```

### With Progress Bar
```html
<bottom-sheet heading="Loading" progress-mode="int" open>
  <p>Please wait...</p>
</bottom-sheet>

<script>
let progress = 0;
setInterval(() => {
  progress += 0.1;
  sheet.setProgress(progress);
}, 500);
</script>
```

### Indeterminate Progress
```html
<bottom-sheet heading="Processing" progress-mode="inf" open>
  <p>Working on it...</p>
</bottom-sheet>
```

### With Form
```html
<bottom-sheet heading="Contact" block-bg>
  <form>
    <input type="email" placeholder="Email" />
    <textarea placeholder="Message"></textarea>
  </form>
  <button slot="cta-primary">Submit</button>
  <button slot="cta-secondary">Cancel</button>
</bottom-sheet>
```

### Programmatic Creation
```javascript
function showNotification(message) {
  const sheet = document.createElement('bottom-sheet');
  sheet.heading = 'Notification';
  sheet.blockBg = true;
  sheet.innerHTML = `<p>${message}</p>`;
  
  const btn = document.createElement('button');
  btn.slot = 'cta-primary';
  btn.textContent = 'OK';
  btn.onclick = () => {
    sheet.close();
    setTimeout(() => sheet.remove(), 300);
  };
  sheet.appendChild(btn);
  
  document.body.appendChild(sheet);
  sheet.open();
}
```

## 🔧 Framework Integration

### React
```jsx
function App() {
  const sheetRef = useRef(null);
  
  return (
    <>
      <button onClick={() => sheetRef.current.open()}>
        Open Sheet
      </button>
      
      <bottom-sheet 
        ref={sheetRef}
        heading="React Sheet"
        block-bg="true"
      >
        <p>React content</p>
      </bottom-sheet>
    </>
  );
}
```

### Vue
```vue
<template>
  <button @click="$refs.sheet.open()">Open Sheet</button>
  
  <bottom-sheet 
    ref="sheet"
    heading="Vue Sheet"
    block-bg
    @sheet-close="handleClose"
  >
    <p>Vue content</p>
  </bottom-sheet>
</template>
```

### Angular
```typescript
@Component({
  template: `
    <button (click)="openSheet()">Open Sheet</button>
    
    <bottom-sheet 
      #sheet
      heading="Angular Sheet"
      block-bg
      (sheet-close)="handleClose()"
    >
      <p>Angular content</p>
    </bottom-sheet>
  `
})
export class MyComponent {
  @ViewChild('sheet') sheet!: ElementRef;
  
  openSheet() {
    this.sheet.nativeElement.open();
  }
}
```

## ✨ Features

- ✅ Declarative HTML API
- ✅ Framework agnostic (works with React, Vue, Angular, etc.)
- ✅ Touch & drag gestures
- ✅ Keyboard navigation (ESC to close)
- ✅ Progress indicators
- ✅ Custom styling with CSS Parts
- ✅ Event-driven architecture
- ✅ Method chaining
- ✅ Shadow DOM encapsulation
- ✅ No dependencies
- ✅ Lightweight
- ✅ Accessible (ARIA labels)

## 🌐 Browser Support

Works in all modern browsers that support Web Components:
- Chrome/Edge 67+
- Firefox 63+
- Safari 13.1+
- Opera 54+

## 📝 TypeScript Support

```typescript
declare global {
  interface HTMLElementTagNameMap {
    'bottom-sheet': BottomSheet;
  }
}

interface BottomSheet extends HTMLElement {
  // Properties
  heading: string;
  description: string;
  open: boolean;
  size: 'content' | 'full';
  blockBg: boolean;
  dragClose: boolean;
  progress: number;
  
  // Methods
  open(): BottomSheet;
  close(): BottomSheet;
  toggle(): BottomSheet;
  updateContent(content: HTMLElement | string): BottomSheet;
  setProgress(value: number): BottomSheet;
  setHeading(text: string): BottomSheet;
  setDescription(text: string): BottomSheet;
}
```

## 🤝 Contributing

Improvements welcome! This component provides a solid foundation and can be extended with:
- Animation customization
- More size options
- Swipe gestures in multiple directions
- Nested sheets
- Persistent storage integration
- And more!

## 📄 License

MIT - Feel free to use in your projects!

---

**Made with ❤️ using Web Components**
