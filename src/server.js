
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
// CREATE WORK ORDER
// ========================================
app.post("/api/work-orders", async (req, res) => {
    const {
        workOrderCode,
        machineId,
        title,
        description,
        priority,
        technicianIds
    } = req.body || {};

    // Validate required fields
    if (
        !isNonEmptyString(workOrderCode) ||
        !isNonEmptyString(machineId) ||
        !isNonEmptyString(title)
    ) {
        return res.status(400).json({
            message: "Work order code, machine ID, and title are required"
        });
    }

    // Validate technician assignments
    if (
        !Array.isArray(technicianIds) ||
        technicianIds.length < 1 ||
        technicianIds.length > 2 ||
        !technicianIds.every(
            id => Number.isInteger(id) && id > 0
        ) ||
        new Set(technicianIds).size !== technicianIds.length
    ) {
        return res.status(400).json({
            message: "A work order must have 1 or 2 unique technician IDs"
        });
    }

    // Validate priority
    const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const selectedPriority = priority || "MEDIUM";

    if (!validPriorities.includes(selectedPriority)) {
        return res.status(400).json({
            message: "Invalid work order priority"
        });
    }

    // Validate optional description
    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
    ) {
        return res.status(400).json({
            message: "Description must be a string"
        });
    }

    let client;
    let transactionStarted = false;

    try {
        client = await pool.connect();

        // Start transaction
        await client.query("BEGIN");
        transactionStarted = true;

        // Check whether machine exists
        const machineResult = await client.query(
            `
            SELECT machine_id
            FROM machines
            WHERE machine_id = $1
            FOR KEY SHARE
            `,
            [machineId.trim()]
        );

        if (machineResult.rows.length === 0) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(404).json({
                message: "Machine not found"
            });
        }

        // Check whether all technicians exist and are active
        const technicianResult = await client.query(
            `
            SELECT technician_id
            FROM technicians
            WHERE technician_id = ANY($1::bigint[])
              AND is_active = TRUE
            FOR SHARE
            `,
            [technicianIds]
        );

        if (technicianResult.rows.length !== technicianIds.length) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(400).json({
                message: "One or more technicians do not exist or are inactive"
            });
        }

        // Insert work order
        const workOrderResult = await client.query(
            `
            INSERT INTO work_orders (
                work_order_code,
                machine_id,
                title,
                description,
                priority,
                status
            )
            VALUES ($1, $2, $3, $4, $5, 'OPEN')
            RETURNING
                work_order_id AS "workOrderId",
                work_order_code AS "workOrderCode",
                machine_id AS "machineId",
                title,
                description,
                priority,
                status,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            `,
            [
                workOrderCode.trim(),
                machineId.trim(),
                title.trim(),
                description?.trim() || null,
                selectedPriority
            ]
        );

        const newWorkOrder = workOrderResult.rows[0];

        // Insert technician assignments
        for (let i = 0; i < technicianIds.length; i++) {
            await client.query(
                `
                INSERT INTO work_order_assignments (
                    work_order_id,
                    assignment_no,
                    technician_id
                )
                VALUES ($1, $2, $3)
                `,
                [
                    newWorkOrder.workOrderId,
                    i + 1,
                    technicianIds[i]
                ]
            );
        }

        // Commit transaction
        await client.query("COMMIT");
        transactionStarted = false;

        res.status(201).json({
            message: "Work order created successfully",
            data: {
                ...newWorkOrder,
                technicianIds
            }
        });

    } catch (error) {
        // Rollback if transaction is still active
        if (client && transactionStarted) {
            await client.query("ROLLBACK");
            transactionStarted = false;
        }

        console.error("Error creating work order:", error.message);

        // Handle duplicate work order code
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Work order code already exists"
            });
        }

        res.status(500).json({
            message: "Internal server error"
        });

    } finally {
        if (client) {
            client.release();
        }
    }
});


