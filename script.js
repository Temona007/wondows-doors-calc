// Demo Pricing Data
const pricingData = {
    windows: {
        'single-hung': { basePrice: 250, multiplier: 1.0 },
        'double-hung': { basePrice: 300, multiplier: 1.0 },
        'casement': { basePrice: 350, multiplier: 1.0 },
        'sliding': { basePrice: 400, multiplier: 1.0 },
        'awning': { basePrice: 320, multiplier: 1.0 },
        'picture': { basePrice: 280, multiplier: 1.0 }
    },
    doors: {
        'entry': { basePrice: 800, multiplier: 1.2 },
        'patio': { basePrice: 1200, multiplier: 1.3 },
        'french': { basePrice: 1500, multiplier: 1.4 },
        'sliding-door': { basePrice: 1000, multiplier: 1.2 }
    },
    materials: {
        'vinyl': { multiplier: 1.0 },
        'wood': { multiplier: 1.4 },
        'fiberglass': { multiplier: 1.3 },
        'aluminum': { multiplier: 1.1 }
    },
    glassTypes: {
        'single': { multiplier: 1.0 },
        'double': { multiplier: 1.2 },
        'triple': { multiplier: 1.5 },
        'low-e': { multiplier: 1.4 },
        'low-e-triple': { multiplier: 1.7 }
    },
    features: {
        'grids': 75,
        'hardware': 150,
        'tinting': 100,
        'installation': 300
    },
    // Price per square inch
    sizeMultiplier: {
        base: 0.5, // Base price per square inch
        minSize: 432, // 12x36 minimum
        maxSize: 14400 // 120x120 maximum
    }
};

// DOM Elements
const form = document.getElementById('pricingForm');
const productTypeInputs = document.querySelectorAll('input[name="productType"]');
const windowTypeSection = document.getElementById('windowTypeSection');
const doorTypeSection = document.getElementById('doorTypeSection');
const priceDisplay = document.getElementById('priceDisplay');
const breakdownList = document.getElementById('breakdownList');
const totalPriceElement = document.getElementById('totalPrice');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up product type toggle
    productTypeInputs.forEach(input => {
        input.addEventListener('change', handleProductTypeChange);
    });

    // Set initial state
    handleProductTypeChange();

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
});

// Handle product type change (Window/Door)
function handleProductTypeChange() {
    const selectedType = document.querySelector('input[name="productType"]:checked').value;
    
    if (selectedType === 'window') {
        windowTypeSection.classList.remove('hidden');
        doorTypeSection.classList.add('hidden');
        // Set default window dimensions
        document.getElementById('width').value = 36;
        document.getElementById('height').value = 60;
    } else {
        windowTypeSection.classList.add('hidden');
        doorTypeSection.classList.remove('hidden');
        // Set default door dimensions
        document.getElementById('width').value = 36;
        document.getElementById('height').value = 80;
    }
}

