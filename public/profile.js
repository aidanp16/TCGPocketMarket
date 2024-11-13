document.addEventListener('DOMContentLoaded', async () => {
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const memberSinceField = document.getElementById('member-since');
    const lastLoginField = document.getElementById('last-login');
    const subscriptionTypeField = document.getElementById('subscription-type');

    try {
        // Fetch user profile data from the server
        const username = localStorage.getItem('username');
        const response = await fetch(`https://tcgpocketmarket.onrender.com/get-profile?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // Add authorization header if needed, like a token
            // headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const userData = await response.json();
            
            // Populate the fields with the user data
            usernameField.value = userData.username;
            emailField.value = userData.email;
            phoneField.value = userData.phone || ''; // optional field
            memberSinceField.textContent = userData.memberSince;
            lastLoginField.textContent = userData.lastLogin;
            subscriptionTypeField.textContent = userData.subscriptionType || 'Free'; // Default to 'Free' if not provided
        } else {
            alert('Error fetching profile data');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading profile information');
    }
});
