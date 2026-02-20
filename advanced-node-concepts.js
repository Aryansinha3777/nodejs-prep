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

Type	    Purpose
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

//imp
🔥 1️⃣ Why does the browser send the HTTP request and not the user?

Because:
👉 The user cannot speak HTTP.
👉 The browser can.

When you type in the address bar:

http://localhost:3000/about

You are giving an instruction to the browser.
Then the browser automatically:
Creates an HTTP request
Sends it to the server
Waits for response
Renders the response

So:
User → Browser → Server
Server → Browser → User

The browser is just a tool that translates your action into an HTTP request.

🔥 2️⃣ What Exactly Happens When You Enter a URL?

When you press Enter:
http://localhost:3000/about

The browser creates something like this internally:
GET /about HTTP/1.1
Host: localhost:3000
User-Agent: Chrome

That is the HTTP request.
The server receives this request.

🔥 3️⃣ Why Moving to /about Invokes That Condition?

Look at your condition:

if (req.url === "/about" && req.method === "GET")

When you enter:

http://localhost:3000/about

The browser sends:

Method → GET (default for browser URL entry)

URL → /about

So inside Node:

req.url = "/about"
req.method = "GET"

Condition becomes:

if ("/about" === "/about" && "GET" === "GET")

Which is TRUE ✅

So that block runs.

🔥 4️⃣ You Said: “I thought client will send request then server responds”

You are absolutely correct.

But understand this:

👉 The browser is the client.

Client does NOT mean human.

Client means:

Any software that sends a request.

Examples of clients:

Browser

Postman

Mobile app

React frontend

Curl command

So:

Browser = Client
🔥 5️⃣ What Happens When You Click a Link?

If you click:

<a href="/about">About</a>

Browser again:

Creates GET request to /about

Sends it

Server checks route

Server responds

Same flow.

🔥 6️⃣ What If You Use POST?

If you use a form:

<form method="POST" action="/about">

Then browser sends:

POST /about

Now this condition:

req.method === "GET"

Would FAIL ❌

So your GET block won’t execute.

🔥 7️⃣ Visual Full Flow
User types URL
        ↓
Browser creates HTTP request
        ↓
Node server receives request
        ↓
createServer callback runs
        ↓
req.url & req.method checked
        ↓
Matching block executes
        ↓
Response sent
        ↓
Browser renders response

🔥 8️⃣ Important Realization

Every time you:

Refresh page
Click link
Submit form
Call API
Open image
Load CSS

The browser sends HTTP requests automatically.

You don’t see them, but they happen.

🧠 Final Mental Model

You never "move to about page".
You always:
Send a new HTTP request to /about
Web is stateless.
Each page load = new request.
//imp
    
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
//imp
🔥 First: What Is a POST Request?
When a client (browser, Postman, React app) sends data to the server:
POST /data
It sends:
Headers
Body (the actual data)

Example body:
{
  "name": "Aryan",
  "age": 22
}
🔥 Now Let’s Break the Code
const server = http.createServer((req, res) => {

Every request hits this function.

🟢 Step 1 — Route Check
if (req.url === "/data" && req.method === "POST")

We only run this logic if:
URL = /data
Method = POST

🟢 Step 2 — Create Empty Body
let body = "";

Why?
Because:
👉 Incoming request data comes in chunks
👉 Node request object is a stream

Important:
req is a Readable Stream
That means data doesn’t arrive all at once.

🟢 Step 3 — Collect Incoming Data
req.on("data", (chunk) => {
    body += chunk;
});

Every time a chunk arrives:
"data" event fires
We append chunk to body
If client sends:
{"name":"Aryan","age":22}

It might arrive like:

chunk1 → {"name":"Ary
chunk2 → an","age":22}

We combine them into:

{"name":"Aryan","age":22}
🟢 Step 4 — When All Data Is Received
req.on("end", () => {

The "end" event fires when:

👉 All chunks are received
👉 Request body is fully complete

Now body contains full JSON string.

🟢 Step 5 — Parse JSON
const parsedData = JSON.parse(body);

Why parse?
Because:
body is a STRING
We want a JavaScript object

Example:
body = '{"name":"Aryan","age":22}'

After parsing:
parsedData = {
  name: "Aryan",
  age: 22
}

Now we can access:
parsedData.name
🔥 Why JSON.stringify()?
res.end(JSON.stringify({ message: "Data received" }));

Very important question.
Because:
res.end() only sends:
String
Buffer
It CANNOT send a JavaScript object directly.

If you try:
res.end({ message: "Data received" });
You’ll get:
TypeError: First argument must be a string or Buffer

So we convert object → JSON string.

🧠 Flow Summary
Client sends JSON
        ↓
Node receives chunks (stream)
        ↓
We collect chunks
        ↓
We parse string → JS object
        ↓
We process data
        ↓
We send response as JSON string
🔥 What Express Does Internally

In Express you write:

app.post("/data", (req, res) => {
    console.log(req.body);
    res.json({ message: "Data received" });
});

Express internally:
Collects chunks
Parses JSON
Attaches it to req.body
Uses JSON.stringify for you
So you don’t see this low-level logic.

🔥 Very Important Concept
Request body = Stream
Response body = Must be String or Buffer

That’s why:
JSON.parse()   → String → Object
JSON.stringify() → Object → String

Think:
Incoming → parse
Outgoing → stringify
🎯 Interview Question

Q: Why do we manually collect request body in Node http module?
Answer:
Because req is a readable stream and data arrives in chunks, so we must assemble it before parsing.

🧠 Deep Understanding Check

If you send invalid JSON:
{ name: Aryan }
Then:
JSON.parse(body)
Will throw error.

In production you must use:
try {
   JSON.parse(body)
} catch (err) {
   // send 400 error
}
🚀 Final Mental Model

Without Express:
You manually:
Handle routing
Handle streams
Parse JSON
Set headers
Send response

With Express:
It abstracts all of this.
//imp
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

🔥 What Is This Code?
This is a simple in-memory CRUD API using only Node’s http module.
⚠ Important:
Data is stored in memory (RAM), not database.
🟢 Step 1 — In-Memory Storage
let users = [];
This array acts like a fake database.

Example:
After some POST requests:
users = [
  { name: "Aryan", age: 22 },
  { name: "Rahul", age: 25 }
];

⚠ If you restart server → data disappears.
That’s why it’s called in-memory.
