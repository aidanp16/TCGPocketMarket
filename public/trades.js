const baseUrl = "https://tcgpocketmarket.onrender.com"; // Base URL for all API calls

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in
    const username = sessionStorage.getItem('username');
    if (!username) {
        alert('You must be logged in to access this page.');
        window.location.href = '/login.html'; // Redirect to login page if not logged in
        return;
    }

    const tradeListings = document.getElementById('trade-listings');
    const tradeModal = document.getElementById('trade-modal');
    const createTradeBtn = document.getElementById('create-trade-btn');
    const closeModal = document.getElementById('close-modal');
    const tradeForm = document.getElementById('trade-form');

    // Function to fetch and display all trades excluding the user's listings
    async function fetchAllTrades() {
        try {
            const response = await fetch(`${baseUrl}/all-trades`);
            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const trades = await response.json();
            // Exclude the logged-in user's listings
            const filteredTrades = trades.filter(trade => trade.username !== username);
            displayTrades(filteredTrades);
        } catch (error) {
            console.error('Error fetching trades:', error.message);
            alert('Failed to fetch trades. Please try again later.');
        }
    }

    // Function to fetch and display trades for the logged-in user
    async function fetchUserTrades() {
        try {
            const response = await fetch(`${baseUrl}/user-trades?username=${username}`);
            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const trades = await response.json();
            displayUserTrades(trades);
        } catch (error) {
            console.error('Error fetching user listings:', error.message);
            alert('Failed to fetch your listings. Please try again later.');
        }
    }

    // Function to display all trades
    function displayTrades(trades) {
        tradeListings.innerHTML = ""; // Clear existing trades
        trades.forEach(trade => {
            const tradePost = document.createElement("div");
            tradePost.className = "trade-post";

            tradePost.innerHTML = `
                <h3>${trade.cardName}</h3>
                <p>Looking for: ${trade.lookingFor}</p>
                <p>Posted by: ${trade.username}</p>
            `;

            // Only show "Respond" button for trades not posted by the current user
            if (trade.username !== username) {
                const respondButton = document.createElement("button");
                respondButton.className = "respond-button";
                respondButton.textContent = "Respond";
                respondButton.setAttribute("data-recipient", trade.username);

                respondButton.addEventListener("click", (e) => {
                    const recipient = e.target.getAttribute("data-recipient");
                    respondToTrade(recipient);
                });

                tradePost.appendChild(respondButton);
            }

            tradeListings.appendChild(tradePost);
        });
    }

    // Function to display the user's trades with "Remove" button
    function displayUserTrades(trades) {
        tradeListings.innerHTML = ""; // Clear existing trades
        trades.forEach(trade => {
            const tradePost = document.createElement("div");
            tradePost.className = "trade-post";

            tradePost.innerHTML = `
                <h3>${trade.cardName}</h3>
                <p>Looking for: ${trade.lookingFor}</p>
                <p>Posted by: ${trade.username}</p>
                <button class="remove-button" data-trade-id="${trade._id}">Remove</button>
            `;

            // Add event listener to the "Remove" button
            tradePost.querySelector(".remove-button").addEventListener("click", async (e) => {
                const tradeId = e.target.getAttribute("data-trade-id");
                await removeTrade(tradeId);
            });

            tradeListings.appendChild(tradePost);
        });
    }

    // Function to remove a trade
    async function removeTrade(tradeId) {
        try {
            const response = await fetch(`${baseUrl}/remove-trade`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tradeId, username })
            });

            if (response.ok) {
                alert('Trade removed successfully!');
                fetchUserTrades(); // Refresh the user's listings
            } else {
                const errorData = await response.json();
                alert(`Error removing trade: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error removing trade:', error.message);
            alert('Failed to remove trade. Please try again later.');
        }
    }

    // Function to handle responding to a trade
    function respondToTrade(recipient) {
        if (recipient === username) {
            alert('You cannot message yourself.');
            return;
        }

        // Redirect to the inbox page and pre-fill the recipient username
        sessionStorage.setItem('recipient', recipient);
        window.location.href = "/inbox.html";
    }

    // Open modal to create a new trade
    createTradeBtn.addEventListener('click', () => {
        tradeModal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        tradeModal.style.display = 'none';
    });

    // Handle trade form submission
    tradeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cardName = document.getElementById('card-name').value;
        const lookingFor = document.getElementById('looking-for').value;

        try {
            const response = await fetch(`${baseUrl}/create-trade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, cardName, lookingFor })
            });

            if (response.ok) {
                alert('Trade created successfully!');
                tradeModal.style.display = 'none';
                fetchAllTrades(); // Refresh the trade listings
            } else {
                throw new Error('Error creating trade.');
            }
        } catch (error) {
            console.error('Error creating trade:', error.message);
            alert('Failed to create trade. Please try again.');
        }
    });

    // Event listeners for viewing trades
    document.getElementById('all-listings-btn').addEventListener('click', fetchAllTrades);
    document.getElementById('user-listings-btn').addEventListener('click', fetchUserTrades);

    // Fetch all trades on page load
    fetchAllTrades();
});
