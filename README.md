# Three-Card Image Fader (Vite + React)

A React component that displays three side-by-side image cards (each ~33% of the viewport width) with continuous random crossfade transitions. One random card fades to a new, randomly selected image at regular intervals, creating an engaging slideshow effect.

## Author

Simon Rundell (simon@codemonkey.design)

## ✨ Features

- 🎨 **Three-column responsive layout** - Cards adapt to viewport width
- 🔄 **Smooth crossfade transitions** - Dual-layer technique prevents flashing
- 🎲 **Smart random selection** - Avoids showing duplicate images across cards
- ⚙️ **JSON-configurable** - Images and timing controlled via config file
- 🧩 **Reusable component** - Drop into any React project
- 📖 **Fully documented** - Comprehensive JSDoc annotations
- 🎯 **Object-fit cropping** - Images contained and centered

## Quick Start

### 1. Setup

Place your images in the `public/slideshow/` folder:
```
public/
└── slideshow/
    ├── image_01.png
    ├── image_02.png
    ├── ...
    └── image_13.png
```

Configure `public/images.json`:
```json
{
  "images": [
    "/slideshow/image_01.png",
    "/slideshow/image_02.png"
  ],
  "INTERVAL_MS": 5000,
  "FADE_MS": 3000
}
```

### 2. Run

```powershell
npm run dev
```

Visit http://localhost:5173/

### 3. Build

```powershell
npm run build
npm run preview
```

## Configuration

### JSON Format

The component reads `public/images.json` with the following structure:

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

| Field         | Type       | Required | Description                                        |
|---------------|------------|----------|----------------------------------------------------|
| `images`      | `string[]` | Yes      | Array of image paths (relative to public folder)   |
| `INTERVAL_MS` | `number`   | No       | Time between transitions in milliseconds (default: 5000) |
| `FADE_MS`     | `number`   | No       | Crossfade duration in milliseconds (default: 3000) |

**Legacy format** (still supported):
```json
["/image1.png", "/image2.png"]
```

## Component API

### Props

```jsx
<ThreeCardImageFader
  configSource="/images.json"    // Path to config
  defaultIntervalMs={5000}        // Fallback interval
  defaultFadeMs={3000}            // Fallback fade duration
  className=""                    // Additional CSS classes
  style={{}}                      // Inline styles
/>
```

| Prop                | Type     | Default          | Description                        |
|---------------------|----------|------------------|------------------------------------|
| `configSource`      | `string` | `"/images.json"` | Path or URL to JSON config file    |
| `defaultIntervalMs` | `number` | `5000`           | Default interval between transitions (ms) |
| `defaultFadeMs`     | `number` | `3000`           | Default fade duration (ms)         |
| `className`         | `string` | `""`             | Additional CSS class for container |
| `style`             | `object` | `{}`             | Inline styles for container        |

### Examples

**Basic:**
```jsx
import ThreeCardImageFader from './components/ThreeCardImageFader';

function App() {
  return <ThreeCardImageFader />;
}
```

**Custom config:**
```jsx
<ThreeCardImageFader 
  configSource="/gallery/summer-2024.json"
  defaultIntervalMs={7000}
/>
```

**With styling:**
```jsx
<ThreeCardImageFader 
  className="hero-section"
  style={{ height: '80vh', borderRadius: '8px' }}
/>
```

## How It Works

### Dual-Layer Crossfade

Each card maintains two image layers (A and B):
1. Initial state: Layer A visible with image 1
2. Transition trigger: Load image 2 into layer B (hidden)
3. Toggle visibility: Fade A out, B in (CSS transition)
4. Next transition: Load image 3 into A (now hidden), repeat

This prevents flashing and loading delays.

### Smart Selection Algorithm

Every interval:
1. Pick a random card (1 of 3)
2. Build a set of **currently visible** images across all cards
3. Select a new image **not in that set** (avoids duplicates)
4. Crossfade the chosen card to the new image

**Fallback logic:**
- If no unique image available → pick different from current card only
- If only 1 image exists → keep current (no transition)

### State Flow

