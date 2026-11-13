
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Temporary machine data
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

// Helper: validate machine status
function isValidMachineStatus(status) {
    return ["RUNNING", "STOPPED", "MAINTENANCE"].includes(status);
}

// ========================================
// GET ALL MACHINES
// ========================================

app.get("/api/machines", (req, res) => {
    res.status(200).json(machines);
});

// ========================================
// GET MACHINE BY ID
// ========================================

app.get("/api/machines/:id", (req, res) => {
    const machine = machines.find(
        item => item.machineId === req.params.id
    );

    if (!machine) {
        return res.status(404).json({
            message: "Machine not found"
        });
    }

    res.status(200).json(machine);
});

// ========================================
// CREATE NEW MACHINE
// ========================================

app.post("/api/machines", (req, res) => {
    const { machineId, machineName, area, machineStatus, technician } = req.body;

    if (!machineId || !machineName || !area || !machineStatus || !technician) {
        return res.status(400).json({
            message: "All machine fields are required"
        });
    }

    if (!isValidMachineStatus(machineStatus)) {
        return res.status(400).json({
            message: "Invalid machine status"
        });
    }

    const existingMachine = machines.find(
        item => item.machineId === machineId
    );

    if (existingMachine) {
        return res.status(409).json({
            message: "Machine ID already exists"
        });
    }

    const newMachine = {
        machineId,
        machineName,
        area,
        machineStatus,
        technician
    };

    machines.push(newMachine);

    res.status(201).json({
        message: "Machine created successfully",
        data: newMachine
    });
});

// ========================================
// UPDATE MACHINE
// ========================================

app.put("/api/machines/:id", (req, res) => {
    const machine = machines.find(
        item => item.machineId === req.params.id
    );

    if (!machine) {
        return res.status(404).json({
            message: "Machine not found"
        });
    }

    const { machineName, area, machineStatus, technician } = req.body;

    if (!machineName || !area || !machineStatus || !technician) {
        return res.status(400).json({
            message: "All update fields are required"
        });
    }

    if (!isValidMachineStatus(machineStatus)) {
        return res.status(400).json({
            message: "Invalid machine status"
        });
    }

    machine.machineName = machineName;
    machine.area = area;
    machine.machineStatus = machineStatus;
    machine.technician = technician;

    res.status(200).json({
        message: "Machine updated successfully",
        data: machine
    });
});

// ========================================
// DELETE MACHINE
// ========================================

app.delete("/api/machines/:id", (req, res) => {
    const machineIndex = machines.findIndex(
        item => item.machineId === req.params.id
    );

    if (machineIndex === -1) {
        return res.status(404).json({
            message: "Machine not found"
        });
    }

    const deletedMachine = machines.splice(machineIndex, 1)[0];

    res.status(200).json({
        message: "Machine deleted successfully",
        data: deletedMachine
    });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
