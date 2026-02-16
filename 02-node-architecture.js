// =====================================================
// 10. NODE.JS ARCHITECTURE (DEEP DIVE)
// =====================================================

// Node.js architecture consists of:

// 1. V8 Engine
// 2. Call Stack
// 3. Node APIs
// 4. libuv
// 5. Thread Pool
// 6. Event Loop
// 7. Callback Queue


// =====================================================
// 1. V8 ENGINE
// =====================================================

// V8 is the JavaScript engine used by Google Chrome.
// Node uses the same engine.

// What V8 does:
// - Converts JavaScript into machine code
// - Executes it very fast

// V8 ONLY executes synchronous JavaScript.
// It does NOT handle async by itself.


// =====================================================
// 2. CALL STACK
// =====================================================

// Call stack executes functions in LIFO order.

// Example:

function first() {
    console.log("First");
}

function second() {
    console.log("Second");
}

first();
second();

// Stack flow:
// Global → first → pop → second → pop


// =====================================================
// 3. NODE APIs (C++ Bindings)
// =====================================================

// Functions like:
// - setTimeout
// - fs.readFile
// - HTTP requests
// are NOT part of JavaScript.

// They are provided by Node via C++ bindings.


// =====================================================
// 4. LIBUV (VERY IMPORTANT)
// =====================================================

// libuv is a C library used by Node.

// It handles:
// - File system
// - Network
// - Timers
// - Event loop
// - Thread pool

// libuv makes Node non-blocking.


// =====================================================
// 5. THREAD POOL
// =====================================================

// Node has a thread pool (default size = 4)

// Used for:
// - File system operations
// - Crypto
// - DNS
// - Some compression tasks

// IMPORTANT:
// JavaScript is single-threaded.
// But heavy tasks run in background threads.


// =====================================================
// 6. EVENT LOOP (HEART OF NODE)
// =====================================================

// Event loop constantly checks:

// 1. Is call stack empty?
// 2. Is there anything in callback queue?

// If YES:
// → Move callback to call stack
// → Execute it

// This is how Node handles thousands of users.


// =====================================================
// 7. COMPLETE FLOW EXAMPLE
// =====================================================

const fs = require("fs");

console.log("Start");

fs.readFile("test.txt", "utf-8", (err, data) => {
    console.log("File read done");
});

setTimeout(() => {
    console.log("Timer done");
}, 0);

console.log("End");


// =====================================================
// THINK CAREFULLY:
// What will be output order?
// =====================================================


// Correct Output:

// Start
// End
// Timer done
// File read done


// WHY?

// 1. Start → sync → executes
// 2. readFile → goes to libuv thread pool
// 3. setTimeout → goes to timer phase
// 4. End → sync → executes
// 5. Event loop starts checking phases
// 6. Timer (0ms) executes first
// 7. File callback executes when I/O phase runs


// =====================================================
// IMPORTANT: EVENT LOOP PHASES
// =====================================================

// Node event loop has phases:

// 1. Timers (setTimeout, setInterval)
// 2. Pending Callbacks
// 3. Idle/Prepare
// 4. Poll (I/O callbacks)
// 5. Check (setImmediate)
// 6. Close callbacks

// Most interviews focus on:
// - Timers phase
// - Poll phase
// - Check phase


// =====================================================
// INTERVIEW TRAPS
// =====================================================

// ❓ Why does setTimeout(fn, 0) not run immediately?

// Because it goes to timers phase.
// It waits for call stack to become empty.

// ❓ What is event loop?

// Event loop is a mechanism that continuously
// checks the call stack and callback queue
// to execute asynchronous code.


// =====================================================
// ADVANCED INTERVIEW QUESTION
// =====================================================

// ❓ Difference between setTimeout and setImmediate?

// setTimeout → runs in Timers phase
// setImmediate → runs in Check phase

