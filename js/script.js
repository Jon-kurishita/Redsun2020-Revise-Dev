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
        // Find the LINK itself first
        const linkToOpen = document.querySelector(`nav li.has-submenu > a[href="${openMenuHref}"]`);
        // Check if the link exists AND if its state should be open
        if (linkToOpen && openMenus[openMenuHref] === true) { 
            // Add 'open' class to the PARENT LI element
            linkToOpen.parentElement.classList.add('open'); 
        }
    });

    // --- Submenu Click Handling (Revised) ---
    // Select ALL LIs that have submenus, regardless of level
    const submenuItems = document.querySelectorAll('nav li.has-submenu'); 

    submenuItems.forEach(item => {
        // Get the main link DIRECTLY inside this list item
        const mainLink = item.querySelector(':scope > a'); 

        if (mainLink) {
            mainLink.addEventListener('click', function(event) {
                // Allow default navigation (no preventDefault)
                
                const currentHref = mainLink.getAttribute('href');
                const currentState = getOpenMenusState();
                // Check the VISUAL state right now to determine the INTENDED next state
                const isCurrentlyOpen = item.classList.contains('open'); 
                const willBeOpen = !isCurrentlyOpen; 

                if (willBeOpen) {
                    // Intending to open: Add/update its href in the state object
                    currentState[currentHref] = true;
                     // Optional: Close others if uncommented
                     /*
                     submenuItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('open')) {
                            // otherItem.classList.remove('open'); // Visual change skipped
                            const otherHref = otherItem.querySelector(':scope > a').getAttribute('href');
                            delete currentState[otherHref]; 
                        }
                     });
                     */
                } else { 
                    // Intending to close: Remove its href from the state object
                    delete currentState[currentHref];
                    // Also remove state for any nested submenus within this one
                    const nestedLinks = item.querySelectorAll('.submenu li.has-submenu > a');
                    nestedLinks.forEach(nestedLink => {
                        delete currentState[nestedLink.getAttribute('href')];
                    });
                }
                // Save the INTENDED state for the NEXT page load IMMEDIATELY
                saveOpenMenusState(currentState);
                
                // No visual toggle here - let navigation proceed and rely on page load logic
            });
        }

        // Ensure sub-menu links (those inside a .submenu ul that DON'T have their own submenu) 
        // navigate correctly and don't re-trigger the toggle
        const subLinks = item.querySelectorAll('.submenu a');
        subLinks.forEach(subLink => {
             // Check if this sublink is NOT also a parent toggle link by checking its parent LI
             if (!subLink.closest('li').classList.contains('has-submenu')) {
                 subLink.addEventListener('click', function(event) {
                    // Stop the click from bubbling up 
                    event.stopPropagation(); 
                    // Allow default link behavior (navigation)
                 });
             }
        });
    });

}); // --- End of DOMContentLoaded listener ---