// Calculate price based on inputs
function calculatePrice(formData) {
    const productType = formData.get('productType');
    const type = productType === 'window' 
        ? formData.get('windowType') 
        : formData.get('doorType');
    const width = parseFloat(formData.get('width'));
    const height = parseFloat(formData.get('height'));
    const material = formData.get('material');
    const glassType = formData.get('glassType');
    const quantity = parseInt(formData.get('quantity'));
    const features = formData.getAll('features');

    // Get base price
    const productPricing = productType === 'window' 
        ? pricingData.windows[type] 
        : pricingData.doors[type];
    
    let basePrice = productPricing.basePrice;

    // Calculate size-based price
    const area = width * height;
    const sizePrice = area * pricingData.sizeMultiplier.base;
    
    // Apply product type multiplier
    basePrice = basePrice * productPricing.multiplier;

    // Apply material multiplier
    const materialMultiplier = pricingData.materials[material].multiplier;
    basePrice = basePrice * materialMultiplier;

    // Apply glass type multiplier
    const glassMultiplier = pricingData.glassTypes[glassType].multiplier;
    basePrice = basePrice * glassMultiplier;

    // Add size component
    let totalPrice = basePrice + sizePrice;

    // Add features
    const featurePrices = {};
    features.forEach(feature => {
        const featurePrice = pricingData.features[feature];
        featurePrices[feature] = featurePrice;
        totalPrice += featurePrice;
    });

    // Apply quantity
    const singleUnitPrice = totalPrice;
    totalPrice = totalPrice * quantity;

    return {
        productType,
        type,
        width,
        height,
        area,
        material,
        glassType,
        quantity,
        features,
        basePrice,
        sizePrice,
        materialMultiplier,
        glassMultiplier,
        featurePrices,
        singleUnitPrice,
        totalPrice
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format feature name
function formatFeatureName(feature) {
    const names = {
        'grids': 'Decorative Grids',
        'hardware': 'Premium Hardware',
        'tinting': 'UV Protection Tinting',
        'installation': 'Professional Installation'
    };
    return names[feature] || feature;
}

// Format product type name
function formatProductTypeName(type, productType) {
    if (productType === 'window') {
        const names = {
            'single-hung': 'Single Hung Window',
            'double-hung': 'Double Hung Window',
            'casement': 'Casement Window',
            'sliding': 'Sliding Window',
            'awning': 'Awning Window',
            'picture': 'Picture Window'
        };
        return names[type] || type;
    } else {
        const names = {
            'entry': 'Entry Door',
            'patio': 'Patio Door',
            'french': 'French Door',
            'sliding-door': 'Sliding Door'
        };
        return names[type] || type;
    }
}

// Display price breakdown
function displayPriceBreakdown(calculation) {
    breakdownList.innerHTML = '';
    
    // Product base
    const productName = formatProductTypeName(calculation.type, calculation.productType);
    addBreakdownItem(`${productName} (Base)`, formatCurrency(calculation.basePrice));
    
    // Size
    addBreakdownItem(`Size Component (${calculation.width}" × ${calculation.height}" = ${calculation.area.toFixed(0)} sq in)`, formatCurrency(calculation.sizePrice));
    
    // Material
    addBreakdownItem(`Material: ${calculation.material.charAt(0).toUpperCase() + calculation.material.slice(1)} (${(calculation.materialMultiplier * 100).toFixed(0)}%)`, formatCurrency(calculation.basePrice * (calculation.materialMultiplier - 1)));
    
    // Glass type
    const glassName = calculation.glassType.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    addBreakdownItem(`Glass: ${glassName} (${(calculation.glassMultiplier * 100).toFixed(0)}%)`, formatCurrency((calculation.basePrice + calculation.sizePrice) * (calculation.glassMultiplier - 1)));
    
    // Features
    Object.keys(calculation.featurePrices).forEach(feature => {
        addBreakdownItem(formatFeatureName(feature), formatCurrency(calculation.featurePrices[feature]));
    });
    
    // Quantity
    if (calculation.quantity > 1) {
        addBreakdownItem(`Unit Price (×${calculation.quantity})`, formatCurrency(calculation.singleUnitPrice));
    }
    
    // Total
    totalPriceElement.textContent = formatCurrency(calculation.totalPrice);
    
    // Show price display with animation
    priceDisplay.classList.remove('hidden');
}

// Add breakdown item
function addBreakdownItem(label, value) {
    const item = document.createElement('div');
    item.className = 'breakdown-item';
    item.innerHTML = `
        <span class="breakdown-item-label">${label}</span>
        <span class="breakdown-item-value">${value}</span>
    `;
    breakdownList.appendChild(item);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    // Validate inputs
    const width = parseFloat(formData.get('width'));
    const height = parseFloat(formData.get('height'));
    
    if (width < 12 || width > 120 || height < 12 || height > 120) {
        alert('Please enter dimensions between 12 and 120 inches.');
        return;
    }
    
    // Calculate price
    const calculation = calculatePrice(formData);
    
    // Display breakdown
    displayPriceBreakdown(calculation);
}

// Add real-time calculation on input change (optional enhancement)
const inputs = form.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('change', () => {
        if (form.checkValidity()) {
            const formData = new FormData(form);
            const width = parseFloat(formData.get('width'));
            const height = parseFloat(formData.get('height'));
            
            if (width >= 12 && width <= 120 && height >= 12 && height <= 120) {
                const calculation = calculatePrice(formData);
                displayPriceBreakdown(calculation);
            }
        }
    });
});

