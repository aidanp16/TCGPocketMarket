//Handle registration
document.addEventListener('DOMContentLoaded', () => {
    console.log("Form submitted");
    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try{
            const response = await fetch('https://tcgpocketmarket.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);

                // Redirect to home page after successful registration
                window.location.href = 'login.html';
            } else {
                alert(data.message); // Show an error message if registration failed
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error registering user');
        }
    };
});