//Handle Login
console.log("script.js loaded");
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);

    if (data.redirect) {
        window.location.href = data.redirect;
    }
};