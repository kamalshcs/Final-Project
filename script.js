let allTrails = [];
const apiKey = "a0ef86923be135762510ee93dc098596";

// 1. Fetch data from GitHub
async function fetchTrails() {
    const jsonUrl = "https://raw.githubusercontent.com/kamalshcs/Final-Project/main/trails.json";
    
    try {
        const response = await fetch(jsonUrl);
        allTrails = await response.json();
        renderGallery(allTrails);
    } catch (error) {
        console.error("Error fetching trails:", error);
        document.getElementById('trail-list').innerHTML = "<p>Failed to load trails.</p>";
    }
}

// 2. Render Gallery using .map().join('')
function renderGallery(trailData) {
    const grid = document.getElementById('trail-list');
    
    if (trailData.length === 0) {
        grid.innerHTML = "<p>No trails found matching your search.</p>";
        return;
    }

    // We add 'data-name' to the button so the event listener knows which trail was clicked
    grid.innerHTML = trailData.map(trail => `
        <article class="trail-card-glass">
            <div class="card-image-container">
                <img class="card-images" src="images/${trail.image}" alt="${trail.name}">
                <span class="trail-badge">${trail.type}</span>
            </div>
            <div class="card-content">
                <h3>${trail.name}</h3>
                <p>${trail.location} - ${trail.dist || trail.distance}</p>
                <button type="button" class="view-trails-btn" data-name="${trail.name}">
                    View Trail
                </button>
            </div>
        </article>`
    ).join('');
}

// 3. Option 2: Event Delegation (One listener for the whole grid)
document.getElementById('trail-list').addEventListener('click', (e) => {
    // Check if the clicked element is our "View Trail" button
    if (e.target.classList.contains('view-trails-btn')) {
        const trailName = e.target.getAttribute('data-name');
        
        // Find the specific trail object in our master array
        const selectedTrail = allTrails.find(t => t.name === trailName);
        
        if (selectedTrail) {
            openTrailModal(selectedTrail);
        }
    }
});

// 4. Filter Logic
function applyFilters() {
    const searchTerm = document.getElementById('trailSearch').value.toLowerCase();
    const checkedDiffs = Array.from(document.querySelectorAll('.type-check:checked'))
                              .map(checkbox => checkbox.value);

    const filtered = allTrails.filter(trail => {
        const matchesSearch = trail.name.toLowerCase().includes(searchTerm) || 
                              trail.location.toLowerCase().includes(searchTerm);
        const matchesDiff = checkedDiffs.length === 0 || checkedDiffs.includes(trail.type);
        return matchesSearch && matchesDiff;
    });

    renderGallery(filtered);
}

// 5. Modal Logic (Includes Weather API)
async function openTrailModal(trail) {
    const modal = document.getElementById('trailModal');
    const modalBody = document.getElementById('modalBody');
    
    modal.style.display = "block";
    modalBody.innerHTML = "<div class='loading-spinner'>Loading trail details...</div>";

    try {
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${trail.city || 'Toronto'},CA&units=metric&appid=${apiKey}`
        );
        const weatherData = await weatherResponse.json();

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="images/${trail.image}" alt="${trail.name}" class="modal-img">
                <h2>${trail.name}</h2>
            </div>
            <div class="modal-info">
                <p><strong>Location:</strong> ${trail.location}</p>
                <p><strong>Distance:</strong> ${trail.dist || trail.distance}</p>
                <p><strong>Difficulty:</strong> ${trail.type}</p>
            </div>
            <div class="weather-widget">
                <h3>Live Weather in ${trail.city || 'Ontario'}</h3>
                <div class="weather-details">
                    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather icon">
                    <p class="temp">${Math.round(weatherData.main.temp)}°C</p>
                    <p class="desc">${weatherData.weather[0].description}</p>
                </div>
            </div>
            <button class="close-btn" id="modalCloseAction">Close Explorer</button>
        `;

        // Attach listener to the dynamic close button inside the modal
        document.getElementById('modalCloseAction').addEventListener('click', closeModal);

    } catch (error) {
        modalBody.innerHTML = `<p>Error loading weather. Please try again later.</p>`;
        console.error("Weather API Error:", error);
    }
}

// 6. Close Functions
function closeModal() {
    document.getElementById('trailModal').style.display = "none";
}

// Event Listeners for search and filters
document.getElementById('trailSearch').addEventListener('input', applyFilters);
document.querySelectorAll('.type-check').forEach(box => {
    box.addEventListener('change', applyFilters);
});

// Close when clicking the X icon
const closeIcon = document.getElementById('closeModal');
if(closeIcon) closeIcon.addEventListener('click', closeModal);

// Close when clicking outside the modal
window.onclick = function(event) {
    const modal = document.getElementById('trailModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Start the app
fetchTrails();