document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; // Use sessionStorage
    const username = sessionStorage.getItem('username'); // Get the logged-in username
    const authButtons = document.querySelector('.auth-buttons');
    const profileBtn = document.getElementById('profile-btn');
    const inboxBtn = document.getElementById('inbox-btn');
    
    if (isLoggedIn && username) {
        authButtons.style.display = 'none'; // Hide Login and Register buttons
        profileBtn.style.display = 'inline'; // Show Profile button
        inboxBtn.style.display = 'inline'; // Show Inbox button
        profileBtn.textContent = `Profile (${username})`; // Optional: Display username on the Profile button
    } else {
        authButtons.style.display = 'inline'; // Show Login and Register buttons
        profileBtn.style.display = 'none'; // Hide Profile button
        inboxBtn.style.display = 'none'; // Hide Inbox button
    }
});
