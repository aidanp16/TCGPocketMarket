document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');

    logoutButton.addEventListener('click', () => {
        // Remove login status from localStorage
        localStorage.removeItem('username')
        localStorage.removeItem('isLoggedIn');

        // Redirect to the home page
        window.location.href = 'index.html';
    });
});