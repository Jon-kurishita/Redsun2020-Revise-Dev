document.addEventListener('DOMContentLoaded', function() {
    
    const storageKey = 'openSubmenus'; // Use a key that implies multiple items

    // Function to get the current state from localStorage
    function getOpenMenusState() {
        const storedState = localStorage.getItem(storageKey);
        try {
            // Try parsing JSON, return empty object if null or invalid
            return storedState ? JSON.parse(storedState) : {};
        } catch (e) {
            console.error("Error parsing localStorage state:", e);
            return {}; // Return empty object on error
        }
    }

    // Function to save the current state to localStorage
    function saveOpenMenusState(state) {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }

    // --- On Page Load: Check localStorage and Open Remembered Submenus ---
    const openMenus = getOpenMenusState();
    Object.keys(openMenus).forEach(openMenuHref => {
        // Find the LI whose direct child link matches the stored href
        // Using the selector from your provided code
        const linkToOpen = document.querySelector(`nav ul > li.has-submenu > a[href="${openMenuHref}"]`); 
        if (linkToOpen && openMenus[openMenuHref] === true) { // Check if value is true
            // Add 'open' class to the parent LI to expand the submenu
            linkToOpen.parentElement.classList.add('open'); 
        }
    });

    // --- Submenu Click Handling ---
    // Using the selector from your provided code
    const submenuItems = document.querySelectorAll('nav ul > li.has-submenu'); 

    submenuItems.forEach(item => {
        // Get the main link within this list item
        const mainLink = item.querySelector(':scope > a'); 

        if (mainLink) {
            mainLink.addEventListener('click', function(event) {
                // Prevent the link from navigating immediately
                event.preventDefault(); 
                
                const currentHref = mainLink.getAttribute('href');
                // Toggle the 'open' class on the parent LI and check its new state
                const isOpen = item.classList.toggle('open'); 
                
                // Get the current state *after* toggling visually
                const currentState = getOpenMenusState();

                if (isOpen) {
                    // If the menu was just opened, add its href to the state object
                    currentState[currentHref] = true;
                } else {
                    // If the menu was just closed, remove its href from the state object
                    delete currentState[currentHref];
                    // Also remove state for any nested submenus within this one when closing parent
                    const nestedLinks = item.querySelectorAll('.submenu li.has-submenu > a');
                    nestedLinks.forEach(nestedLink => {
                         // Check if the nested menu was actually open before deleting state
                         if(currentState[nestedLink.getAttribute('href')]) {
                            delete currentState[nestedLink.getAttribute('href')];
                         }
                         // Also ensure nested visual state matches
                         nestedLink.parentElement.classList.remove('open'); 
                    });
                }
                // Save the updated state back to localStorage
                saveOpenMenusState(currentState);

                // Note: The "close others" logic remains commented out as requested
                /*
                submenuItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('open')) {
                        otherItem.classList.remove('open');
                        // If closing others, update localStorage accordingly here too
                        const otherHref = otherItem.querySelector(':scope > a').getAttribute('href');
                        delete currentState[otherHref]; // Remove others from state
                    }
                });
                if (isOpen) { // Re-save state if others were closed
                    saveOpenMenusState(currentState);
                }
                */

                // *** ADDED LINE: Manually navigate AFTER toggle and save ***
                window.location.href = currentHref;

            });
        }

        // Ensure sub-menu links navigate correctly and don't re-trigger the toggle
        const subLinks = item.querySelectorAll('.submenu a');
        subLinks.forEach(subLink => {
            // Check if this sublink is NOT also a parent toggle link by checking its parent LI
            // (Adjusted check slightly for potentially different structures)
             if (!subLink.closest('li').classList.contains('has-submenu')) {
                 subLink.addEventListener('click', function(event) {
                    // Stop the click from bubbling up to the parent LI's click handler
                    event.stopPropagation(); 
                    // Allow the default link behavior (scrolling to #section or navigating)
                 });
             }
        });
    });

}); // --- End of DOMContentLoaded listener ---
