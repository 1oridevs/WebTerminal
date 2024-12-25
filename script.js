// DOM Elements
const inputField = document.getElementById("input");
const outputField = document.getElementById("output");
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
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const input = inputField.value.trim();
        if (input) {
            addOutput(`$ ${input}`);
            commandHistory.push(input);
            historyIndex = commandHistory.length;
            processCommand(input);
            inputField.value = "";
        }
    }
});
document.addEventListener("keydown", handleKeyboardShortcuts);
settingsToggle.addEventListener("click", toggleSettingsModal);
closeSettingsButton.addEventListener("click", toggleSettingsModal);
fontSizeSelect.addEventListener("change", applySettings);
backgroundColorSelect.addEventListener("change", applySettings);

// Initialize Terminal
document.addEventListener("DOMContentLoaded", () => {
    applySettings();
});
