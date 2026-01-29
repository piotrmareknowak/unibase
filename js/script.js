// script.js 

function sayHello() {
    alert("Hello from JavaScript!");
}

document.addEventListener("DOMContentLoaded", () => {
    const database = []; // array for all entries

    // Get search bar element
    const searchInput = document.getElementById("search");

    // Parse a .txt file into a JS object
    function parseTxt(text) {
        const obj = {};
        text.split("\n").forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            const parts = trimmed.split("=");
            const key = parts[0].trim();
            const value = parts.slice(1).join("=").trim();
            obj[key] = value || ""; // default empty string if missing
        });
        return obj;
    }

    // Render database entries filtered by search term
    function renderDatabase() {
        const container = document.getElementById("database");
        if (!container) return;

        container.innerHTML = ""; // clear previous entries

        const searchTerm = searchInput?.value.toLowerCase() || "";

        database
            .filter(entry =>
                Object.values(entry).some(val => val.toLowerCase().includes(searchTerm))
            )
            .forEach(entry => {
                const div = document.createElement("div");
                div.className = "entry";
                div.innerHTML = `
                    <h2>${entry.uni_name || "N/A"}</h2>
                    <p><strong>Country:</strong> ${entry.country || "N/A"}</p>
                    <p><strong>City:</strong> ${entry.city || "N/A"}</p>
                    <p><strong>Field:</strong> ${entry.study_field || "N/A"}</p>
                    <p><strong>Requirements:</strong> ${entry.requirements || "N/A"}</p>
                `;

                // --- CLICK HANDLER FOR MODAL ---
                div.addEventListener("click", () => {
                    const modal = document.getElementById("modal");

                    // Populate modal fields
                    document.getElementById("modal-title").textContent = entry.uni_name;
                    document.getElementById("modal-country").textContent = "Country: " + entry.country;
                    document.getElementById("modal-city").textContent = "City: " + entry.city;
                    document.getElementById("modal-field").textContent = "Field: " + entry.study_field;
                    document.getElementById("modal-requirements").textContent = "Requirements: " + entry.requirements;

                    // Set modal image
                    document.getElementById("modal-image").src = `images/${entry.filename.replace('.txt','')}.png`;

                    // Set Visit button
                    document.getElementById("modal-link").onclick = () => {
                        window.open(entry.link, "_blank");
                    };

                    // Show modal
                    modal.style.display = "flex";
                });

                container.appendChild(div);
            });
    }

    // Attach live search listener
    if (searchInput) {
        searchInput.addEventListener("input", renderDatabase);
    }

    // Load all files listed in index.json
    fetch("data/index.json")
        .then(res => res.json())
        .then(files => {
            const fetchPromises = files.map(file =>
                fetch("data/" + file)
                    .then(res => res.text())
                    .then(text => {
                        const entry = parseTxt(text);
                        entry.filename = file; // store filename for modal image
                        return entry;
                    })
            );

            Promise.all(fetchPromises)
                .then(entries => {
                    database.push(...entries); // store all entries
                    renderDatabase();          // initial render
                    console.log("Database loaded:", database);
                })
                .catch(err => console.error("Error parsing files:", err));
        })
        .catch(err => console.error("Error loading index.json:", err));

    // --- MODAL CLOSE LOGIC ---
    const modal = document.getElementById("modal");
    const modalClose = document.querySelector(".modal .close");

    if (modalClose) {
        modalClose.onclick = () => {
            modal.style.display = "none";
        };
    }

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
});
