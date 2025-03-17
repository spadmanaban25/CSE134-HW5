document.addEventListener("DOMContentLoaded", async () => {
    class ProjectCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });

            this.shadowRoot.innerHTML = `
                <style>
                    .card {
                        width: 320px;
                        border-radius: 12px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        padding: 16px;
                        background: #fff;
                        font-family: Arial, sans-serif;
                        transition: transform 0.2s ease-in-out;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
    
                    .card:hover {
                        transform: scale(1.05);
                    }
    
                    h2 {
                        font-size: 1.5em;
                        color: var(--text-color);
                        margin: 10px 0;
                    }
    
                    picture img {
                        width: 100%;
                        border-radius: 8px;
                    }
    
                    .description {
                        font-size: 1em;
                        color: #667069;
                        margin: 10px 0;
                    }
    
                    a {
                        display: inline-block;
                        text-decoration: none;
                        color: #007BFF;
                        font-weight: bold;
                        margin-top: 10px;
                    }
    
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
    
                <div class="card">
                    <h2></h2>
                    <picture>
                        <img src="" alt="">
                    </picture>
                    <p class="description"></p>
                    <a href="" target="#"></a>
                </div>
            `;
        }
        connectedCallback() {
            this.shadowRoot.querySelector("h2").textContent = this.getAttribute("title");
            this.shadowRoot.querySelector("img").src = this.getAttribute("imgSrc");
            this.shadowRoot.querySelector("img").alt = this.getAttribute("imgAlt");
            this.shadowRoot.querySelector("p").textContent = this.getAttribute("description");
            this.shadowRoot.querySelector("a").href = this.getAttribute("link");
            this.shadowRoot.querySelector("a").textContent = this.getAttribute("linkText");
        }
    }
    customElements.define("project-card", ProjectCard);
    const container = document.getElementById("project-container");


    function addCard(jsonData) {
        const card = document.createElement("project-card");
        Object.entries(jsonData).forEach(([key, value]) => card.setAttribute(key, value));
        container.appendChild(card);
    }

    try {
        const response = await fetch("projectData.json");
        const data = await response.json();
        localStorage.setItem("projects", JSON.stringify(data));
    } catch (error) {
        console.log("Error fetching data: ", error);
    }

    const localBtn = document.getElementById("localLoad");
    const remoteBtn = document.getElementById("loadRemote");

    let onScreen = false;
    localBtn.addEventListener("click", () => {
        container.style.border = "none";
        document.getElementById("project_msg").innerHTML='';
        document.getElementById("project_msg").style.margin='0px';
        const projectData = localStorage.getItem("projects");
        if (!onScreen) {
            if (projectData) {
                JSON.parse(projectData).forEach(addCard);
                onScreen = true;
            } else {
                console.log("No data");
            }
        } 

    });

    remoteBtn.addEventListener("click", async () => {
        container.style.border = "none";
        document.getElementById("project_msg").innerHTML='';
        document.getElementById("project_msg").style.margin='0px';
        const binId = '67d0bd678960c979a56fc9c1';
        const apiKey = '$2a$10$KLcCVfdzi.XI8RHc8fO34eqxRTA/.sNL4LPZO89WHs8nsLAYGQqKO';
        if (!onScreen) {
            try {
                const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
                    method: "GET",
                    headers: {
                        "X-Master-Key": apiKey,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const projectData = data.record;
                    if (!onScreen) {
                        projectData.forEach(addCard);
                        onScreen = true;
                    }
                } else {
                    console.log("Failed to fetch data");
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
});
