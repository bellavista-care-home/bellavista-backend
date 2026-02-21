# Responsive Design Implementation - Bellavista Care Homes

## Overview
This guide outlines the implementation of **Tailwind CSS + Bootstrap 5** responsive design for all Bellavista care home pages (Barry, Cardiff, Waverley, College Fields, Baltimore, and Meadow Vale).

## Key Objectives
✅ **Mobile-First Responsive Design** - Works on all device sizes (320px to 2560px+)
✅ **Hybrid Tailwind + Bootstrap** - Leverage both frameworks for maximum flexibility
✅ **Reusable Component Structure** - All 6 homes use the same component template
✅ **Accessibility** - WCAG 2.1 AA compliant
✅ **Performance** - Optimized images, lazy loading, and CSS purging

---

## Responsive Breakpoints

### Bootstrap Grid System (Used for Layout)
```
Extra small (xs): < 576px     (Mobile phones)
Small (sm):      ≥ 576px     (Landscape phones)
Medium (md):     ≥ 768px     (Tablets)
Large (lg):      ≥ 992px     (Desktops)
Extra large (xl): ≥ 1200px   (Large desktops)
XXL:             ≥ 1400px    (Extra large displays)
```

### Tailwind Utilities (Used for Fine-Tuning)
```
sm:  640px   |  md:  768px   |  lg:  1024px  |  xl:  1280px  |  2xl: 1536px
```

---

## Component Structure

### 1. Hero Section
**Classes Used:**
- `responsive-hero` - Gradient background with background image
- `min-vh-100` (Bootstrap) - Full viewport height
- `d-flex align-items-center` (Bootstrap) - Vertical centering
- `px-3 px-sm-4 px-md-5` (Bootstrap) - Responsive padding
- `display-3 display-md-4` (Bootstrap) - Responsive typography

**Responsive Behavior:**
- **Mobile (< 576px):** Single column, stacked buttons, smaller text
- **Tablet (576px-992px):** Hero text 50% width, larger padding
- **Desktop (> 992px):** Hero text 50% left, image 50% right (visual)

**Example:**
```jsx
<h1 className="display-3 display-md-4 fw-bold mb-3 mb-md-4">
  {homeData?.heroTitle}
</h1>

<div className="row g-2 g-sm-3 g-md-2">
  <div className="col-6 col-sm-5 col-md-6">
    <button className="btn btn-light btn-sm btn-md-lg w-100">
      <i className="fas fa-bed"></i>
      <span className="d-none d-sm-inline">39 Beds</span>
    </button>
  </div>
</div>
```

### 2. Content Sections
**Common Spacing Pattern:**
```jsx
<section className="section-spacing bg-light">
  <div className="container-fluid px-3 px-sm-4 px-md-5 px-lg-6">
    <div className="row">
      <div className="col-12 col-lg-8 offset-lg-2">
        {/* Centered content on desktop */}
      </div>
    </div>
  </div>
</section>
```

**Responsive Typography:**
```jsx
<h2 className="display-4 fw-bold text-center">Title</h2>
<p className="fs-5 fs-md-4 text-gray-700">Text</p>
```

### 3. Grid Layouts
**Two-Column (Image Left, Content Right):**
```jsx
<div className="row g-4 g-md-5">
  <div className="col-12 col-lg-6 order-lg-2">
    {/* Content */}
  </div>
  <div className="col-12 col-lg-6 order-lg-1">
    {/* Image/Slider */}
  </div>
</div>
```

**Three-Column Grid:**
```jsx
<div className="grid-responsive xl-three-col" 
  style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
  {items.map(...)}
</div>
```

### 4. Cards
**Responsive Card Template:**
```jsx
<div className="card card-responsive border-0 bg-light p-4 p-md-6 rounded-3 h-100">
  <h5 className="fw-bold mb-4 text-dark">Title</h5>
  <p className="text-gray-700 mb-0">Content</p>
</div>
```

**Features:**
- `p-4 p-md-6` - Responsive padding (16px on mobile, 24px+ on desktop)
- `h-100` - Full height for consistent cards
- `card-responsive` - Hover effects with transitions
- `rounded-3` - Consistent 16px border-radius

### 5. Button Groups
**Responsive Button Wrapper:**
```jsx
<div className="d-flex flex-column flex-sm-row gap-3 gap-md-4 justify-content-center">
  <Button>Primary</Button>
  <Button>Secondary</Button>
</div>
```

**Responsive Buttons:**
```jsx
<button className="btn btn-primary btn-lg fw-bold px-4 px-md-6 responsive-btn">
  <i className="fas fa-icon"></i>
  <span>Text</span>
</button>
```

---

## CSS Custom Classes

### Utility Classes
```css
.responsive-btn {
  transition: all 0.3s ease;
}
.responsive-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.section-spacing {
  padding-top: clamp(2rem, 5vw, 6rem);
  padding-bottom: clamp(2rem, 5vw, 6rem);
}

.card-responsive {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-responsive:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.mobile-stack {
  flex-direction: column;
}
@media (min-width: 768px) {
  .mobile-stack {
    flex-direction: row;
  }
}
```

---

## Typography Scales

