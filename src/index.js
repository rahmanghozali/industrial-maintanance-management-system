
/*
==========================================
INDUSTRIAL MAINTENANCE MANAGEMENT SYSTEM
DAY 6 - ARRAYS & OBJECTS
==========================================
*/

// MACHINE DATABASE (TEMPORARY)

const machines = [
    {
        machineId : "WLD-KD2-001",
        machineName : "Spot Welding Machine R",
        area : "KD2",
        machineStatus : "RUNNING",
        technician : "Mahmud"
    },
    {
        machineId : "WLD-KD2-002",
        machineName : "Spot Welding Machine L",
        area : "KD2",
        machineStatus : "STOPPED",
        technician : "Ahmad"
    },
    {
        machineId : "WLD-RF-001",
        machineName : "Rear Floor Welding Machine1",
        area : "RF",
        machineStatus : "RUNNING",
        technician : "Hamid"
    }
];

machines.push({
    machineId : "WLD-RF-002",
    machineName : "Rear Floor Welding Machine 2",
    area : "RF",
    machineStatus : "STOPPED",
    technician : "Hamdan"
});

machines[1].machineStatus = "RUNNING";

// FUNCTION: DISPLAY ONE MACHINE

function displayMachine(machine) {
    console.log(`Machine ID     : ${machine.machineId}`);
    console.log(`Machine Name   : ${machine.machineName}`);
    console.log(`Area           : ${machine.area}`);
    console.log(`Machine Status : ${machine.machineStatus}`);
    console.log(`Technician     : ${machine.technician}`);
}

// DISPLAY ALL MACHINES

console.log("================================");
console.log("MACHINE DATABASE");
console.log("================================");

for(const machine of machines){
    displayMachine(machine);
    console.log("-----------------------------------")
}


// COUNT MACHINES

console.log("MACHINE SUMMARY");
console.log("================================");

console.log(`Total Machines : ${machines.length}`);

// COUNT RUNNING AND STOPPED MACHINES
let runningMachine = 0;
let stoppedMachine = 0;

for(const machine of machines){
    if(machine.machineStatus === "RUNNING"){
        runningMachine++;
    } else if(machine.machineStatus === "STOPPED"){
        stoppedMachine++;
    }
};

console.log(`RUNNING    : ${runningMachine}`);
console.log(`STOPPED    : ${stoppedMachine}`);

//STOPPED Machines LIST
const stoppedMachines = machines.filter(function(machine){
    return machine.machineStatus === "STOPPED";
});
console.log(stoppedMachines);

//RUNNING Machines List
const runningMachinesList = machines.filter(function(machine){
    return machine.machineStatus === "RUNNING";
});
for(const machine of runningMachinesList){
    console.log(`${machine.machineId} - ${machine.machineName}`);
}

console.log(`Total RUnning Machines : ${runningMachinesList.length}`);


console.log("================================");
console.log("System Initialized Successfully!");
console.log("================================");
