document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("input");
    const btn = document.querySelector(".search__btn");
    
    const yearSlider = document.getElementById("yearSlider");
    const yearValue = document.getElementById("yearValue");

    
    const initialYear = parseInt(yearSlider.value);
    yearValue.textContent = initialYear;
    filterAndRenderAlbums(initialYear);

    
    yearSlider.addEventListener("input", (e) => {
        const selectedYear = parseInt(e.target.value);
        yearValue.textContent = selectedYear;
        
        
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


// --- GLOBAL ARRAYS ---

const defaultAlbums = [
    { title: "Then Play On", year: 1969, label: "Deep Cut", img: "./Assets/Red.jpg" },
    { title: "Future Games", year: 1971, label: "Soft Rock Classic", img: "./Assets/Last.jpg" },
    { title: "Rumors", year: 1977, label: "Rumors Era", img: "./Assets/Rumors.jpg" },
    { title: "Everywhere", year: 1987, label: "Feel-Good Track", img: "./Assets/Everywhere.jpg" },
    { title: "Greatest Hits", year: 1988, label: "Greatest Hits Collection", img: "./Assets/Greatest-Hits.jpg" },
    { title: "The Dance", year: 1997, label: "Live Performance", img: "./Assets/The-Dance.jpg" }
];


// FILTER AND RENDER FUNCTION (For the Default Fleetwood Mac albums)
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


// Fallback function 
function showDefaultFleetwoodMac() {
    filterAndRenderAlbums(2000); 
}


// SEARCH FUNCTION (Queries MusicBrainz API)
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


// DISPLAY RESULTS (ALL ARTISTS)
function displaySongs(songs) {
    const results = document.getElementById("results");
    results.innerHTML = "";

    // If API returned nothing or wrong structure
    if (!songs || !Array.isArray(songs) || songs.length === 0) {
        results.innerHTML = `<p class="no-results">No results found.</p>`;
        return;
    }

    // Show up to 6 results from ANY artist
    songs.slice(0, 6).forEach((song) => {
        const title = song.title || "Unknown Title";
        
        // Grab the actual artist name from the API!
        const artist = song["artist-credit"]?.[0]?.name || "Unknown Artist";
        
        // Use a generic placeholder image for search results
        const img = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"; 

        // Try to get the release year from the MusicBrainz API
        const year = song["first-release-date"] ? song["first-release-date"].substring(0, 4) : "Unknown Year";

        results.innerHTML += `
            <div class="song flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${img}" alt="Song Image">
                        <h3>${title}</h3>
                        <p style="color: #7a3cff; font-size: 14px; margin-top: 4px; font-weight: bold;">By: ${artist}</p>
                    </div>
                    <div class="flip-card-back">
                        <i class="fa-solid fa-qrcode"></i>
                        <p style="font-weight: bold; margin-bottom: -10px;">Scan for soundtrack</p>
                        <p>Released: ${year}</p>
                    </div>
                </div>
            </div>
        `;
    });
}
