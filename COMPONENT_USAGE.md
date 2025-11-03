# Using ThreeCardImageFader as a Reusable Component

The `ThreeCardImageFader` component is a fully documented, self-contained React component that displays three side-by-side image cards with continuous random crossfade transitions.

## Author
Simon Rundell (simon@codemonkey.design)
This documentation automated by Github Copilot and then tinkered with by SPR

## Features

- ✅ **Configurable**: All timing and images controlled via JSON
- ✅ **Reusable**: Drop into any React project with minimal setup
- ✅ **Responsive**: Maintains three columns across all screen sizes
- ✅ **Smart Selection**: Avoids showing duplicate images across cards
- ✅ **Fully Documented**: Comprehensive JSDoc comments throughout
- ✅ **Type-Safe Ready**: JSDoc annotations provide IntelliSense in editors
- ✅ **Performance Optimized**: Uses React.memo and proper cleanup

## Architecture Overview

### Component Structure

```
ThreeCardImageFader (main component)
├── State Management
│   ├── images: Array<string>        // URLs from config
│   ├── intervalMs: number           // Time between transitions
│   ├── fadeMs: number               // Crossfade duration
│   └── cards: Array<CardState>      // Three card objects
│
├── Effects
│   ├── Config loader                // Fetches and parses JSON
│   ├── Card initializer             // Sets initial random images
│   └── Transition loop              // Continuous crossfade timer
│
└── Helper Functions
    ├── pickRandomExcluding()        // Avoid one specific value
    ├── pickRandomNotIn()            // Avoid set of values
    └── Card()                       // Individual card renderer
```

### Card State Object

Each card maintains two image layers for smooth crossfading:

```javascript
{
  a: "/path/to/image1.png",    // First image layer
  b: "/path/to/image2.png",    // Second image layer
  showA: true                   // Which layer is visible
}
```

### Selection Algorithm

1. Build a `Set` of currently visible images across all three cards
2. Filter available images to exclude everything in that set
3. Randomly select from remaining candidates
4. Fallback strategies if no unique images available

## Installation in another project

### Option 1: Copy the component files directly

1. Copy these files into your project:
   ```
   src/components/ThreeCardImageFader.jsx
   src/components/threeCardImageFader.css
   ```

2. Import and use:
   ```jsx
   import ThreeCardImageFader from './components/ThreeCardImageFader';

   function App() {
     return <ThreeCardImageFader />;
   }
   ```

### Option 2: Publish as npm package (advanced)

1. Add an `index.js` that exports the component:
   ```javascript
   export { default as ThreeCardImageFader } from './src/components/ThreeCardImageFader';
   ```

2. Update `package.json` to include:
   ```json
   {
     "name": "@yourscope/three-card-image-fader",
     "version": "1.0.0",
     "main": "index.js",
     "peerDependencies": {
       "react": "^18.0.0 || ^19.0.0",
       "react-dom": "^18.0.0 || ^19.0.0"
     }
   }
   ```

3. Publish to npm or use locally via `npm link`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `configSource` | string | `"/images.json"` | Path or URL to JSON config file |
| `defaultIntervalMs` | number | `5000` | Default time between transitions (ms) |
| `defaultFadeMs` | number | `3000` | Default fade duration (ms) |
| `className` | string | `""` | Additional CSS class for container |
| `style` | object | `{}` | Inline styles for container |

## Usage Examples

### Basic usage (default config)
```jsx
<ThreeCardImageFader />
```

### Custom config path
```jsx
<ThreeCardImageFader configSource="/assets/slideshow-config.json" />
```

### Custom defaults (fallback if JSON doesn't specify)
```jsx
<ThreeCardImageFader 
  defaultIntervalMs={10000} 
  defaultFadeMs={5000} 
/>
```

### Custom styling
```jsx
<ThreeCardImageFader 
  className="my-custom-class"
  style={{ height: '80vh', border: '2px solid red' }}
/>
```

### External API source
```jsx
<ThreeCardImageFader 
  configSource="https://api.example.com/slideshow-config.json"
/>
```

## JSON Config Format

### Full format (recommended)
```json
{
  "images": [
    "/path/to/image1.png",
    "/path/to/image2.jpg",
    "/path/to/image3.webp"
  ],
  "INTERVAL_MS": 5000,
  "FADE_MS": 3000
}
```

### Legacy array format (still supported)
```json
[
  "/path/to/image1.png",
  "/path/to/image2.jpg"
]
```

## Styling

The component uses these CSS classes which you can override:
- `.tcf-container` - Main flex container (3 columns)
- `.tcf-card` - Individual card wrapper
- `.tcf-layer` - Image layer (for crossfade effect)
- `.tcf-layer.visible` - Visible state (opacity: 1)

To customize, either:
1. Modify `threeCardImageFader.css` directly, or
2. Add overrides in your own CSS:
   ```css
   .tcf-container {
     height: 100vh; /* full height */
   }
   
   .tcf-card {
     border-radius: 10px;
     overflow: hidden;
   }
   ```

## Requirements

- React 18+ or 19+
- CSS support in your build system (Vite, webpack, etc.)

## Browser Compatibility

- Modern browsers with CSS Grid/Flexbox support
- Fetch API (or polyfill for older browsers)

---

## Implementation Details

### How Crossfading Works

The component uses a **dual-layer technique** for smooth transitions:

