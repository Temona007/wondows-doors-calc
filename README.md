# Windows & Doors Pricing Calculator

A professional, user-friendly pricing calculator for residential windows and doors. Built as an MVP with HTML, CSS, and JavaScript.

## Features

- **Product Selection**: Choose between Windows and Doors
- **Multiple Product Types**: Various window and door styles
- **Customization Options**:
  - Dimensions (width × height)
  - Material selection (Vinyl, Wood, Fiberglass, Aluminum)
  - Glass type options (Single, Double, Triple, Low-E variants)
  - Additional features (Grids, Premium Hardware, UV Tinting, Installation)
  - Quantity selection
- **Real-time Price Calculation**: Updates as you change options
- **Detailed Price Breakdown**: See exactly what you're paying for
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Professional transitions and visual feedback

## Getting Started

1. Open `index.html` in your web browser
2. Select your product type (Window or Door)
3. Choose your customization options
4. Click "Calculate Price" to see the detailed breakdown

## File Structure

```
wondows-doors-calc/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # Calculator logic and pricing data
└── README.md       # This file
```

## Pricing Logic

The calculator uses demo pricing data with the following structure:

- **Base Prices**: Different for each window/door type
- **Size Component**: Price per square inch
- **Material Multipliers**: Applied to base price
- **Glass Type Multipliers**: Applied to total
- **Feature Add-ons**: Fixed prices for additional features
- **Quantity**: Multiplies the total unit price

## Customization

To modify pricing, edit the `pricingData` object in `script.js`:

```javascript
const pricingData = {
    windows: { ... },
    doors: { ... },
    materials: { ... },
    glassTypes: { ... },
    features: { ... }
};
```

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

Potential features for future versions:
- Save quotes functionality
- Email quote feature
- Multiple product comparison
- 3D visualization
- Integration with backend API
- User accounts and quote history

