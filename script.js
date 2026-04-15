let allTrails = [];

async function fetchTrails() {
    const jsonUrl = "https://raw.githubusercontent.com/kamalshcs/Final-Project/main/trails.json";
    
    try {
        const response = await fetch(jsonUrl);
        allTrails = await response.json();
        renderGallery(allTrails);
    } catch (error) {
        console.error("Error fetching trails:", error);
        document.getElementById('trailGrid').innerHTML = "<p>Failed to load trails.</p>";
    }
}

// 2. Render Gallery using .map()
function renderGallery(trailData) {
    const grid = document.getElementById('trailGrid');
    
    if (trailData.length === 0) {
        grid.innerHTML = "<p>No trails found matching your search.</p>";
        return;
    }

    grid.innerHTML = trailData.map(trail => `
        <article class="trail-card">
            <div class="card-image" style="background: #eee; height: 150px; display:flex; align-items:center; justify-content:center;">
                <span>Photo of ${trail.name}</span>
            </div>
            <div class="card-content">
                <h4>${trail.name}</h4>
                <p><strong>Location:</strong> ${trail.location}</p>
                <p><strong>Distance:</strong> ${trail.dist}</p>
                <p><strong>Difficulty:</strong> ${trail.diff}</p>
                <button onclick="fetchWeather('${trail.location}', '${trail.name}')">View Weather</button>
            </div>
        </article>
    `).join('');
}

// 3. Search and Filter Logic
function applyFilters() {
    const searchTerm = document.getElementById('trailSearch').value.toLowerCase();
    
    // Get all checked difficulty boxes
    const checkedDiffs = Array.from(document.querySelectorAll('.diff-check:checked'))
                              .map(cb => cb.value);

    const filtered = allTrails.filter(trail => {
        const matchesSearch = trail.name.toLowerCase().includes(searchTerm) || trail.location.toLowerCase().includes(searchTerm);
        const matchesDiff = checkedDiffs.length === 0 || checkedDiffs.includes(trail.diff);
        return matchesSearch && matchesDiff;
    });

    renderGallery(filtered);
}

document.getElementById('trailSearch').addEventListener('input', applyFilters);
document.querySelectorAll('.diff-check').forEach(box => {
    box.addEventListener('change', applyFilters);
});



// Initialize the page
fetchTrails();