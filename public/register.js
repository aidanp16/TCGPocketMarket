//Handle registration
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').onsubmit = async (e) => {
        console.log("Form submitted");
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try{
            const response  = await fetch('https://tcgpocketmarket.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            alert(data.message);
        } catch (error){
            alert('Error registering user');
        }
    };
});