```
Mount → Fetch config → Parse JSON → Initialize cards → Start interval
                                          ↓
                                    Every N seconds:
                                    ├─ Pick random card
                                    ├─ Select unique image
                                    └─ Crossfade
```## Customization

### Adjusting Timing

Edit `public/images.json`:
```json
{
  "images": [...],
  "INTERVAL_MS": 10000,  // 10 seconds between transitions
  "FADE_MS": 5000        // 5-second fade
}
```

### Styling

Override CSS in your own stylesheet:
```css
.tcf-container {
  height: 100vh;        /* Full viewport height */
  max-width: 1920px;    /* Max width constraint */
  margin: 0 auto;       /* Center container */
}

.tcf-card {
  border-radius: 12px;  /* Rounded corners */
  overflow: hidden;
}
```

Available CSS classes:
- `.tcf-container` - Main flex container
- `.tcf-card` - Individual card wrapper
- `.tcf-layer` - Image layer (for crossfade)
- `.tcf-layer.visible` - Visible state

### Image Paths

Images can be:
- **Relative to public folder**: `"/slideshow/photo.jpg"`
- **Absolute URLs**: `"https://cdn.example.com/image.png"`
- **Different formats**: `.png`, `.jpg`, `.webp`, `.gif`, etc.

## Project Structure

```
ImageSlider/
├── public/
│   ├── images.json              # Configuration file
│   └── slideshow/               # Your images
│       ├── image_01.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── ThreeCardImageFader.jsx    # Main component
│   │   └── threeCardImageFader.css    # Component styles
│   ├── App.jsx                  # App entry
│   ├── App.css                  # App styles
│   ├── index.css                # Global styles
│   └── main.jsx                 # React mount
├── COMPONENT_USAGE.md           # Reusability guide
└── README.md                    # This file
```

## Using as a Component

This component is designed to be reusable in any React project. See **[COMPONENT_USAGE.md](./COMPONENT_USAGE.md)** for:
- Installation in other projects
- Complete props documentation
- Advanced usage examples
- JSDoc reference
- Troubleshooting guide

### Quick Integration

Copy these files to your project:
```
src/components/ThreeCardImageFader.jsx
src/components/threeCardImageFader.css
```

Then import and use:
```jsx
import ThreeCardImageFader from './components/ThreeCardImageFader';

<ThreeCardImageFader configSource="/your-config.json" />
```

## Documentation

All code is fully documented with JSDoc annotations:
- Hover over component/functions in your IDE for inline docs
- Complete API reference in [COMPONENT_USAGE.md](./COMPONENT_USAGE.md)
- Implementation details and algorithms explained

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 not supported (uses modern ES6+ features)

## Performance

- **Optimized rendering**: Uses `React.useMemo` to prevent unnecessary re-renders
- **Clean lifecycle**: Proper cleanup of intervals on unmount
- **Conditional rendering**: Images only rendered when valid src exists
- **CSS transitions**: Hardware-accelerated opacity transitions

## Troubleshooting

### Images not showing
1. Check browser DevTools Console for 404 errors
2. Verify paths in `images.json` are correct
3. Ensure images exist in `public/` folder
4. Check that paths start with `/` (e.g., `"/slideshow/image.png"`)

### Console warning: empty src
- Fixed in current version
- Images are conditionally rendered only when src is truthy

### Same image appears twice
- Only happens if you have fewer than 3 unique images
- Add more images to your config to avoid this

### Transitions feel choppy
- Increase `FADE_MS` for smoother transitions
- Check browser performance (CSS transitions are GPU-accelerated)
- Ensure images are optimized (use WebP, compress large files)

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **CSS3** - Styling & transitions
- **ESLint** - Code linting

## License

This project is open source and available for personal and commercial use.
It would be nice for you to recognise the author as Simon Rundell simon@codemonkey.design

## Credits

Built with ❤️ using React and Vite.
This documentation automated by Github Copilot and then tinkered with by SPR

---

**Need help?** See [COMPONENT_USAGE.md](./COMPONENT_USAGE.md) for detailed documentation and examples.

````
