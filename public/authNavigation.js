document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; // Use sessionStorage
    const username = sessionStorage.getItem('username'); // Get the logged-in username
    const authButtons = document.querySelector('.auth-buttons');
    const profileBtn = document.getElementById('profile-btn');
    
    if (isLoggedIn && username) {
        authButtons.style.display = 'none'; // Hide Login and Register buttons
        profileBtn.style.display = 'inline'; // Show Profile button
        profileBtn.textContent = `Profile (${username})`; // Optional: Display username on the button
    } else {
        authButtons.style.display = 'inline'; // Show Login and Register buttons
        profileBtn.style.display = 'none'; // Hide Profile button
    }
});

