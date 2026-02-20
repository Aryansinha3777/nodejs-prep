=======================================================
ASYNC PATTERNS IN NODE.JS
=======================================================
1️⃣ Why Async Exists in Node

Node is:

Single-threaded (JS execution)

Non-blocking

Event-driven

If async didn’t exist:

Every request would block the server

Performance would collapse

Async allows:

One thread

Thousands of concurrent requests

=======================================================
2️⃣ CALLBACKS (Foundation of Node)
=======================================================
📌 Basic Example
console.log("Start");

setTimeout(() => {
    console.log("Inside setTimeout");
}, 1000);

console.log("End");
✅ Output:
Start
End
Inside setTimeout
🔎 Why?

"Start" → synchronous

setTimeout registered → goes to Timer phase

"End" → synchronous

After 1s → callback pushed to call stack

Prints last

📌 Real Callback Example (Error First Pattern)
function fetchData(callback) {
    setTimeout(() => {
        const success = true;

        if (!success) {
            return callback(new Error("Something went wrong"), null); // return bcoz without it both calls will run(niche wala)
        }

        callback(null, "Data received");
    }, 1000);
}

fetchData((err, data) => {
    if (err) {
        console.log("Error:", err.message);
        return;
    }

    console.log("Success:", data);
});
🧠 Important Pattern
Node uses:
callback(error, result)
This is called Error-First Callback Pattern


🚨 Callback Hell Problem
setTimeout(() => {
    console.log("Step 1");

    setTimeout(() => {
        console.log("Step 2");

        setTimeout(() => {
            console.log("Step 3");
        }, 1000);

    }, 1000);

}, 1000);

This is:
Hard to read
Hard to debug
Hard to scale

Solution? → Promises.

What is Zalgo problem?
A function that sometimes executes callback synchronously and sometimes asynchronously.
    
=======================================================
3️⃣ PROMISES
=======================================================

A Promise represents:
A value that will exist in the future.

States:
pending
fulfilled
rejected

📌 Creating a Promise
const myPromise = new Promise((resolve, reject) => {
    const success = true;

    if (success) {
        resolve("Operation successful");
    } else {
        reject("Operation failed");
    }
});
    
📌 Consuming a Promise
myPromise
    .then((data) => {
        console.log("Success:", data);
    })
    .catch((err) => {
        console.log("Error:", err);
    });
✅ Output:
Success: Operation successful


🧠 Very Deep Backend Question For You
Which is faster?
await wait(1000);
await wait(1000);
OR
await Promise.all([wait(1000), wait(1000)]);
Explain why.

🧪 Case 1 — Sequential Execution
await wait(1000);
await wait(1000);
What happens?
1️⃣ First wait(1000) runs
→ waits 1 second
→ completes
2️⃣ Second wait(1000) runs
→ waits 1 second
→ completes
⏱ Total Time:
1s + 1s = 2 seconds
Because the second one does NOT start until the first finishes.
This is sequential execution
🧪 Case 2 — Parallel Execution
await Promise.all([
    wait(1000),
    wait(1000)
]);
What happens?
Both wait(1000) start immediately.
Timer 1 starts
Timer 2 starts
Both run concurrently (non-blocking)
After 1 second → both complete.
⏱ Total Time:
~1 second
Because they ran in parallel.


//imp
🧠 Why This Matters in Real Backend

Imagine:
Fetch user from DB → 200ms
Fetch orders → 300ms
Fetch notifications → 150ms
If you do this:
await getUser();
await getOrders();
await getNotifications();
Total time:
200 + 300 + 150 = 650ms
But if independent:
await Promise.all([
    getUser(),
    getOrders(),
    getNotifications()
]);
Total time:
~300ms (longest one)
Huge performance improvement.

//imp
🧠 Very Deep Concept (Important)

Even though JS is single-threaded:
Promise.all still runs in parallel because:
I/O is handled by OS/libuv
Event loop manages completion
JS thread is not doing the waiting.
    
=======================================================
4️⃣ PROMISE VS setTimeout ORDER (VERY IMPORTANT)
=======================================================
console.log("Start");

setTimeout(() => {
    console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("End");
🧠 What prints first?
✅ Output:
Start
End
Promise
setTimeout
🔥 Why?

Because:

Promise → Microtask Queue

setTimeout → Macrotask Queue (Timer phase)

Event loop priority:

Run sync code

Run ALL microtasks

Then run macrotasks

This is VERY important for interviews.

=======================================================
5️⃣ ASYNC / AWAIT (Cleaner Syntax Over Promises)
=======================================================
📌 Example
function fetchData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Data loaded");
        }, 1000);
    });
}

async function getData() {
    console.log("Fetching...");
    const data = await fetchData();
    console.log("Result:", data);
}

getData();
✅ Output:
Fetching...
Result: Data loaded
🧠 What await Actually Does

It:

Pauses the async function

Does NOT block the event loop

Returns control to Node

Resumes when promise resolves

This is extremely important.

=======================================================
6️⃣ ERROR HANDLING IN ASYNC/AWAIT
=======================================================
async function test() {
    try {
        throw new Error("Something broke");
    } catch (err) {
        console.log("Caught:", err.message);
    }
}

test();
✅ Output:
Caught: Something broke
=======================================================
7️⃣ Promise.all (Parallel Execution)
=======================================================
const p1 = new Promise(resolve => setTimeout(() => resolve("A"), 1000));
const p2 = new Promise(resolve => setTimeout(() => resolve("B"), 2000));

async function run() {
    const results = await Promise.all([p1, p2]);
    console.log(results);
}

run();
✅ Output (after 2 seconds total):
[ 'A', 'B' ]

Important:

Runs in parallel

Fails fast (if one fails → entire thing rejects)

=======================================================
8️⃣ Promise.allSettled
=======================================================
const p1 = Promise.resolve("Success");
const p2 = Promise.reject("Failed");

Promise.allSettled([p1, p2]).then(results => {
    console.log(results);
});
✅ Output:
[
  { status: 'fulfilled', value: 'Success' },
  { status: 'rejected', reason: 'Failed' }
]

Used in production when:

You want all results even if some fail.

=======================================================
9️⃣ Converting Callback API to Promise (VERY IMPORTANT)
=======================================================

Node provides:

const fs = require("fs");
const { promisify } = require("util");

const readFilePromise = promisify(fs.readFile);

async function read() {
    const data = await readFilePromise("test.txt", "utf-8");
    console.log(data);
}

read();

This is common in real backend systems.

=======================================================
🔥 10️⃣ Common Async Mistake
=======================================================
async function test() {
    setTimeout(() => {
        return "Hello";
    }, 1000);
}

console.log(test());
✅ Output:
Promise { <pending> }

Why?

Because async functions ALWAYS return a Promise.

=======================================================
🧠 Production-Level Understanding
=======================================================

When 1000 users hit your server:

Each request handler is async

Node doesn’t create 1000 threads

It offloads I/O to OS

When data is ready → callback/promise resumes

This is why Node scales.

=======================================================
🎯 INTERVIEW QUESTIONS
=======================================================
Q1: Difference between callback and promise?

→ Promise avoids callback hell and improves error handling.

Q2: Difference between Promise and async/await?

→ async/await is syntactic sugar over promises.

Q3: Why Promise runs before setTimeout?

→ Microtask queue priority.

Q4: What happens if you forget await?

→ You get a pending Promise.

Q5: Does async/await block event loop?

→ No.

Q6: Difference between Promise.all and Promise.allSettled?

→ all fails fast, allSettled returns all results.
