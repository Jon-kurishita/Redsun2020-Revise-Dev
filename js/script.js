document.addEventListener('DOMContentLoaded', function() {
    
    // --- Submenu Logic ---
    // Find all main list items that have a submenu
    const submenuItems = document.querySelectorAll('nav ul > li.has-submenu');

    submenuItems.forEach(item => {
        // Get the main link within this list item
        // Query only the direct child anchor to avoid selecting submenu anchors
        const mainLink = item.querySelector(':scope > a'); 

        if (mainLink) {
            mainLink.addEventListener('click', function(event) {
                // Prevent the link from navigating to the page itself when clicked
                // This makes the click ONLY toggle the submenu.
                event.preventDefault(); 

                // Toggle the 'open' class on the parent LI
                item.classList.toggle('open');

                // Optional: Close other open submenus when one is opened
                // If you want only one submenu open at a time, uncomment the block below
                /*
                submenuItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('open')) {
                        otherItem.classList.remove('open');
                    }
                });
                */
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
