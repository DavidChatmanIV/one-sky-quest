const { exec } = require("child_process");

const scripts = [
"node seed-bookings.js",
"node seed-flights.js",
"node seed-hotel.js",
"node seed-packages.js",
"node seed-cars.js",
"node seed-cruise.js",
];

async function runSeeds() {
for (let cmd of scripts) {
    console.log(`\nRunning: ${cmd}`);
    await new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
        if (err) return reject(err);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        resolve();
    });
    });
}

console.log("\n🌱 All seeds completed!");
}

runSeeds().catch((err) => {
console.error("❌ Seeding failed:", err);
});