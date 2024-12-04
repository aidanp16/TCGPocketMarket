document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');

    logoutButton.addEventListener('click', () => {
        // Clear all session storage items
        sessionStorage.clear(); 

        // Redirect to the home page
        window.location.href = 'index.html';
    });
});