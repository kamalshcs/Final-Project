let allTrails = [];
const apiKey = "a0ef86923be135762510ee93dc098596";

// --- 1. NAVIGATION & HAMBURGER (Works on all pages) ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show-menu');
        hamburger.classList.toggle('open');
    });
}

// --- 2. TRAIL DATA & GALLERY (Only runs on trails.html) ---
const trailList = document.getElementById('trail-list');

if (trailList) {
    async function fetchTrails() {
        const jsonUrl = "https://raw.githubusercontent.com/kamalshcs/Final-Project/main/trails.json";
        try {
            const response = await fetch(jsonUrl);
            allTrails = await response.json();
            renderGallery(allTrails);
        } catch (error) {
            console.error("Error:", error);
            trailList.innerHTML = "<p>Failed to load trails.</p>";
        }
    }

    function renderGallery(trailData) {
        trailList.innerHTML = trailData.map(trail => `
            <article class="trail-card-glass">
                <div class="card-image-container">
                    <img class="card-images" src="images/${trail.image}" alt="${trail.name}">
                    <span class="trail-badge">${trail.type}</span>
                </div>
                <div class="card-content">
                    <h3>${trail.name}</h3>
                    <p>${trail.location} - ${trail.dist || trail.distance}</p>
                    <button type="button" class="view-trails-btn" data-name="${trail.name}">View Trail</button>
                </div>
            </article>`).join('');
    }

    // Event Delegation for "View Trail" buttons
    trailList.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-trails-btn')) {
            const trailName = e.target.getAttribute('data-name');
            const selectedTrail = allTrails.find(t => t.name === trailName);
            if (selectedTrail) openTrailModal(selectedTrail);
        }
    });

    fetchTrails();
}

// --- 3. FILTERS & SEARCH (Only runs on trails.html) ---
const searchInput = document.getElementById('trailSearch');
if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    document.querySelectorAll('.type-check').forEach(box => {
        box.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const checkedDiffs = Array.from(document.querySelectorAll('.type-check:checked')).map(cb => cb.value);

    const filtered = allTrails.filter(trail => {
        const matchesSearch = trail.name.toLowerCase().includes(searchTerm) || trail.location.toLowerCase().includes(searchTerm);
        const matchesDiff = checkedDiffs.length === 0 || checkedDiffs.includes(trail.type);
        return matchesSearch && matchesDiff;
    });
    renderGallery(filtered);
}

// --- 4. CONTACT FORM (Only runs on contact.html) ---
const contactForm = document.querySelector('.form');
const glassCard = document.querySelector('.glass-card');

if (contactForm && glassCard) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the 405 error!
        const userName = document.getElementById('user-name').value;

        glassCard.innerHTML = `
            <div class="success-box" style="text-align: center; padding: 50px 20px;">
                <h2 style="color: #fff;">🌿 Report Received!</h2>
                <p style="color: white; margin: 20px 0; font-size:1.5rem;">Thanks for the update, <strong>${userName}</strong>.</p>
                <button onclick="location.reload()" class="report-button">Send Another</button>
            </div>`;
    });
}

// --- 5. MODAL LOGIC (Shared) ---
async function openTrailModal(trail) {
    const modal = document.getElementById('trailModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    modal.style.display = "flex"; // Centered using flex
    modalBody.innerHTML = "<p>Loading weather...</p>";

    try {
        const weatherResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${trail.city || 'Toronto'},CA&units=metric&appid=${apiKey}`);
        const data = await weatherResp.json();
        modalBody.innerHTML = `
            <h2>${trail.name}</h2>
            <p>${trail.location}</p>
            <div class="weather-widget">
                <p>${Math.round(data.main.temp)}°C - ${data.weather[0].description}</p>
            </div>
            <button class="close-btn" onclick="closeModal()">Close</button>`;
    } catch (e) {
        modalBody.innerHTML = "<p>Weather unavailable.</p>";
    }
}

function closeModal() {
    const modal = document.getElementById('trailModal');
    if (modal) modal.style.display = "none";
}