//Handle Login
document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js loaded");
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try{
            const response = await fetch('https://tcgpocketmarket.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({ username, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                console.log('Response data:', data);
                localStorage.setItem('isLoggedIn', 'true');
                console.log('Username from server:', data.username);
                localStorage.setItem('username', data.username);
                console.log('Saved username:', localStorage.getItem('username')); 
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 500);
            } else{
                alert(data.message);
            }
        }catch (error){
            alert('Error logging in');
        }
    };
});