document.addEventListener('DOMContentLoaded', async () => {
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const memberSinceField = document.getElementById('member-since');
    const lastLoginField = document.getElementById('last-login');
    const subscriptionTypeField = document.getElementById('subscription-type');
    const profileForm = document.getElementById('profile-form');

    try {
        // Fetch user profile data from the server
        const currentUsername = localStorage.getItem('username');
        const response = await fetch(`https://tcgpocketmarket.onrender.com/get-profile?username=${currentUsername}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            
            // Populate the fields with the user data
            usernameField.value = userData.username;
            emailField.value = userData.email || ''; // optional field
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

    // Handle profile update form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentUsername = localStorage.getItem('username');
        const newUsername = usernameField.value;
        const email = emailField.value || null; // Set to null if empty
        const phone = phoneField.value || null; // Set to null if empty
        const password = document.getElementById('password').value; // Optional password field

        const updateData = { currentUsername, newUsername };

        // Only include email and phone if they are provided
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (password) updateData.password = password; // Include password if provided

        try {
            const response = await fetch(`https://tcgpocketmarket.onrender.com/update-profile?username=${currentUsername}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);

                // Update localStorage if the username was changed
                if (newUsername !== currentUsername) {
                    localStorage.setItem('username', newUsername);
                }
            } else {
                alert(data.message); // Show error message if username already exists or other issues
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating profile information');
        }
    });
});
