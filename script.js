// DOM Elements
const inputField = document.getElementById("input");
const outputField = document.getElementById("output");
const body = document.body;

// Command History
const commandHistory = [];
let historyIndex = -1;

// Predefined Commands
const commands = {
    help: "Available commands: help, about, clear, echo [message], date, theme, addcommand",
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
    addcommand: (args) => {
        const [name, ...output] = args;
        if (!name || output.length === 0) {
            return "Usage: addcommand [name] [output]";
        }
        if (commands[name]) {
            return `Error: Command "${name}" already exists.`;
        }
        commands[name] = () => output.join(" ");
        return `Command "${name}" added successfully.`;
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

// Theme Persistence Functions
const setTheme = (theme) => {
    body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
    localStorage.setItem("theme", theme);
};

const applySavedTheme = () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
};

// Event Listener for Input
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const input = inputField.value;
        if (input.trim() !== "") {
            addOutput(`$ ${input}`);
            commandHistory.push(input);
            historyIndex = commandHistory.length;
            processCommand(input);
            inputField.value = "";
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
    }
});

// Initialize Terminal
document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
});