### Headings
| Breakpoint | H1 | H2 | H3 | H4 | H5 |
|-----------|-----|-----|-----|-----|-----|
| Mobile (< 576px) | 2rem | 1.8rem | 1.5rem | 1.25rem | 1.1rem |
| Tablet (≥ 768px) | 2.5rem | 2.2rem | 1.8rem | 1.4rem | 1.2rem |
| Desktop (≥ 1024px) | 3.5rem | 3rem | 2.2rem | 1.8rem | 1.4rem |

**Implementation:**
```jsx
<h1 className="display-3 display-md-4 display-lg-5">Large Title</h1>
<h2 className="h2 h1-md">Medium Title</h2>
<p className="fs-5 fs-md-4">Body Text</p>
```

---

## Image Handling

### Responsive Images
```jsx
<img 
  src={imageSrc} 
  alt="Description" 
  className="w-100 h-100 object-fit-cover"
/>
```

### Aspect Ratio
```jsx
<div className="ratio ratio-4x3">
  <img src={image} alt="Alt" className="object-fit-cover"/>
</div>
```

### Picture Element (Advanced)
```jsx
<picture>
  <source media="(min-width: 1024px)" srcSet={desktopImage} />
  <source media="(min-width: 768px)" srcSet={tabletImage} />
  <img src={mobileImage} alt="Description" className="w-100"/>
</picture>
```

---

## Spacing System

### Margin/Padding Scale
```
xs: 0.5rem (8px)
sm: 1rem (16px)
1:  1rem (16px)
2:  0.5rem (8px)
3:  1rem (16px)
4:  1.5rem (24px)
5:  3rem (48px)
6:  3.5rem (56px)
```

**Usage:**
```jsx
<div className="mb-4 md:mb-6 lg:mb-8">          {/* Responsive margin-bottom */}
<div className="p-3 p-sm-4 p-md-5 p-lg-6">     {/* Responsive padding */}
<div className="gap-2 gap-md-3 gap-lg-4">      {/* Responsive gap */}
```

---

## Swiper Integration (Carousels)

### Default Swiper Settings
```jsx
const sliderSettings = {
  modules: [Navigation, Pagination, Autoplay],
  spaceBetween: 20,
  slidesPerView: 1,
  breakpoints: {
    480: { slidesPerView: 1.3, spaceBetween: 15 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 2.5, spaceBetween: 25 },
    1400: { slidesPerView: 3, spaceBetween: 30 }
  },
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { clickable: true },
  loop: true
};
```

---

## Implementation Steps for Each Home

### Step 1: Update Imports
```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
```

### Step 2: Apply Responsive Classes
Replace inline styles with Bootstrap/Tailwind classes:
```jsx
// Before
<div style={{padding: '20px', marginBottom: '30px'}}>

// After
<div className="p-3 p-md-5 mb-4 mb-md-6">
```

### Step 3: Update Color Classes
```jsx
// Bootstrap color classes
className="bg-light"
className="text-dark"
className="text-gray-700"
className="border-light"

// Custom color utilities
className="bg-opacity-10"
className="text-white-75"
```

### Step 4: Test Responsiveness
- Mobile (375px)
- Tablet Portrait (768px)
- Tablet Landscape (1024px)
- Desktop (1440px)
- Ultra-wide (2560px)

---

## Performance Optimizations

### 1. CSS Purging
Tailwind PureCSS removes unused styles:
```bash
npm run purge:css
```

### 2. Image Optimization
- WebP format for modern browsers
- Responsive images with `srcSet`
- Lazy loading with `loading="lazy"`

### 3. Bundle Size
- Bootstrap (minified): ~125KB
- Tailwind (with PurgeCSS): ~40KB
- Total addition: ~165KB

---

## Browser Support

| Browser | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Chrome  | ✅     | ✅     | ✅      |
| Safari  | ✅     | ✅     | ✅      |
| Firefox | ✅     | ✅     | ✅      |
| Edge    | ✅     | ✅     | ✅      |
| IE 11   | ⚠️     | ⚠️     | ⚠️      |

---

## Common Responsive Patterns

### Hide/Show Elements
```jsx
<span className="d-none d-sm-inline">Desktop Text</span>
<span className="d-sm-none">Mobile Text</span>
```

### Responsive Direction Changes
```jsx
<div className="d-flex flex-column flex-md-row gap-4">
  {/* Stacks on mobile, side-by-side on desktop */}
</div>
```

### Responsive Grid
```jsx
<div className="row g-3 g-md-4 g-lg-5">
  <div className="col-12 col-sm-6 col-lg-3">
    {/* Responsive columns */}
  </div>
</div>
```

---

## Testing Checklist

- [ ] Mobile (375px, 480px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1440px)
- [ ] Ultra-wide (2560px)
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Image loading/optimization
- [ ] Button/link touch targets (48px minimum)
- [ ] Text readability (18px minimum for body text)

---

## Future Improvements

1. **Dark Mode** - Add `prefers-color-scheme` media query
2. **Animation** - Entrance animations with Intersection Observer
3. **Forms** - Responsive form layouts
4. **Modals** - Mobile-friendly modal dialogs
5. **Print Styles** - Optimize for printing

---

## Resources

- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs/)
- [MDN Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)

---

## Contact & Support

For questions about the responsive design implementation, please refer to this documentation or contact the development team.

**Last Updated:** February 21, 2026
