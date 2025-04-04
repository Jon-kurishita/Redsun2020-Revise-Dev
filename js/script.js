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

    // --- Submenu Click Handling ---
    // Select ALL LIs that have submenus, regardless of level
    const submenuItems = document.querySelectorAll('nav li.has-submenu'); 

    submenuItems.forEach(item => {
        // Get the main link DIRECTLY inside this list item
        const mainLink = item.querySelector(':scope > a'); 

        if (mainLink) {
            mainLink.addEventListener('click', function(event) {
                // event.preventDefault(); // REMOVED THIS LINE to allow navigation
                
                const currentHref = mainLink.getAttribute('href');
                // Toggle the 'open' class on the parent LI and check its new state
                // We toggle AFTER potential navigation happens
                const wasOpen = item.classList.contains('open');
                
                // Use setTimeout to allow navigation before toggling/saving state visually
                // This might feel slightly less immediate but ensures navigation happens
                setTimeout(() => {
                    const currentState = getOpenMenusState();
                    // Re-check the class in case navigation was very fast and DOM reset
                    // Or simply toggle based on the intended action
                    
                    if (!wasOpen) { // If it was closed, we are opening it
                        item.classList.add('open');
                        currentState[currentHref] = true;
                        // Optional: Close others
                        /*
                        submenuItems.forEach(otherItem => {
                           if (otherItem !== item && otherItem.classList.contains('open')) {
                               otherItem.classList.remove('open');
                               const otherHref = otherItem.querySelector(':scope > a').getAttribute('href');
                               delete currentState[otherHref]; 
                           }
                        });
                        */
                    } else { // If it was open, we are closing it
                        item.classList.remove('open');
                        delete currentState[currentHref];
                        // Also remove 'open' from any nested submenus within this one
                        const nestedOpens = item.querySelectorAll('.has-submenu.open');
                        nestedOpens.forEach(nested => {
                            nested.classList.remove('open');
                            const nestedHref = nested.querySelector(':scope > a').getAttribute('href');
                            delete currentState[nestedHref]; 
                        });
                    }
                    // Save the updated state back to localStorage
                    saveOpenMenusState(currentState);
                }, 0); // Timeout 0 allows browser default action (navigation) to proceed

            });
        }

        // Ensure sub-menu links (those inside a .submenu ul that DON'T have their own submenu) 
        // navigate correctly and don't re-trigger the toggle
        const subLinks = item.querySelectorAll('.submenu a');
        subLinks.forEach(subLink => {
             // Check if this sublink is NOT also a parent toggle link
             if (!subLink.closest('li.has-submenu').isSameNode(subLink.closest('ul.submenu').closest('li.has-submenu'))) {
                 subLink.addEventListener('click', function(event) {
                    // Stop the click from bubbling up 
                    event.stopPropagation(); 
                    // Allow default link behavior (navigation)
                 });
             }
        });
    });

}); // --- End of DOMContentLoaded listener ---
```
*(Self-correction note: Removed `preventDefault` and added a `setTimeout` wrapper around the class toggling and localStorage logic in the main link's click handler. This standard pattern allows the default navigation action to proceed immediately while still performing the toggle/state update just after.)*
*(Further self-correction: Refined the sublink event listener logic slightly to be more robust in identifying true sublinks vs nested parent links