import {
    findTodoitem,
    findTodoitems,
    findAndSortTodoItems,
    findPaginatedTodoItems,
    findFilteredTodos,
    groupTodosByCategory,
    createTodoItem,
    updateTodoItem,
    patchTodoItem,
    deleteTodoItem
} from "../database/todolistdb";
import mongoose from "mongoose";

const express = require('express');

const app = express.Router();

app.get("/", async (req, res) => {
    try {
        const { completed } = req.query;

        const filter: any = {};
        if (completed !== undefined) {
            filter.completed = completed === "true";
        }
        else {
            filter.completed = completed;
        }

        // Fetch data from MongoDB using findTodolist method
        const todoItems = await findTodoitem(filter);
        console.log("Returned todoItems: ", todoItems);

        res.status(200).json({
            success: true,
            data: todoItems,
        });
    } catch (error) {
        console.error("Error fetching TodoItems:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching TodoItems.",
        });
    }
});

/**
 * GET /all
 * Retrieve all todo items.
 */
app.get("/all", async (req, res) => {
    try {
        const todoItems = await findTodoitems();
        res.status(200).json({
            success: true,
            data: todoItems,
        });
    } catch (error) {
        console.error("Error fetching all TodoItems:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching all TodoItems.",
        });
    }
});

/**
 * GET /sort
 * Sort todos by a field.
 * Query parameters: `sortBy` (default: `id`)
 */
app.get("/sort", async (req, res) => {
    try {
        let { sortBy = "id" } = req.query;
        const order = "asc";
        // Fetch sorted data
        const todoItems = await findAndSortTodoItems({}, sortBy as string, order as string);

        res.status(200).json({
            success: true,
            data: todoItems,
        });
    } catch (error) {
        console.error("Error sorting TodoItems:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while sorting TodoItems.",
        });
    }
});

app.get("/sortwithorder", async (req, res) => {
    try {
        let { sortBy = "id", order = "asc" } = req.query;

        // Define sorting order
        const sortOrder = order === "desc" ? -1 : 1;
        const todoItems = await findAndSortTodoItems({}, sortBy as string, order as string);

        res.status(200).json({
            success: true,
            data: todoItems,
        });
    } catch (error) {
        console.error("Error sorting TodoItems:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while sorting TodoItems.",
        });
    }
});

app.get("/pagination", async (req, res) => {
    try {
        // Extract and parse query parameters
        let { page = 1, limit = 2 } = req.query;
        page = parseInt(page as string, 10);
        limit = parseInt(limit as string, 10);

        // Validate query parameters
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or limit parameter. Both must be positive integers.",
            });
        }

        const skip = (page - 1) * limit;

        const { todoItems, totalCount } = await findPaginatedTodoItems(page, limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            data: todoItems,
        });
    } catch (error) {
        console.error("Error fetching paginated TodoItems:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching paginated TodoItems.",
        });
    }
});

app.get("/filter", async (req, res) => {
    try {
        console.log("Query ", req.query);
        const { title, category, completed, priority } = req.query;
        console.log(`Title: ${title} - Category: ${category} - Completed: ${completed} - priority: ${priority}`);
        const filter: any = {};

        if (title) {
            filter.title = title;
        }
        if (category) {
            filter.categories = category;
        }
        if (completed !== undefined) {
            filter.completed = completed === "true";
        }
        if (priority) {
            filter.priority = priority;
        }
        console.log(filter);
        const filteredTodos = await findFilteredTodos(filter);

        res.status(200).json({
            success: true,
            data: filteredTodos,
        });
    } catch (error) {
        console.error("Error fetching filtered TodoItems:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while filtering TodoItems.",
        });
    }
});

app.get("/groupbycategory", async (req, res) => {
    try {
        // Gruppierte Todos abrufen
        const groupedTodos = await groupTodosByCategory();

        res.status(200).json({
            success: true,
            data: groupedTodos,
        });
    } catch (error) {
        console.error("Error grouping todos by category:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while grouping todos by category.",
        });
    }
});

app.head("/head", async (req, res) => {
    console.log("HEAD", req.params.id);
    const id = req.params.id;

    // Check if the `id` is a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    if (isObjectId) {
        // Query by `_id` if it is a valid ObjectId
        const filter = {_id: new mongoose.Types.ObjectId(id)};

        const todoItem = await findTodoitem(filter);
        if (todoItem) {
            res.status(202);
        } else {
            res.status(404);
        }
    }
    else {
        res.status(404);
    }
});

/**
 * GET /:id
 * Retrieve a specific todo by its `id`.
 */
app.get("/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const id = req.params.id;
        let filter = {};

        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        if (isObjectId) {
            filter._id = new mongoose.Types.ObjectId(id);
        } else if (!isNaN(parseInt(id))) {
            // Query by `id` if it is a custom numeric ID
            filter.id = parseInt(id);
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid ID parameter. Must be a valid ObjectId or a numeric custom ID.",
            });
        }
        console.log(isObjectId, filter);

        const todoItem = await findTodoitem(filter);
        if (!todoItem || todoItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Todo item not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: todoItem[0], // Return the first item if multiple exist
        });
    } catch (error) {
        console.error("Error fetching TodoItem by ID:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the TodoItem.",
        });
    }
});

app.options("/", (req, res) => {
    res.set("Allow", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS").send();
});

app.post("/", async (req, res) => {
    try {
        const todoData = req.body;

        const newTodoItem = await createTodoItem(todoData);

        res.status(201).json({
            success: true,
            data: newTodoItem,
        });
    } catch (error) {
        console.error("Error creating new TodoItem:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the TodoItem.",
        });
    }
});



app.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID parameter. ID must be a number.",
            });
        }
        const updateData = req.body;
        const updatedTodoItem = await updateTodoItem(id, updateData);
        // Überprüfen, ob ein Todo-Item gefunden und aktualisiert wurde
        if (!updatedTodoItem) {
            return res.status(404).json({
                success: false,
                message: "Todo item not found.",
            });
        }
        res.status(200).json({
            success: true,
            data: updatedTodoItem,
        });
    } catch (error) {
        console.error("Error updating TodoItem:", error);

        // Fehlerhafte Antwort
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the TodoItem.",
        });
    }
});

app.patch("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID parameter. ID must be a number.",
            });
        }

        const updates = req.body;
        const patchedTodoItem = await patchTodoItem(id, updates);
        if (!patchedTodoItem) {
            return res.status(404).json({
                success: false,
                message: "Todo item not found.",
            });
        }
        res.status(200).json({
            success: true,
            data: patchedTodoItem,
        });
    } catch (error) {
        console.error("Error patching TodoItem:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while patching the TodoItem.",
        });
    }
});

app.delete("/", async (req, res) => {
    try {
        const { id } = req.body as { id: number };

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID parameter. ID must be a number.",
            });
        }

        const deletedTodoItem = await deleteTodoItem(id);
        if (!deletedTodoItem) {
            return res.status(404).json({
                success: false,
                message: "Todo item not found.",
            });
        }
        res.status(200).json({
            success: true,
            message: "Todo item deleted successfully.",
            data: deletedTodoItem,
        });
    } catch (error) {
        console.error("Error deleting TodoItem:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the TodoItem.",
        });
    }
});

module.exports = app; // module.exports for CommonJS
