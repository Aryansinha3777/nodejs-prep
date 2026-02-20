=======================================================
🔥 SECTION 1 — STREAMS (Production Level)
=======================================================
🧠 What is a Stream?

A stream is a way to handle data piece by piece (chunks) instead of loading everything into memory.

❌ Without Streams
readFile → loads entire file into memory
✅ With Streams
readStream → reads file chunk by chunk

Used for:

Large file downloads

Video streaming

File uploads

Real production APIs

📌 Types of Streams
Type	Purpose
Readable	Read data
Writable	Write data
Duplex	Read + Write
Transform	Modify data while passing
1️⃣ Readable Stream Example
const fs = require("fs");

const readStream = fs.createReadStream("large.txt", "utf-8");

readStream.on("data", (chunk) => {
    console.log("Chunk received:");
    console.log(chunk);
});

readStream.on("end", () => {
    console.log("File reading completed.");
});
🧠 What Happens?

File is read in chunks (default ~64KB)

Each chunk triggers "data" event

When finished → "end" event fires

2️⃣ Writable Stream Example
const writeStream = fs.createWriteStream("output.txt");

writeStream.write("Hello\n");
writeStream.write("Streams are powerful\n");
writeStream.end();
3️⃣ Using pipe() (Most Important 🔥)
const fs = require("fs");

const readStream = fs.createReadStream("large.txt");
const writeStream = fs.createWriteStream("copy.txt");

readStream.pipe(writeStream);
🧠 What pipe() Does

Automatically:

Reads chunk

Writes chunk

Handles backpressure

Closes when done

Production systems use this heavily.

4️⃣ Backpressure (Interview Topic)

If writable stream is slow:

Readable pauses automatically.

This prevents memory overload.

That’s why streams are efficient.

🎯 Interview Question

Q: Why use streams instead of readFile?

Answer:

Streams process data in chunks and prevent loading large files fully into memory, improving performance and scalability.

=======================================================
🔥 SECTION 2 — EVENT LOOP DEEP DIVE
=======================================================
🧠 Node is Single Threaded

It has:

1 Call Stack

1 Event Loop

Non-blocking I/O

🧠 Event Loop Phases (Simplified)

Timers (setTimeout)

I/O callbacks

Idle

Poll

Check (setImmediate)

Close callbacks

🔥 Execution Order Example
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("End");
✅ Output:
Start
End
Promise
Timeout
🧠 Why?

Because:

Sync runs first

Microtasks (Promises)

Macrotasks (setTimeout)

Priority:

Call Stack
→ Microtask Queue
→ Macrotask Queue
🔥 process.nextTick vs Promise
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
Output:
nextTick
promise

nextTick has higher priority.

🎯 Interview Question

Q: Why does Promise execute before setTimeout?

Answer:

Because Promises go into the Microtask Queue which is processed before the Macrotask Queue.

=======================================================
🔥 SECTION 3 — HTTP MODULE ADVANCED
=======================================================

Now we build real backend logic without Express.

1️⃣ Basic Routing Manually
const http = require("http");

const server = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Home Route");
    }

    else if (req.url === "/about" && req.method === "GET") {
        res.writeHead(200);
        res.end("About Page");
    }

    else {
        res.writeHead(404);
        res.end("Route Not Found");
    }

});

server.listen(3000);
2️⃣ Handling POST Request (JSON Parsing)
const server = http.createServer((req, res) => {

    if (req.url === "/data" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const parsedData = JSON.parse(body);
            console.log(parsedData);

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Data received" }));
        });
    }
});
🧠 What’s Happening?

req is a readable stream

We collect chunks

On "end" → parse JSON

Express does this internally.

3️⃣ Simple In-Memory CRUD API
let users = [];

const server = http.createServer((req, res) => {

    if (req.url === "/users" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
    }

    else if (req.url === "/users" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            const user = JSON.parse(body);
            users.push(user);

            res.writeHead(201);
            res.end("User added");
        });
    }

});
