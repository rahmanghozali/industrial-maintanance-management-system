
/*
// =================================
// MACHINE INFORMATION
// =================================

// Machine identification
const machineId = "WLD-KD2-001";
const machineName = "Spot Welding Machine";
const area = "KD2";

// Machine operation
let machineStatus = "RUNNING";
const technician = "Muhammad";

// Production information
const good = 1500;
const reject = 100;
const productionOutput = good + reject;
const rejectRate = (reject/productionOutput)*100

// Display machine information
console.log("================================");
console.log("MACHINE INFORMATION");
console.log("================================");

console.log(`Machine ID     : ${machineId}`);
console.log(`Machine Name   : ${machineName}`);
console.log(`Area           : ${area}`);
console.log(`Machine Status : ${machineStatus}`);
console.log(`Technician     : ${technician}`);

console.log("--------------------------------");
console.log("PRODUCTION INFORMATION");
console.log("--------------------------------");

console.log(`Good Output    : ${good}`);
console.log(`Reject Output  : ${reject}`);
console.log(`Total Output   : ${productionOutput}`);
console.log(`Reject Rate    : ${rejectRate}%`)
console.log("================================");
console.log("System Initialized Successfully!");
console.log("================================");


// ==================================
// INDUSTRIAL MAINTENANCE MANAGEMENT
// DAY 4 - CONDITIONS & LOGIC
// ==================================

// MACHINE INFORMATION

const machineId = "WLD-KD2-001";
const machineName = "Spot Welding Machine";
const area = "KD2";

let machineStatus = "RUNNING";
const technician = "Muhammad";

// PRODUCTION INFORMATION

const good = 1500;
const reject = 100;

const productionOutput = good + reject;
const rejectRate = (reject / productionOutput) * 100;

// DISPLAY MACHINE INFORMATION

console.log("================================");
console.log("MACHINE INFORMATION");
console.log("================================");

console.log(`Machine ID     : ${machineId}`);
console.log(`Machine Name   : ${machineName}`);
console.log(`Area           : ${area}`);
console.log(`Machine Status : ${machineStatus}`);
console.log(`Technician     : ${technician}`);

// DISPLAY PRODUCTION INFORMATION

console.log("--------------------------------");
console.log("PRODUCTION INFORMATION");
console.log("--------------------------------");

console.log(`Good Output    : ${good}`);
console.log(`Reject Output  : ${reject}`);
console.log(`Total Output   : ${productionOutput}`);
console.log(`Reject Rate    : ${rejectRate.toFixed(2)}%`);

// DAY 4 - MACHINE STATUS CHECK

console.log("--------------------------------");
console.log("MACHINE STATUS CHECK");
console.log("--------------------------------");

if (machineStatus === "RUNNING") {
    console.log("Machine is operating normally.");
} else {
    console.log("WARNING: Machine is not running!");
}

// DAY 4 - QUALITY CHECK

console.log("--------------------------------");
console.log("QUALITY CHECK");
console.log("--------------------------------");

if (rejectRate > 5) {
    console.log("WARNING: Reject rate is too high!");
} else {
    console.log("Reject rate is within the acceptable limit.");
}

// SYSTEM INITIALIZATION

console.log("================================");
console.log("System Initialized Successfully!");
console.log("================================");
*/


// ==================================
// INDUSTRIAL MAINTENANCE MANAGEMENT
// DAY 4 - CONDITIONS & LOGIC
// ==================================

// MACHINE INFORMATION

const machineId = "WLD-KD2-001";
const machineName = "Spot Welding Machine";
const area = "KD2";

let machineStatus = "STOPPED";
const technician = "Muhammad";

// PRODUCTION INFORMATION

const good = 1480;
const reject = 20;

const productionOutput = good + reject;
const rejectRate = (reject / productionOutput) * 100;

// DISPLAY MACHINE INFORMATION

console.log("================================");
console.log("MACHINE INFORMATION");
console.log("================================");

console.log(`Machine ID     : ${machineId}`);
console.log(`Machine Name   : ${machineName}`);
console.log(`Area           : ${area}`);
console.log(`Machine Status : ${machineStatus}`);
console.log(`Technician     : ${technician}`);

// DISPLAY PRODUCTION INFORMATION

console.log("--------------------------------");
console.log("PRODUCTION INFORMATION");
console.log("--------------------------------");

console.log(`Good Output    : ${good}`);
console.log(`Reject Output  : ${reject}`);
console.log(`Total Output   : ${productionOutput}`);
console.log(`Reject Rate    : ${rejectRate.toFixed(2)}%`);

// DAY 4 - MACHINE STATUS CHECK

console.log("--------------------------------");
console.log("MACHINE STATUS CHECK");
console.log("--------------------------------");

if (machineStatus === "RUNNING") {
    console.log("Machine is operating normally.");
} else {
    console.log("WARNING: Machine is not running!");
}

// DAY 4 - QUALITY CHECK

console.log("--------------------------------");
console.log("QUALITY CHECK");
console.log("--------------------------------");

if (rejectRate > 5) {
    console.log("WARNING: Reject rate is too high!");
} else {
    console.log("Reject rate is within the acceptable limit.");
}

// SYSTEM INITIALIZATION

console.log("================================");
console.log("System Initialized Successfully!");
console.log("================================");
