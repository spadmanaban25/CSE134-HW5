document.addEventListener("DOMContentLoaded", () => {
    //Toggle Theme
    const themeSelect = document.getElementById("themeSelect");

    const themes = {
        original: {bg: "#ADD8E6", text: "#000000"},
        night: {bg: "#0D47A1", text: "#E0E0E0"},
        minima: { bg: "#ffffff", text: "#333333" },
        cayman: { bg: "#f0f8ff", text: "#005792" },
        midnight: { bg: "#121212", text: "#f5f5f5" },
        modernist: { bg: "#ffffff", text: "#000000" },
        slate: { bg: "#252525", text: "#dddddd" },
        hacker: { bg: "#0f0f0f", text: "#33ff33" }
    };

    function applyTheme(themeName) {
        const theme = themes[themeName];
        document.documentElement.style.setProperty("--bg-color", theme.bg);
        document.documentElement.style.setProperty("--text-color", theme.text);
        localStorage.setItem("selectedTheme", themeName);

        document.querySelectorAll("project-container").forEach(el => {
            el.style.backgroundColor = theme.bg;
            el.style.color = theme.text;
        });
    }

    function loadSavedTheme() {
        const savedTheme = localStorage.getItem("selectedTheme") || "minima";
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
    }

    themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));

    // Initial load
    loadSavedTheme();


    
    let form = document.getElementById("contact");
    if (!form) return; // Prevent errors if the script runs on a page without a form

    var form_errors = []; // Stores all errors (history)
    let active_errors = new Set(); // Tracks only current active errors

    let formErrorsField = document.createElement("input");
    formErrorsField.type = "hidden";
    formErrorsField.id = "formErrorsField";
    formErrorsField.name = "form_errors";
    form.appendChild(formErrorsField);

    const fields = [
        { id: "firstName", pattern: /^[a-zA-Z'-]+$/, message: "Only letters, apostrophes, and hyphens are allowed." },
        { id: "lastName", pattern: /^[a-zA-Z'-]+$/, message: "Only letters, apostrophes, and hyphens are allowed." },
        { id: "email", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Please enter a valid email address." },
        { id: "comments", pattern: /^[a-zA-Z0-9\s.,!?'"-]+$/, message: "Invalid character detected!" }
    ];

    fields.forEach(field => {
        let input = document.getElementById(field.id);
        if (!input) return; // Prevent errors if an input field is missing

        let error = input.parentElement.querySelector(".error");
        if (!error) return; // Prevent errors if .error element is missing

        input.addEventListener("input", () => {
            if (!field.pattern.test(input.value) && input.value !== "") {
                error.textContent = field.message;
                error.style.opacity = "1";
                error.style.color = "red";
            } else {
                error.textContent = "";
                error.style.opacity = "0";
            }
        });

        input.addEventListener("blur", () => {
            if (!field.pattern.test(input.value) && input.value !== "") {
                let error_entry = { field: field.id, value: input.value, message: field.message, timestamp: new Date().toISOString() };

                // Keep history of errors
                form_errors.push(error_entry);

                // Track active errors to prevent form submission
                active_errors.add(field.id);
            } else {
                active_errors.delete(field.id);
            }

            console.log("Error History:", form_errors);
            console.log("Active Errors:", [...active_errors]);
        });

        if (field.id === "comments") {
            const maxLength = 1000;
            let infoOutput = input.parentElement.querySelector(".info");
            if (!infoOutput) return; // Prevent errors if .info element is missing

            input.addEventListener("input", () => {
                let remaining = maxLength - input.value.length;
                infoOutput.textContent = remaining === maxLength ? "" : `${remaining} characters remaining`;

                infoOutput.style.color = remaining <= 50 ? "#99965a" : "";

                if (remaining < 0) {
                    error.textContent = "Character limit exceeded!";
                    error.style.opacity = "1";
                    error.style.color = "red";
                } else if (!field.pattern.test(input.value)) {
                    error.textContent = field.message;
                    error.style.opacity = "1";
                    error.style.color = "red";
                } else {
                    error.textContent = "";
                    error.style.opacity = "0";
                }
            });

            input.addEventListener("blur", () => {
                if (input.value.length > maxLength || !field.pattern.test(input.value)) {
                    let charError = { field: "comments", value: input.value, message: "Invalid character or exceeded limit!", timestamp: new Date().toISOString() };

                    form_errors.push(charError);

                    active_errors.add("comments");
                } else {
                    active_errors.delete("comments");
                }

                console.log("Error History:", form_errors);
                console.log("Active Errors:", [...active_errors]);
            });
        }
    });

    // Prevent form submission if there are active errors
    form.addEventListener("submit", (event) => {
        if (active_errors.size > 0) {
            event.preventDefault(); // Stop form from submitting
            alert("Cannot submit form. Please fix errors first.");
        } else {
            formErrorsField.value = JSON.stringify(form_errors);
        }
    });

});