document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.querySelector('.auth-buttons');
    const profileBtn = document.getElementById('profile-btn');
    
    if (isLoggedIn) {
        authButtons.style.display = 'none';
        profileBtn.style.display = 'inline';
    } else {
        authButtons.style.display = 'inline';
        profileBtn.style.display = 'none';
    }
});
