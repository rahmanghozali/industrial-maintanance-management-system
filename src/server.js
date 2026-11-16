
const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());


// Helper: validate machine status
function isValidMachineStatus(status) {
    return ["RUNNING", "STOPPED", "MAINTENANCE"].includes(status);
}

// Helper: validate non-empty string
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

// ========================================
// GET ALL MACHINES
// ========================================
app.get("/api/machines", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                machine_id AS "machineId",
                machine_name AS "machineName",
                area,
                machine_status AS "machineStatus",
                technician,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM machines
            ORDER BY machine_id ASC
        `);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error fetching machines:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// ========================================
// GET MACHINE BY ID
// ========================================
app.get("/api/machines/:id", async (req, res) => {
    try {
        const machineId = req.params.id;

        const result = await pool.query(
            `
            SELECT
                machine_id AS "machineId",
                machine_name AS "machineName",
                area,
                machine_status AS "machineStatus",
                technician,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM machines
            WHERE machine_id = $1
            `,
            [machineId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Machine not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching machine:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});


// ========================================
// CREATE NEW MACHINE
// ========================================
app.post("/api/machines", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                message: "Request body must be a valid JSON object"
            });
        }
        
        const {
            machineId,
            machineName,
            area,
            machineStatus,
            technician
        } = req.body;

        // Validate required fields
        if (
            !isNonEmptyString(machineId) ||
            !isNonEmptyString(machineName) ||
            !isNonEmptyString(area) ||
            !isNonEmptyString(machineStatus) ||
            !isNonEmptyString(technician)) {
                return res.status(400).json({
                    message: "All machine fields are required and must be non-empty strings"
                });
            }

        // Validate machine status
        if (!isValidMachineStatus(machineStatus)) {
            return res.status(400).json({
                message: "Invalid machine status"
            });
        }
        
        // Insert machine into PostgreSQL
        const result = await pool.query(
            `
            INSERT INTO machines (
                machine_id,
                machine_name,
                area,
                machine_status,
                technician
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                machine_id AS "machineId",
                machine_name AS "machineName",
                area,
                machine_status AS "machineStatus",
                technician,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            `,
            [
                machineId,
                machineName,
                area,
                machineStatus,
                technician
            ]
        );

        res.status(201).json({
            message: "Machine created successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating machine:", error.message);

        // Handle duplicate primary key
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Machine ID already exists"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// ========================================
// UPDATE MACHINE
// ========================================
app.put("/api/machines/:id", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                message: "Request body must be a valid JSON object"
            });
        }
        
        const { machineName, area, machineStatus, technician } = req.body;
        const machineId = req.params.id;

        // Validate required fields
        if (
            !isNonEmptyString(machineName) || 
            !isNonEmptyString(area) ||
            !isNonEmptyString(machineStatus) ||
            !isNonEmptyString(technician)) {
                return res.status(400).json({
                    message: "All update fields are required and must be non-empty strings"
                });
            }

        // Validate machine status
        if (!isValidMachineStatus(machineStatus)) {
            return res.status(400).json({
                message: "Invalid machine status"
            });
        }

        // Update machine in PostgreSQL
        const result = await pool.query(
            `
            UPDATE machines
            SET
                machine_name = $1,
                area = $2,
                machine_status = $3,
                technician = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE machine_id = $5
            RETURNING
                machine_id AS "machineId",
                machine_name AS "machineName",
                area,
                machine_status AS "machineStatus",
                technician,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            `,
            [
                machineName,
                area,
                machineStatus,
                technician,
                machineId
            ]
        );

        // Check whether machine exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Machine not found"
            });
        }

        res.status(200).json({
            message: "Machine updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating machine:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// ========================================
// DELETE MACHINE
// ========================================
app.delete("/api/machines/:id", async (req, res) => {
    try {
        const machineId = req.params.id;

        const result = await pool.query(
            `
            DELETE FROM machines
            WHERE machine_id = $1
            RETURNING
                machine_id AS "machineId",
                machine_name AS "machineName",
                area,
                machine_status AS "machineStatus",
                technician,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            `,
            [machineId]
        );

        // Check whether machine exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Machine not found"
            });
        }

        res.status(200).json({
            message: "Machine deleted successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting machine:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
