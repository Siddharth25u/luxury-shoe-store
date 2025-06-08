document.addEventListener('DOMContentLoaded', function() {
    // Debugging: Check if filters container exists
    const filterContainer = document.getElementById('filters');
    if (!filterContainer) {
        console.error('Filters container not found! Check your HTML structure.');
        return;
    }

    // Get all sort options (divs after the SORT heading)
    const sortOptions = Array.from(filterContainer.querySelectorAll('div')).filter(div => {
        return div.textContent.trim() !== '8 Products'; // Exclude the product count
    });

    // Debugging: Log found options
    console.log('Found sort options:', sortOptions);

    // Initialize selected option
    let selectedOption = sortOptions[0];
    selectedOption.style.fontWeight = 'bold';
    selectedOption.style.cursor = 'pointer';

    // Add click events to each sort option
    sortOptions.forEach(option => {
        option.style.cursor = 'pointer'; // Make it look clickable
        
        option.addEventListener('click', function() {
            // Remove bold from previous selection
            selectedOption.style.fontWeight = 'normal';
            
            // Set new selection
            selectedOption = this;
            this.style.fontWeight = 'bold';
            
            // Get sort type
            const sortType = this.textContent.trim().toLowerCase().replace(/\s+/g, '_');
            console.log('Selected sort:', sortType);
            
            // Sort products
            sortProducts(sortType);
        });
    });

    // Improved sort function with error handling
    function sortProducts(sortType) {
        try {
            const productsContainer = document.querySelector('.products-container, .product-grid, #products');
            if (!productsContainer) {
                console.error('Products container not found!');
                return;
            }

            const products = Array.from(productsContainer.children);
            if (products.length === 0) {
                console.warn('No products found to sort');
                return;
            }

            products.sort((a, b) => {
                switch(sortType) {
                    case 'new_arrival':
                        // Example: Sort by data-date attribute
                        const dateA = a.getAttribute('data-date') || '0';
                        const dateB = b.getAttribute('data-date') || '0';
                        return new Date(dateB) - new Date(dateA);
                        
                    case 'available_in_wide':
                        // Example: Sort by availability (true comes first)
                        const availableA = a.getAttribute('data-in-stock') === 'true';
                        const availableB = b.getAttribute('data-in-stock') === 'true';
                        return availableB - availableA;
                        
                    default:
                        return 0;
                }
            });

            // Re-append sorted products
            products.forEach(product => productsContainer.appendChild(product));
            
        } catch (error) {
            console.error('Sorting failed:', error);
        }
    }
});