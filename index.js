document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("input");
    const btn = document.querySelector(".search__btn");

    btn.addEventListener("click", () => {
        const query = input.value.trim();
        searchSongs(query);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btn.click();
    });

    showDefaultFleetwoodMac();
});


// GLOBAL ARRAYS
const customImages = [
    "./Assets/Last.jpg",
    "./Assets/Red.jpg",
    "./Assets/Rumors.jpg",
    "./Assets/The-Dance.jpg",
    "./Assets/Everywhere.jpg",
    "./Assets/Greatest-Hits.jpg"
];

const defaultTitles = [
    "Future Games",
    "Then Play On",
    "Rumors",
    "The Dance",
    "Everywhere",
    "Greatest Hits"
];

const defaultLabels = [
    "Soft Rock Classic",
    "Deep Cut",
    "Rumours Era",
    "Live Performance",
    "Feel-Good Track",
    "Greatest Hits Collection"
];


// SHOW DEFAULT CARDS
function showDefaultFleetwoodMac() {
    const results = document.getElementById("results");
    results.innerHTML = "";

    customImages.forEach((img, index) => {
        results.innerHTML += `
            <div class="song">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${img}" alt="Song Image">
                        <h3>${defaultTitles[index]}</h3>
                    </div>
                    <div class="flip-card-back">
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
            <div class="song">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${img}" alt="Song Image">
                        <h3>${title}</h3>
                    </div>
                    <div class="flip-card-back">
                        <p>${defaultLabels[index]}</p>
                    </div>
                </div>
            </div>
        `;
    });
}
