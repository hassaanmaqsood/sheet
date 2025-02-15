# Sheet Documentation

## Overview

The `buildSheet` function is used to create a customizable bottom sheet modal in a web application. It allows users to specify various configurations such as size, icons, buttons, progress indicators, and more. This function returns a `sheet` element that can be manipulated with methods like `open`, `close`, and `update`.

---

## Function Signature

```js
function buildSheet(contentElements, config = {})
```

### Parameters:
- `contentElements` (Array of DOM Elements): An array of HTML elements that will be placed inside the sheet's content container.
- `config` (Object, optional): An optional configuration object to customize the sheet's appearance and behavior.

---

## Configuration Options

### General Options:
| Option         | Type    | Default     | Description |
|--------------|--------|-------------|-------------|
| `size`       | String | `'content'` | Defines the size of the sheet (`'content'`, `'full'`). |
| `blockBg`    | Boolean | `false` | If `true`, the background is obscured with an overlay. |
| `heading`    | String  | `''` | The title text of the sheet. |
| `description` | String  | `''` | The subtitle or description text of the sheet. |
| `progress`   | Object  | `{ mode: '' }` | Defines the progress bar mode (`'int'` for definite progress, `'inf'` for indefinite progress). |
| `onClose`    | Function | `(sheet) => console.warn('sheet closed', sheet)` | Callback function executed when the sheet is closed. |
| 'dragCloseEnable' | Boolean | `true` | Toggles the draggable sheet close |

### Icon Options:
Each icon can be configured separately:
| Property       | Type      | Default   | Description |
|--------------|---------|-----------|-------------|
| `label`     | String  | `'back'` (left), `'close'` (right) | The icon label from [Google Fonts Icons](https://fonts.google.com/icons). |
| `onClick`   | Function | `() => {}` | Function executed on icon click. |
| `customClassList` | Array  | `[]` | List of custom CSS classes applied to the icon. |

### Button (CTA) Options:
| Property       | Type      | Default   | Description |
|--------------|---------|-----------|-------------|
| `label`     | String  | `''` | Text for the button. |
| `onClick`   | Function | `() => {}` | Function executed on button click. |
| `customClassList` | Array  | `[]` | List of custom CSS classes applied to the button. |

---

## Methods

### `open(selector = 'body')`
Appends the sheet to the specified DOM element (default is `<body>`) and plays the opening animation.

#### Example:
```js
const mySheet = buildSheet([document.createElement('p')], { heading: 'My Sheet' });
mySheet.open();
```

### `close()`
Triggers the closing animation and removes the sheet from the DOM.

#### Example:
```js
mySheet.close();
```

### `update(newElements)`
Replaces the current content inside the sheet with new elements.

#### Example:
```js
mySheet.update([document.createElement('div')]);
```

### `setProgress(progress)`
Updates the progress bar within the sheet.

#### Example:
```js
mySheet.setProgress(0.5); // Sets progress to 50%
mySheet.setProgress(1); // Hides the progress bar
```

---

## Example Usage

### Basic Sheet with Title and Close Button
```js
const sheet = buildSheet([
    Object.assign(document.createElement('p'), { textContent: 'Hello World!' })
], {
    heading: 'Sample Sheet',
    iconRight: {
        label: 'close',
        onClick: (sheet) => sheet.close()
    }
});

sheet.open();
```

### Full-Screen Sheet with CTA Buttons
```js
const sheet = buildSheet([
    Object.assign(document.createElement('p'), { textContent: 'This is a full-screen modal.' })
], {
    size: 'full',
    heading: 'Full Screen',
    ctaPrimary: {
        label: 'Confirm',
        onClick: (sheet) => {
            alert('Confirmed!');
            sheet.close();
        }
    },
    ctaSecondary: {
        label: 'Cancel',
        onClick: (sheet) => sheet.close()
    }
});

sheet.open();
```

---

## Conclusion
The `buildSheet` function provides a flexible and customizable way to create bottom sheets for web applications. By leveraging icons, buttons, progress indicators, and animations, developers can seamlessly integrate interactive modals into their UI.