// ========================================
// GET ALL WORK ORDERS
// ========================================
app.get("/api/work-orders", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                wo.work_order_id AS "workOrderId",
                wo.work_order_code AS "workOrderCode",

                m.machine_id AS "machineId",
                m.machine_name AS "machineName",
                m.area,

                wo.title,
                wo.description,
                wo.priority,
                wo.status,
                wo.created_at AS "createdAt",
                wo.updated_at AS "updatedAt",

                t.technician_id AS "technicianId",
                t.technician_name AS "technicianName",
                t.specialization,
                wa.assignment_no AS "assignmentNo"

            FROM work_orders wo

            JOIN machines m
                ON wo.machine_id = m.machine_id

            LEFT JOIN work_order_assignments wa
                ON wo.work_order_id = wa.work_order_id

            LEFT JOIN technicians t
                ON wa.technician_id = t.technician_id

            ORDER BY
                wo.work_order_id ASC,
                wa.assignment_no ASC
        `);

        // Group rows by work order
        const workOrdersMap = new Map();

        for (const row of result.rows) {
            if (!workOrdersMap.has(row.workOrderId)) {
                workOrdersMap.set(row.workOrderId, {
                    workOrderId: row.workOrderId,
                    workOrderCode: row.workOrderCode,

                    machine: {
                        machineId: row.machineId,
                        machineName: row.machineName,
                        area: row.area
                    },

                    title: row.title,
                    description: row.description,
                    priority: row.priority,
                    status: row.status,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,

                    technicians: []
                });
            }

            // Add technician only if an assignment exists
            if (row.technicianId !== null) {
                workOrdersMap.get(row.workOrderId).technicians.push({
                    technicianId: row.technicianId,
                    technicianName: row.technicianName,
                    specialization: row.specialization,
                    assignmentNo: row.assignmentNo
                });
            }
        }

        res.status(200).json(
            Array.from(workOrdersMap.values())
        );

    } catch (error) {
        console.error("Error fetching work orders:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});


 // ========================================
 // GET WORK ORDER BY ID
 // ========================================
app.get("/api/work-orders/:id", async (req, res) => {
    try {
        const workOrderId = req.params.id;

        // Validate work order ID
        if (!/^[1-9]\d*$/.test(workOrderId)) {
            return res.status(400).json({
                message: "Invalid work order ID"
            });
        }

        const result = await pool.query(
            `
            SELECT
                wo.work_order_id AS "workOrderId",
                wo.work_order_code AS "workOrderCode",

                m.machine_id AS "machineId",
                m.machine_name AS "machineName",
                m.area,

                wo.title,
                wo.description,
                wo.priority,
                wo.status,
                wo.created_at AS "createdAt",
                wo.updated_at AS "updatedAt",

                t.technician_id AS "technicianId",
                t.technician_name AS "technicianName",
                t.specialization,
                wa.assignment_no AS "assignmentNo"

            FROM work_orders wo

            JOIN machines m
                ON wo.machine_id = m.machine_id

            LEFT JOIN work_order_assignments wa
                ON wo.work_order_id = wa.work_order_id

            LEFT JOIN technicians t
                ON wa.technician_id = t.technician_id

            WHERE wo.work_order_id = $1

            ORDER BY wa.assignment_no ASC
            `,
            [workOrderId]
        );

        // Check whether work order exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Work order not found"
            });
        }

        const firstRow = result.rows[0];

        // Build work order response
        const workOrder = {
            workOrderId: firstRow.workOrderId,
            workOrderCode: firstRow.workOrderCode,

            machine: {
                machineId: firstRow.machineId,
                machineName: firstRow.machineName,
                area: firstRow.area
            },

            title: firstRow.title,
            description: firstRow.description,
            priority: firstRow.priority,
            status: firstRow.status,
            createdAt: firstRow.createdAt,
            updatedAt: firstRow.updatedAt,

            technicians: []
        };

        // Add assigned technicians
        for (const row of result.rows) {
            if (row.technicianId !== null) {
                workOrder.technicians.push({
                    technicianId: row.technicianId,
                    technicianName: row.technicianName,
                    specialization: row.specialization,
                    assignmentNo: row.assignmentNo
                });
            }
        }

        res.status(200).json(workOrder);

    } catch (error) {
        console.error("Error fetching work order:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});


 // ========================================
 // UPDATE WORK ORDER STATUS
 // ========================================
app.patch("/api/work-orders/:id/status", async (req, res) => {
    const workOrderId = req.params.id;
    const { status: newStatus } = req.body || {};

    // Validate work order ID
    if (!/^[1-9]\d*$/.test(workOrderId)) {
        return res.status(400).json({
            message: "Invalid work order ID"
        });
    }

    // Validate request body
    if (
        !newStatus ||
        typeof newStatus !== "string"
    ) {
        return res.status(400).json({
            message: "Status is required"
        });
    }

    const validStatuses = [
        "OPEN",
        "IN_PROGRESS",
        "ON_HOLD",
        "COMPLETED",
        "CANCELLED"
    ];

    if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({
            message: "Invalid work order status"
        });
    }

    // Define allowed status transitions
    const allowedTransitions = {
        OPEN: ["IN_PROGRESS", "ON_HOLD", "CANCELLED"],
        IN_PROGRESS: ["ON_HOLD", "COMPLETED", "CANCELLED"],
        ON_HOLD: ["IN_PROGRESS", "CANCELLED"],
        COMPLETED: [],
        CANCELLED: []
    };

    let client;
    let transactionStarted = false;

    try {
        client = await pool.connect();

        await client.query("BEGIN");
        transactionStarted = true;

        // Lock the work order row during the transaction
        const currentResult = await client.query(
            `
            SELECT
                work_order_id,
                work_order_code,
                status
            FROM work_orders
            WHERE work_order_id = $1
            FOR UPDATE
            `,
            [workOrderId]
        );

        if (currentResult.rows.length === 0) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(404).json({
                message: "Work order not found"
            });
        }

        const currentWorkOrder = currentResult.rows[0];
        const currentStatus = currentWorkOrder.status;

        // Check whether the transition is allowed
        if (!allowedTransitions[currentStatus].includes(newStatus)) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message: `Cannot change status from ${currentStatus} to ${newStatus}`
            });
        }

        // Update work order status
        const updateResult = await client.query(
            `
            UPDATE work_orders
            SET
                status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE work_order_id = $2
            RETURNING
                work_order_id AS "workOrderId",
                work_order_code AS "workOrderCode",
                status,
                updated_at AS "updatedAt"
            `,
            [newStatus, workOrderId]
        );

        await client.query("COMMIT");
        transactionStarted = false;

        res.status(200).json({
            message: "Work order status updated successfully",
            data: {
                ...updateResult.rows[0],
                previousStatus: currentStatus
            }
        });

    } catch (error) {
        if (client && transactionStarted) {
            await client.query("ROLLBACK");
            transactionStarted = false;
        }

        console.error("Error updating work order status:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });

    } finally {
        if (client) {
            client.release();
        }
    }
});


 // ========================================
 // UPDATE WORK ORDER ASSIGNMENTS
 // ========================================
app.put("/api/work-orders/:id/assignments", async (req, res) => {
    const workOrderId = req.params.id;
    const { technicianIds } = req.body || {};

    // Validate work order ID
    if (!/^[1-9]\d*$/.test(workOrderId)) {
        return res.status(400).json({
            message: "Invalid work order ID"
        });
    }

    // Validate technician IDs
    if (
        !Array.isArray(technicianIds) ||
        technicianIds.length < 1 ||
        technicianIds.length > 2 ||
        !technicianIds.every(
            id => Number.isSafeInteger(id) && id > 0
        ) ||
        new Set(technicianIds).size !== technicianIds.length
    ) {
        return res.status(400).json({
            message: "Provide 1 or 2 unique valid technician IDs"
        });
    }

    let client;
    let transactionStarted = false;

    try {
        client = await pool.connect();

        await client.query("BEGIN");
        transactionStarted = true;

        // Lock work order
        const workOrderResult = await client.query(
            `
            SELECT
                work_order_id,
                work_order_code,
                status
            FROM work_orders
            WHERE work_order_id = $1
            FOR UPDATE
            `,
            [workOrderId]
        );

        if (workOrderResult.rows.length === 0) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(404).json({
                message: "Work order not found"
            });
        }

        const workOrder = workOrderResult.rows[0];

        // Only active work orders can change assignments
        if (!["OPEN", "IN_PROGRESS", "ON_HOLD"].includes(workOrder.status)) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(409).json({
                message: `Cannot update assignments for ${workOrder.status} work order`
            });
        }

        // Validate technicians
        const technicianResult = await client.query(
            `
            SELECT technician_id
            FROM technicians
            WHERE technician_id = ANY($1::bigint[])
              AND is_active = TRUE
            FOR SHARE
            `,
            [technicianIds]
        );

        if (technicianResult.rows.length !== technicianIds.length) {
            await client.query("ROLLBACK");
            transactionStarted = false;

            return res.status(400).json({
                message: "One or more technicians do not exist or are inactive"
            });
        }

        // Remove existing assignments
        await client.query(
            `
            DELETE FROM work_order_assignments
            WHERE work_order_id = $1
            `,
            [workOrderId]
        );

        // Insert new assignments
        for (let i = 0; i < technicianIds.length; i++) {
            await client.query(
                `
                INSERT INTO work_order_assignments (
                    work_order_id,
                    assignment_no,
                    technician_id
                )
                VALUES ($1, $2, $3)
                `,
                [
                    workOrderId,
                    i + 1,
                    technicianIds[i]
                ]
            );
        }

        // Retrieve updated assignments
        const updatedAssignments = await client.query(
            `
            SELECT
                t.technician_id AS "technicianId",
                t.technician_name AS "technicianName",
                t.specialization,
                wa.assignment_no AS "assignmentNo"
            FROM work_order_assignments wa
            JOIN technicians t
                ON wa.technician_id = t.technician_id
            WHERE wa.work_order_id = $1
            ORDER BY wa.assignment_no
            `,
            [workOrderId]
        );

        await client.query("COMMIT");
        transactionStarted = false;

        res.status(200).json({
            message: "Work order assignments updated successfully",
            data: {
                workOrderId: workOrder.work_order_id,
                workOrderCode: workOrder.work_order_code,
                technicians: updatedAssignments.rows
            }
        });

    } catch (error) {
        if (client && transactionStarted) {
            await client.query("ROLLBACK");
            transactionStarted = false;
        }

        console.error("Error updating assignments:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });

    } finally {
        if (client) {
            client.release();
        }
    }
});


// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
