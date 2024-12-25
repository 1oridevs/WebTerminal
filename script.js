// DOM Elements
const inputField = document.getElementById("input");
const outputField = document.getElementById("output");
const suggestionsList = document.getElementById("suggestions");
const settingsModal = document.getElementById("settings-modal");
const settingsToggle = document.getElementById("settings-toggle");
const closeSettingsButton = document.getElementById("close-settings");
const fontSizeSelect = document.getElementById("font-size");
const backgroundColorSelect = document.getElementById("background-color");

// Command History
const commandHistory = [];
let historyIndex = -1;

// Predefined Commands
const commands = {
    help: "Available commands: help, about, clear, echo [message], date",
    about: "WebTerminal v1.0 - A lightweight web-based terminal emulator.",
    clear: "Clears the terminal screen.",
    date: `Current Date: ${new Date().toLocaleString()}`,
    echo: (args) => args.join(" "),
};

// Add Output to Terminal
const addOutput = (text) => {
    outputField.textContent += `\n${text}`;
    outputField.scrollTop = outputField.scrollHeight;
};

// Process Command
const processCommand = (input) => {
    const [command, ...args] = input.trim().split(" ");
    if (command in commands) {
        if (typeof commands[command] === "function") {
            addOutput(commands[command](args));
        } else if (command === "clear") {
            clearTerminal();
        } else {
            addOutput(commands[command]);
        }
    } else {
        addOutput(`Command not found: ${command}`);
    }
};

// Clear Terminal
const clearTerminal = () => {
    outputField.textContent = "Welcome to WebTerminal! Type \"help\" for a list of commands.";
};

// Show Suggestions
const showSuggestions = (input) => {
    const matches = Object.keys(commands).filter((cmd) => cmd.startsWith(input));
    suggestionsList.innerHTML = "";
    if (matches.length > 0) {
        matches.forEach((match) => {
            const suggestionItem = document.createElement("li");
            suggestionItem.textContent = match;
            suggestionItem.className = "p-2 hover:bg-gray-700 cursor-pointer";
            suggestionItem.onclick = () => {
                inputField.value = match;
                hideSuggestions();
            };
            suggestionsList.appendChild(suggestionItem);
        });
        suggestionsList.classList.remove("hidden");
    } else {
        hideSuggestions();
    }
};

// Hide Suggestions
const hideSuggestions = () => {
    suggestionsList.classList.add("hidden");
};

// Auto-Complete Command with Tab
const autoCompleteCommand = (input) => {
    const matches = Object.keys(commands).filter((cmd) => cmd.startsWith(input));
    if (matches.length === 1) {
        inputField.value = matches[0];
        hideSuggestions();
    } else if (matches.length > 1) {
        showSuggestions(input);
    } else {
        hideSuggestions();
    }
};

// Toggle Settings Modal
const toggleSettingsModal = () => {
    settingsModal.classList.toggle("hidden");
};

// Apply UI Settings
const applySettings = () => {
    const fontSize = fontSizeSelect.value;
    const backgroundColor = backgroundColorSelect.value;

    // Apply Font Size
    if (fontSize === "small") {
        outputField.style.fontSize = "0.875rem";
    } else if (fontSize === "medium") {
        outputField.style.fontSize = "1rem";
    } else if (fontSize === "large") {
        outputField.style.fontSize = "1.25rem";
    }

    // Apply Background Color
    if (backgroundColor === "dark") {
        document.body.className = "bg-gray-900 text-white font-mono";
    } else if (backgroundColor === "light") {
        document.body.className = "bg-white text-black font-mono";
    }
};

// Keyboard Shortcuts
const handleKeyboardShortcuts = (e) => {
    if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        clearTerminal();
    } else if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        addOutput("^C");
    }
};

// Event Listeners
inputField.addEventListener("input", () => {
    const input = inputField.value.trim();
    if (input) {
        showSuggestions(input);
    } else {
        hideSuggestions();
    }
});

inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const input = inputField.value.trim();
        if (input) {
            addOutput(`$ ${input}`);
            commandHistory.push(input);
            historyIndex = commandHistory.length;
            processCommand(input);
            inputField.value = "";
            hideSuggestions();
        }
    } else if (e.key === "ArrowUp") {
        // Navigate Command History (Up)
        if (historyIndex > 0) {
            historyIndex--;
            inputField.value = commandHistory[historyIndex];
        }
    } else if (e.key === "ArrowDown") {
        // Navigate Command History (Down)
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputField.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            inputField.value = "";
        }
    } else if (e.key === "Tab") {
        // Auto-Complete Command
        e.preventDefault();
        autoCompleteCommand(inputField.value.trim());
    }
});

settingsToggle.addEventListener("click", toggleSettingsModal);
closeSettingsButton.addEventListener("click", toggleSettingsModal);
fontSizeSelect.addEventListener("change", applySettings);
backgroundColorSelect.addEventListener("change", applySettings);

// Initialize Terminal
document.addEventListener("DOMContentLoaded", () => {
    applySettings();
});