1. Each card has two `<img>` elements (layer A and layer B)
2. Only one layer is visible at a time (controlled by `showA` boolean)
3. To transition:
   - Load the new image into the **hidden** layer
   - Toggle `showA` to fade between layers
   - CSS `opacity` transition creates the crossfade effect

This prevents flashing or loading delays during transitions.

### State Management Flow

```
Mount
  ↓
Fetch config (useEffect #1)
  ↓
Parse JSON → setImages(), setIntervalMs(), setFadeMs()
  ↓
Initialize cards (useEffect #2)
  ↓
Start interval timer (useEffect #3)
  ↓
Every intervalMs:
  ├── Pick random card (0, 1, or 2)
  ├── Build visible image set
  ├── Select new image (not in set)
  ├── Update card state (load to hidden layer)
  └── Toggle visibility (triggers CSS fade)
```

### Performance Considerations

- **useMemo**: Prevents unnecessary re-renders of card array
- **Cleanup**: Interval cleared on unmount and config changes
- **Conditional Rendering**: Images only render when src is truthy (avoids empty string warnings)
- **Immutable Updates**: Card state updated without mutation
- **isMounted Guard**: Prevents state updates on unmounted component

### CSS Classes Reference

| Class | Purpose | Default Styles |
|-------|---------|----------------|
| `.tcf-container` | Main flex container | `display: flex; width: 100vw; height: 60vh` |
| `.tcf-card` | Individual card wrapper | `position: relative; flex: 1 1 33.333%` |
| `.tcf-layer` | Image layer | `position: absolute; inset: 0; object-fit: cover; opacity: 0` |
| `.tcf-layer.visible` | Visible state | `opacity: 1; transition: opacity 2s ease` |

### Props Deep Dive

#### `configSource`
- **Type**: `string`
- **Default**: `"/images.json"`
- **Purpose**: Path or URL to JSON config
- **Examples**:
  - Relative: `"/data/gallery.json"`
  - Absolute: `"https://cdn.example.com/config.json"`
  - Dynamic: `` `/api/gallery/${galleryId}.json` ``

#### `defaultIntervalMs` & `defaultFadeMs`
- **Type**: `number`
- **Purpose**: Fallback values when JSON doesn't specify timing
- **Usage**: The component prefers JSON values but uses these as defaults
- **Why needed**: Allows component to work even if JSON has legacy array format

#### `className` & `style`
- **Purpose**: Override or extend default container styles
- **Use cases**:
  - Adjust height: `style={{ height: '100vh' }}`
  - Add borders: `className="bordered-slideshow"`
  - Responsive overrides: `className="desktop-only"`

---

## Troubleshooting

### Images not loading
1. Check browser console for 404 errors
2. Verify JSON file path is correct and accessible
3. Ensure image paths in JSON are correct (relative to public folder)
4. Check CORS policy if loading from external domain

### Transitions not working
1. Verify `INTERVAL_MS` and `FADE_MS` are positive numbers in JSON
2. Check that CSS file is imported
3. Ensure at least 2+ images in the config

### Duplicate images showing
- This is prevented by design, but can occur if:
  - Less than 3 unique images in config (unavoidable)
  - JSON contains duplicate entries (clean up JSON)

### Console warnings about empty src
- Fixed in latest version (images conditionally rendered)
- Update to latest component code if you see this

---

## Advanced Usage

### Loading Indicator

```jsx
function GalleryWithLoader() {
  const [configReady, setConfigReady] = useState(false);

  useEffect(() => {
    fetch('/images.json')
      .then(() => setConfigReady(true))
      .catch(() => setConfigReady(false));
  }, []);

  return configReady ? (
    <ThreeCardImageFader />
  ) : (
    <div>Loading gallery...</div>
  );
}
```

### Dynamic Config Source

```jsx
function DynamicGallery({ galleryId }) {
  const configUrl = `/api/galleries/${galleryId}.json`;
  
  return <ThreeCardImageFader configSource={configUrl} />;
}
```

### Multiple Instances

```jsx
function MultiGallery() {
  return (
    <>
      <section className="hero">
        <ThreeCardImageFader configSource="/hero-images.json" />
      </section>
      
      <section className="portfolio">
        <ThreeCardImageFader 
          configSource="/portfolio-images.json"
          defaultIntervalMs={8000}
        />
      </section>
    </>
  );
}
```

### Controlled Height/Styling

```jsx
<ThreeCardImageFader 
  style={{
    height: '90vh',
    maxHeight: '1200px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}
/>
```

---

## JSDoc Documentation

The component includes comprehensive JSDoc annotations for:
- Component props and return types
- Helper function parameters and behavior
- Constants and their purposes
- State management and effects
- Algorithm explanations

**Benefits**:
- IntelliSense/autocomplete in VS Code, WebStorm, etc.
- Type checking (when using TypeScript or `@ts-check`)
- Inline documentation while coding
- Automatic documentation generation tools

**To view in your editor**:
- Hover over `ThreeCardImageFader` to see full documentation
- Hover over props to see individual descriptions
- Use "Go to Definition" to read implementation details

---

## Contributing

If you extend this component, please maintain the JSDoc style:

```javascript
/**
 * Brief description of function/component
 * 
 * @param {Type} paramName - Description
 * @returns {Type} Description
 * 
 * @example
 * exampleUsage()
 */
```
