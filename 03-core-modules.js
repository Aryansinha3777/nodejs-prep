// =======================================================
// 03. NODE CORE MODULES (DEEP + PRACTICAL + INTERVIEW)
// =======================================================

// Core modules are built into Node.
// No installation required.
// Example: fs, path, os, http, events, process, crypto


// =======================================================
// 1. FS MODULE (FILE SYSTEM)
// =======================================================

const fs = require("fs");

// ----------- READ FILE (ASYNC - Non-blocking) -----------

fs.readFile("test.txt", "utf-8", (err, data) => {
    if (err) {
        console.log("Error reading file:", err.message);
        return;
    }
    console.log("File content (Async):", data);
});

// ----------- READ FILE (SYNC - Blocking) -----------

// const dataSync = fs.readFileSync("test.txt", "utf-8");
// console.log("File content (Sync):", dataSync);

// Interview Question:
// ❓ Why should we avoid readFileSync in production?
// → Because it blocks the event loop.


// ----------- WRITE FILE -----------

fs.writeFile("output.txt", "Hello Node!", (err) => {
    if (err) {
        console.log("Error writing file");
        return;
    }
    console.log("File written successfully");
});


// ----------- APPEND FILE -----------

fs.appendFile("output.txt", "\nAppended line.", (err) => {
    if (err) {
        console.log("Error appending");
        return;
    }
    console.log("Content appended");
});


// =======================================================
// 2. PATH MODULE
// =======================================================

const path = require("path");

const filePath = "/users/admin/project/test.txt";

console.log("File name:", path.basename(filePath));  // test.txt
console.log("Directory:", path.dirname(filePath));   // /users/admin/project
console.log("Extension:", path.extname(filePath));   // .txt

// Join paths safely (important in backend)
const joinedPath = path.join(__dirname, "files", "data.txt");
console.log("Joined path:", joinedPath);

// Interview:
// ❓ Why use path.join instead of string concatenation?
// → Because it handles OS-specific separators correctly.


// =======================================================
// 3. OS MODULE
// =======================================================

const os = require("os");

console.log("OS Platform:", os.platform());
console.log("CPU Architecture:", os.arch());
console.log("Free Memory:", os.freemem());
console.log("Total Memory:", os.totalmem());
console.log("Home Directory:", os.homedir());

// Interview:
// ❓ Why is os module useful?
// → For monitoring server environment in production.


// =======================================================
// 4. EVENTS MODULE
// =======================================================

const EventEmitter = require("events");

const emitter = new EventEmitter();

// Create event listener
emitter.on("greet", (name) => {
    console.log(`Hello ${name}`);
});

// Emit event
emitter.emit("greet", "Aryan");

// Output:
// Hello Aryan

// Interview:
// ❓ What is event-driven architecture?
// → Code reacts to events instead of sequential flow.

// Node internally uses EventEmitter heavily.


// =======================================================
// 5. HTTP MODULE (VERY IMPORTANT)
// =======================================================

const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from Node HTTP server!");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

// Go to browser:
// http://localhost:3000

// Interview:
// ❓ What does http.createServer return?
// → An instance of http.Server.

// ❓ What are req and res?
// → Request object and Response object.


// =======================================================
// 6. PROCESS OBJECT
// =======================================================

console.log("Process ID:", process.pid);
console.log("Node Version:", process.version);
console.log("Platform:", process.platform);

// Access command line arguments
console.log("Arguments:", process.argv);

// Example:
// node 03-core-modules.js hello
// process.argv → ["node", "filePath", "hello"]


// Exit process manually
// process.exit();


// =======================================================
// 7. CRYPTO MODULE (Basic Awareness)
// =======================================================

const crypto = require("crypto");

const hash = crypto
    .createHash("sha256")
    .update("password123")
    .digest("hex");

console.log("SHA256 Hash:", hash);

// Used in:
// - Password hashing
// - Tokens
// - Security systems


// =======================================================
// IMPORTANT INTERVIEW SUMMARY
// =======================================================

// fs → File handling
// path → Safe path manipulation
// os → Server environment info
// events → Event-driven architecture
// http → Backend server foundation
// process → Runtime info
// crypto → Security & hashing


