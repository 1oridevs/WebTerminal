// DOM Elements
const inputField = document.getElementById("input");
const outputField = document.getElementById("output");
const suggestionsList = document.getElementById("suggestions");

// Command History
const commandHistory = [];
let historyIndex = -1;

// Predefined Commands
const commands = {
    help: "Available commands: help, about, clear, echo [message], date, theme",
    about: "WebTerminal v1.0 - A lightweight web-based terminal emulator.",
    clear: "Clears the terminal screen.",
    date: `Current Date: ${new Date().toLocaleString()}`,
    echo: (args) => args.join(" "),
    theme: (args) => {
        if (args[0] === "dark") {
            setTheme("dark");
            return "Theme set to dark mode.";
        } else if (args[0] === "light") {
            setTheme("light");
            return "Theme set to light mode.";
        } else {
            return "Usage: theme [dark|light]";
        }
    },
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
            outputField.textContent = "Welcome to WebTerminal! Type \"help\" for a list of commands.";
        } else {
            addOutput(commands[command]);
        }
    } else {
        addOutput(`Command not found: ${command}`);
    }
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
        // Auto-fill if only one match
        inputField.value = matches[0];
        hideSuggestions();
    } else if (matches.length > 1) {
        // Show suggestions if multiple matches
        showSuggestions(input);
    } else {
        hideSuggestions();
    }
};

// Event Listener for Input
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
        e.preventDefault(); // Prevent default tab behavior
        autoCompleteCommand(inputField.value.trim());
    }
});

// Initialize Terminal
document.addEventListener("DOMContentLoaded", () => {
});
