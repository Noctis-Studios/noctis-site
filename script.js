// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Fetch game data from JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Initialize game cards
            initGameCards(data.games);
            
            // Set up modal functionality
            setupModal();
            
            // Add midnight theme effects
            addMidnightEffects();
        })
        .catch(error => {
            console.error('Error loading game data:', error);
            document.getElementById('game-cards-container').innerHTML = '<p class="error-message">Error loading game data. Please try again later.</p>';
        });
});

// Initialize game cards based on JSON data
function initGameCards(games) {
    const gameCardsContainer = document.getElementById('game-cards-container');
    
    // Clear container
    gameCardsContainer.innerHTML = '';
    
    // Check if games array exists and has items
    if (!games || games.length === 0) {
        gameCardsContainer.innerHTML = '<p class="error-message">No games found.</p>';
        return;
    }
    
    // Create a card for each game
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.dataset.gameId = game.id;
        
        // Make sure background path is correct with proper path handling
        const backgroundPath = game.background || 'img/default-game.png';
        
        gameCard.innerHTML = `
            <div class="game-card-bg" style="background-image: url('${backgroundPath}')"></div>
            <div class="game-card-overlay">
                <h3>${game.title}</h3>
                <p>${game.shortDesc}</p>
            </div>
        `;
        
        // Add click event to open modal
        gameCard.addEventListener('click', () => {
            openGameModal(game);
            console.log('Game card clicked', game); // Debug log
        });
        
        gameCardsContainer.appendChild(gameCard);
    });
}

// Set up modal functionality
function setupModal() {
    const modal = document.getElementById('game-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', () => {
        closeModal();
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('show-modal')) {
            closeModal();
        }
    });
}

// Open game modal with specific game data
function openGameModal(game) {
    const modal = document.getElementById('game-modal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    try {
        // Fill modal with game data
        document.getElementById('modal-title').textContent = game.title || 'Game Details';
        
        // Handle background image
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            modalImage.style.backgroundImage = `url('${game.background || ''}')`;
        }
        
        // Handle description
        const modalDesc = document.getElementById('modal-description');
        if (modalDesc) {
            modalDesc.textContent = game.description || 'No description available.';
        }
        
        // Fill achievements - with error handling
        const achievementsList = document.getElementById('modal-achievements');
        if (achievementsList) {
            achievementsList.innerHTML = '';
            
            // Check if achievements array exists
            if (game.achievements && Array.isArray(game.achievements)) {
                if (game.achievements.length === 0) {
                    achievementsList.innerHTML = '<li>No achievements listed yet.</li>';
                } else {
                    game.achievements.forEach(achievement => {
                        const li = document.createElement('li');
                        li.textContent = achievement;
                        achievementsList.appendChild(li);
                    });
                }
            } else {
                achievementsList.innerHTML = '<li>No achievements listed yet.</li>';
            }
        }
        
        // Fill team members - with error handling
        const teamGrid = document.getElementById('modal-team');
        if (teamGrid) {
            teamGrid.innerHTML = '';
            
            // Check if team array exists
            if (game.team && Array.isArray(game.team) && game.team.length > 0) {
                game.team.forEach(member => {
                    const memberDiv = document.createElement('div');
                    memberDiv.className = 'team-member';
                    memberDiv.innerHTML = `
                        <h4>${member.name || 'Team Member'}</h4>
                        <p>${member.role || 'Contributor'}</p>
                        <p class="joined">Joined ${member.joined || 'N/A'}</p>
                    `;
                    teamGrid.appendChild(memberDiv);
                });
            } else {
                teamGrid.innerHTML = '<div class="team-member"><h4>No team members listed</h4></div>';
            }
        }
        
        // Display modal
        modal.classList.add('show-modal');
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        console.log('Modal opened for game:', game.title);
    } catch (err) {
        console.error('Error opening modal:', err);
    }
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('game-modal');
    modal.classList.remove('show-modal');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
}
// Add midnight
function addMidnightEffects() {
    // pulse effect to header
    const siteHeader = document.querySelector('header h1');
    if (siteHeader) {
        setInterval(() => {
            siteHeader.style.textShadow = '0 0 15px rgba(95, 110, 229, 0.7)';
            setTimeout(() => {
                siteHeader.style.textShadow = '0 0 10px rgba(95, 110, 229, 0.5)';
            }, 1500);
        }, 3000);
    }
    
    // Add hover effects to game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.game-card-overlay');
            overlay.style.background = 'linear-gradient(to top, rgba(5, 8, 24, 0.9) 0%, rgba(12, 14, 26, 0.7) 40%, rgba(19, 24, 54, 0.3) 80%, rgba(30, 33, 64, 0.1) 100%)';
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.game-card-overlay');
            overlay.style.background = 'linear-gradient(to top, rgba(5, 8, 24, 0.9) 0%, rgba(12, 14, 26, 0.8) 40%, rgba(19, 24, 54, 0.4) 80%, rgba(30, 33, 64, 0.2) 100%)';
        });
    });
    
    // Add subtle animation to logo
    const logo = document.querySelector('.logo img');
    if (logo) {
        setInterval(() => {
            logo.style.filter = 'drop-shadow(0 0 12px rgba(95, 110, 229, 0.5))';
            setTimeout(() => {
                logo.style.filter = 'drop-shadow(0 0 8px rgba(95, 110, 229, 0.3))';
            }, 2000);
        }, 4000);
    }
}
