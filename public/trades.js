document.addEventListener('DOMContentLoaded', () => {
    const tradeListings = document.getElementById('trade-listings');
    const tradeModal = document.getElementById('trade-modal');
    const createTradeBtn = document.getElementById('create-trade-btn');
    const closeModal = document.getElementById('close-modal');
    const tradeForm = document.getElementById('trade-form');

    // Function to fetch all trades
    async function fetchAllTrades() {
        const response = await fetch('/all-trades');
        const trades = await response.json();
        displayTrades(trades);
    }

    // Function to fetch user-specific trades
    async function fetchUserTrades() {
        const username = prompt("Enter your username:");
        const response = await fetch(`/user-trades?username=${username}`);
        const trades = await response.json();
        displayTrades(trades);
    }

    // Function to display trades
    function displayTrades(trades) {
        tradeListings.innerHTML = "";
        trades.forEach(trade => {
            tradeListings.innerHTML += `
                <div class="trade-post">
                    <h3>${trade.cardName}</h3>
                    <p>Looking for: ${trade.lookingFor}</p>
                    <p>Posted by: ${trade.username}</p>
                </div>
            `;
        });
    }

    // Open modal to create a new trade
    createTradeBtn.addEventListener('click', () => {
        tradeModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        tradeModal.style.display = 'none';
    });

    // Submit a new trade
    tradeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cardName = document.getElementById('card-name').value;
        const lookingFor = document.getElementById('looking-for').value;
        const username = prompt("Enter your username:");

        const response = await fetch('/create-trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, cardName, lookingFor })
        });

        if (response.ok) {
            alert('Trade created successfully!');
            tradeModal.style.display = 'none';
            fetchAllTrades();
        } else {
            alert('Error creating trade!');
        }
    });

    // Buttons for viewing trades
    document.getElementById('all-listings-btn').addEventListener('click', fetchAllTrades);
    document.getElementById('user-listings-btn').addEventListener('click', fetchUserTrades);

    // Load all trades on page load
    fetchAllTrades();
});
