//Handle Login
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
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', data.username);
                window.location.href = data.redirect;
            } else{
                alert(data.message);
            }
        }catch (error){
            alert('Error logging in');
        }
    };
});