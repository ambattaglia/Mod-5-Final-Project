document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("input");
    const btn = document.querySelector(".search__btn");
    
    // Grab the slider and the text element that displays the year
    const yearSlider = document.getElementById("yearSlider");
    const yearValue = document.getElementById("yearValue");

    // Listen for when the slider is moved and update the text
    yearSlider.addEventListener("input", (e) => {
        yearValue.textContent = e.target.value;
        
        // If you want to filter your results based on the year later, 
        // you would call a filter function right here!
    });

    btn.addEventListener("click", () => {
        const query = input.value.trim();
        searchSongs(query);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btn.click();
    });

    showDefaultFleetwoodMac();
});



// --- GLOBAL ARRAYS ---
// Combining everything into objects so we can easily sort and filter by year
const defaultAlbums = [
    { title: "Then Play On", year: 1969, label: "Deep Cut", img: "./Assets/Red.jpg" },
    { title: "Future Games", year: 1971, label: "Soft Rock Classic", img: "./Assets/Last.jpg" },
    { title: "Rumors", year: 1977, label: "Rumors Era", img: "./Assets/Rumors.jpg" },
    { title: "Everywhere", year: 1987, label: "Feel-Good Track", img: "./Assets/Everywhere.jpg" },
    { title: "Greatest Hits", year: 1988, label: "Greatest Hits Collection", img: "./Assets/Greatest-Hits.jpg" },
    { title: "The Dance", year: 1997, label: "Live Performance", img: "./Assets/The-Dance.jpg" }
];

// Keep these around so your search function doesn't break
const customImages = defaultAlbums.map(album => album.img);
const defaultLabels = defaultAlbums.map(album => album.label);


document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("input");
    const btn = document.querySelector(".search__btn");
    
    const yearSlider = document.getElementById("yearSlider");
    const yearValue = document.getElementById("yearValue");

    // 1. Initial Page Load
    const initialYear = parseInt(yearSlider.value);
    yearValue.textContent = initialYear;
    filterAndRenderAlbums(initialYear);

    // 2. Listen for Slider Movement
    yearSlider.addEventListener("input", (e) => {
        const selectedYear = parseInt(e.target.value);
        yearValue.textContent = selectedYear;
        
        // Filter albums that were released on or before the selected year
        filterAndRenderAlbums(selectedYear);
    });

    btn.addEventListener("click", () => {
        const query = input.value.trim();
        if(query !== "") searchSongs(query);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btn.click();
    });
});


// FILTER AND RENDER FUNCTION
function filterAndRenderAlbums(maxYear) {
    const results = document.getElementById("results");
    results.innerHTML = "";

    // Filter albums by the slider year
    const filteredAlbums = defaultAlbums.filter(album => album.year <= maxYear);

    // If no albums match the year, show a message
    if (filteredAlbums.length === 0) {
        results.innerHTML = `<p class="no-results">No albums released yet!</p>`;
        return;
    }

    // Render the matching albums
    filteredAlbums.forEach((album) => {
        results.innerHTML += `
            <div class="song flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${album.img}" alt="Song Image">
                        <h3>${album.title}</h3>
                        <p style="color: #7a3cff; font-size: 14px; margin-top: 4px; font-weight: bold;">Released: ${album.year}</p>
                    </div>
                    <div class="flip-card-back">
                        <i class="fa-solid fa-qrcode"></i>
                        <p style="font-weight: bold; margin-bottom: -10px;">Scan for soundtrack</p>
                        <p>${album.label}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// Keep this strictly for the search function's fallback
function showDefaultFleetwoodMac() {
    filterAndRenderAlbums(2000); 
}


// SHOW DEFAULT CARDS
function showDefaultFleetwoodMac() {
    const results = document.getElementById("results");
    results.innerHTML = "";

    customImages.forEach((img, index) => {
        results.innerHTML += `
            <div class="song flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${img}" alt="Song Image">
                        <h3>${defaultTitles[index]}</h3>
                    </div>
                    <div class="flip-card-back">
                        <i class="fa-solid fa-qrcode"></i>
                        <p style="font-weight: bold; margin-bottom: -10px;">Scan for soundtrack</p>
                        <p>${defaultLabels[index]}</p>
                    </div>
                </div>

                
            </div>
        `;
    });
}


// SEARCH FUNCTION
async function searchSongs(query) {
    const loading = document.getElementById("loading");
    const results = document.getElementById("results");

    loading.classList.remove("hidden");
    results.innerHTML = "";

    const url = `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json`;

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "MusicApp/1.0 (andrea@example.com)"
            }
        });

        const data = await res.json();
        loading.classList.add("hidden");

        displaySongs(data.recordings);
    } catch (error) {
        console.error("Error fetching data:", error);
        loading.classList.add("hidden");
        results.innerHTML = `<p class="no-results">No results found.</p>`;
    }
}


// DISPLAY RESULTS (ONLY FLEETWOOD MAC)
function displaySongs(songs) {
    const results = document.getElementById("results");
    results.innerHTML = "";

    // If API returned nothing or wrong structure
    if (!songs || !Array.isArray(songs)) {
        results.innerHTML = `<p class="no-results">No results found.</p>`;
        return;
    }

    // Filter ONLY Fleetwood Mac
    const filtered = songs.filter(song => {
        const artist = song["artist-credit"]?.[0]?.name?.toLowerCase() || "";
        return artist === "fleetwood mac";
    });

    // If nothing matches → show message
    if (filtered.length === 0) {
        results.innerHTML = `<p class="no-results">No results found.</p>`;
        return;
    }

    // Show up to 6 Fleetwood Mac results
    filtered.slice(0, 6).forEach((song, index) => {
        const title = song.title;
        const img = customImages[index];

        results.innerHTML += `
            <div class="song flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${img}" alt="Song Image">
                        <h3>${title}</h3>
                    </div>
                    <div class="flip-card-back">
                        <i class="fa-solid fa-qrcode"></i>
                        <p style="font-weight: bold; margin-bottom: -10px;">Scan for soundtrack</p>
                        <p>${defaultLabels[index]}</p>
                    </div>
                </div>
            </div>
        `;
        
    });
}
