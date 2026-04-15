let allTrails = [];

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

function renderGallery(trailData) {
    const grid = document.getElementById('trail-list');
    
    if (trailData.length === 0) {
        grid.innerHTML = "<p>No trails found matching your search.</p>";
        return;
    }

    grid.innerHTML = trailData.map(trail => 
        `<article class="trail-card-glass">
            <div class="card-image-container">
                <img class="card-images" src="images/${trail.image}" alt="Description of Projects">
                <span class="trail-badge">${trail.type}</span>
            </div>
            <div class="card-content">
                <h3>${trail.name}</h3>
                <p>${trail.location} - ${trail.dist}</p>
                <button type="button" class="view-trails-btn">View Trail</button>
            </div>
        </article>`
    ).join('');
}

function applyFilters() {
    const searchTerm = document.getElementById('trailSearch').value.toLowerCase();
    
    // Get all checked difficulty boxes
    const checkedDiffs = Array.from(document.querySelectorAll('.type-check:checked'))
                              .map(cb => cb.value);

    const filtered = allTrails.filter(trail => {
        const matchesSearch = trail.name.toLowerCase().includes(searchTerm) || trail.location.toLowerCase().includes(searchTerm);
        const matchesDiff = checkedDiffs.length === 0 || checkedDiffs.includes(trail.type);
        return matchesSearch && matchesDiff;
    });

    renderGallery(filtered);
}

document.getElementById('trailSearch').addEventListener('input', applyFilters);
document.querySelectorAll('.type-check').forEach(box => {
    box.addEventListener('change', applyFilters);
});


fetchTrails();