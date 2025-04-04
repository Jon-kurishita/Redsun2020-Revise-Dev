document.addEventListener('DOMContentLoaded', function() {
    
    const storageKey = 'openSubmenuHref'; // Key for localStorage

    // --- On Page Load: Check localStorage and Open Remembered Submenu ---
    const openMenuHref = localStorage.getItem(storageKey);
    if (openMenuHref) {
        // Find the LI whose direct child link matches the stored href
        const linkToOpen = document.querySelector(`nav ul > li.has-submenu > a[href="${openMenuHref}"]`);
        if (linkToOpen) {
            // Add 'open' class to the parent LI to expand the submenu
            linkToOpen.parentElement.classList.add('open'); 
        }
    }

    // --- Submenu Click Handling ---
    const submenuItems = document.querySelectorAll('nav ul > li.has-submenu');

    submenuItems.forEach(item => {
        // Get the main link within this list item
        const mainLink = item.querySelector(':scope > a'); 

        if (mainLink) {
            mainLink.addEventListener('click', function(event) {
                // Prevent the link from navigating to the page itself when clicked
                event.preventDefault(); 
                
                const currentHref = mainLink.getAttribute('href');
                // Toggle the 'open' class on the parent LI and check its new state
                const isOpen = item.classList.toggle('open'); 

                if (isOpen) {
                    // If the menu was just opened, store its href, overwriting any previous value
                    localStorage.setItem(storageKey, currentHref);
                    
                    // Optional: Close other open submenus if you only want one open ever
                    // If uncommented, also adjust localStorage logic if needed
                    /*
                    submenuItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('open')) {
                            otherItem.classList.remove('open');
                            // Potentially remove other item from localStorage if tracking multiple
                        }
                    });
                    */
                } else {
                    // If the menu was just closed, check if it was the one stored
                    // If so, remove it from storage so it doesn't reopen on next load
                    if (localStorage.getItem(storageKey) === currentHref) {
                        localStorage.removeItem(storageKey);
                    }
                }
            });
        }

        // Ensure sub-menu links navigate correctly and don't re-trigger the toggle
        const subLinks = item.querySelectorAll('.submenu a');
        subLinks.forEach(subLink => {
            subLink.addEventListener('click', function(event) {
                // Stop the click from bubbling up to the parent LI's click handler
                event.stopPropagation(); 
                // Allow the default link behavior (scrolling to #section)
            });
        });
    });

}); // --- End of DOMContentLoaded listener ---
