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

If interviewer asks:

How does async fs.readFile work internally?

Answer:

fs.readFile delegates file reading to libuv’s thread pool. The callback is stored in the task object. Once the file reading completes, libuv pushes the callback to the event loop’s I/O queue. When the call stack is empty, the event loop executes the callback with error and data arguments.
That answer = advanced Node understanding.


Why should we avoid fs.readFileSync in production?

Strong answer:
Because Node.js runs JavaScript on a single thread. Using synchronous file operations blocks the event loop, preventing other incoming requests from being processed. This severely impacts scalability and performance under high load.
That is backend-level thinking.


Let’s understand the real reason Node provides readFileSync.

🔥 Why Does Node Provide readFileSync?
1️⃣ For Startup Configuration (Very Common)

When your server starts:
const config = fs.readFileSync("config.json", "utf-8");

At startup:
No users are connected yet
Blocking doesn’t hurt
It’s simple and safe
    
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


If I write:
path.join("/users", "../admin", "file.txt")
What will be the final path?

Step 1:

Start with:
/users
Step 2:
Add:
../admin
.. means:
Go one directory UP.
So:
/users
Go up one level → /
Then enter admin
So now we are at:
/admin
Step 3:
Add:
file.txt
Final result:
/admin/file.txt

//important
Given:
path.resolve("users", "/admin", "data.txt");

🔥 How resolve() Works

resolve() processes from right → left
and stops when it finds an absolute path.

Step 1: Start from right
"data.txt"
Step 2: Move left
"/admin"
This is an absolute path (starts with /).
💥 As soon as resolve() sees an absolute path,
it ignores everything before it.
So "users" is completely ignored.
Step 3: Combine
/admin + data.txt
Final result:
/admin/data.txt

🔥 Compare With join()
If you used:
path.join("users", "/admin", "data.txt");
Output would be:
users/admin/data.txt
Because join() does NOT discard previous segments.
    
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

EventEmitter is a class that allows:
Creating custom events
Attaching listeners
Triggering events

//important
const EventEmitter = require("events");
The events module exports a class called EventEmitter.You are importing that class.
In essence, this line makes the EventEmitter class available for use in your code, so you can create instances that can emit() named events and have functions on() (or addListener()) that listen for those events and execute a callback function when they occur. 

const emitter = new EventEmitter();
Now emitter is an object that can:
Register events
Emit events
Remove events
Think of it as an event manager.

    
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

🔹 2️⃣ http.createServer()
const server = http.createServer((req, res) => { ... });
This creates an HTTP server.
It takes a callback function.
That callback runs:
👉 Every time a client makes a request.
    
🔥 That Callback Is Actually an Event Listener
Internally, this is similar to:
server.on("request", callback);
Because HTTP server is built on EventEmitter.
When a request comes:
It emits "request" event.
That’s why the callback receives:
(req, res)


🧠 Internal Flow When You Open Browser

Browser sends HTTP request
OS receives request
Node’s event loop detects socket readiness
HTTP server emits "request" event
Your callback runs
Response is sent
No new thread per request.
Event-driven.

🔥 What Actually Happens When 5 Users Hit Server
const server = http.createServer((req, res) => {
    res.end("Hello");
});


Important:

👉 Only ONE server object is created.
👉 Only ONE JavaScript thread exists.
👉 No new thread per request.

🧠 Step-by-Step Internals

When 5 users hit at the same time:
OS receives 5 TCP connections.
OS keeps track of all sockets.
Node registers these sockets in the event loop.
When any socket has data ready:
Event loop picks it
Executes your callback
Sends response
Moves to next ready socket

🎯 Backend Interview-Level Answer
If asked:
How does Node handle multiple HTTP requests?
You answer:
Node uses an event-driven, non-blocking architecture. The OS manages socket connections, and Node’s event loop processes request callbacks sequentially but very quickly, giving the illusion of concurrency without creating multiple threads.
That answer = strong backend understanding.
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


| Operation Type     | Handled By        |
| ------------------ | ----------------- |
| HTTP / Network I/O | OS async I/O      |
| File system        | libuv thread pool |
| Crypto / CPU-heavy | libuv thread pool |
| JS execution       | Main thread       |

