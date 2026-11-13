const express = require("express");

//create express application
const app = express();

//define server port
const PORT = 3000;

//first API get POINT
app.get("/", (req, res) => {
    res.send("Industrial Maintanance Management System API");
});

//Start Server
app.listen(PORT, () =>{
    console.log(`server is running on http://localhost:${PORT}`);
    const machines = [
    {
        machineId: "WLD-KD2-001",
        machineName: "Spot Welding Machine R",
        area: "KD2",
        machineStatus: "RUNNING",
        technician: "Mahmud"
    },
    {
        machineId: "WLD-KD2-002",
        machineName: "Spot Welding Machine L",
        area: "KD2",
        machineStatus: "RUNNING",
        technician: "Ahmad"
    },
    {
        machineId: "WLD-RF-001",
        machineName: "Rear Floor Welding Machine 1",
        area: "RF",
        machineStatus: "RUNNING",
        technician: "Hamid"
    },
    {
        machineId: "WLD-RF-002",
        machineName: "Rear Floor Welding Machine 2",
        area: "RF",
        machineStatus: "STOPPED",
        technician: "Hamdan"
    }
    ];
    app.get("/api/machines", (req,res) => {
        res.json(machines);
    });
});