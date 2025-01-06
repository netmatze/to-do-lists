import mongoose = require('mongoose');
import {Model} from "mongoose";

const mongodb_uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/to-do-lists';
mongoose.connect(mongodb_uri).
then(() => console.log('MongoDB Connected!')).catch(err => console.log(err));

export interface Subtask {
    title: string;
    completed: boolean;
}

export interface TodoItem extends Document {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    date: string;
    categories: string[];
    priority: string;
    dueTime: string;
    tags: string[];
    assignedTo: string;
    subtasks: Subtask[];
    progress: number;
    status: string;
    createdAt?: Date; // Added by timestamps
    updatedAt?: Date; // Added by timestamps
}

const subtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
});

const todoItemSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        completed: { type: Boolean, required: true },
        date: { type: String, required: true },
        categories: { type: [String], required: true },
        priority: { type: String, required: true },
        dueTime: { type: String, required: true },
        tags: { type: [String], required: true },
        assignedTo: { type: String, required: true },
        subtasks: { type: [subtaskSchema], required: true },
        progress: { type: Number, required: true },
        status: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true, // Enables `createdAt` and `updatedAt`
    }
);

const TodoItem: Model<TodoItem> = mongoose.model<TodoItem>('Todoitem', todoItemSchema);

export async function createNewTodoitem() {
    try {
        console.log('Creating new TodoItem:');
        const newTodoitem = new TodoItem({
            id: 1, // Ensure unique ID
            title: "Complete the project",
            description: "Finish the pending tasks for the project.",
            completed: false,
            date: new Date().toISOString(), // Use current date in ISO string format
            categories: ["Work", "Urgent"],
            priority: "High",
            dueTime: "17:00", // Example due time
            tags: ["project", "work"],
            assignedTo: "John Doe",
            subtasks: [
                { title: "Set up environment", completed: true },
                { title: "Write code", completed: false },
                { title: "Test application", completed: false }
            ],
            progress: 33, // Percentage completion
            status: "In Progress",
        });

        // Save the new TodoItem to the database
        const savedTodoitem = await newTodoitem.save();
        console.log('Todoitem saved successfully:', savedTodoitem);
    } catch (error) {
        console.error('Error saving the todoitem:', error);
    }
}

export async function findTodoitems () {
    try {
        const result = await TodoItem.find(); // Select specific fields

        if (result.length > 0) {
            console.log('Found todoitem:', result);
        } else {
            console.log('No matching todoitem found.');
        }
        return result;
    } catch (error) {
        console.error('Error finding the todoitem:', error);
    }
}

export async function findTodoitem (filter: any) {
    try {
        console.log("Incoming filter", filter);
        // Wenn `id` numerisch ist
        if (filter.id && !isNaN(filter.id)) {
            filter.id = parseInt(filter.id);
        }
        // Wenn `id` wie eine ObjectId aussieht, abfragen über `_id`
        else if (filter.id && mongoose.Types.ObjectId.isValid(filter.id)) {
            filter._id = new mongoose.Types.ObjectId(filter.id); // Konvertiere zu `_id`
            delete filter.id; // Entferne das `id`-Feld, um Konflikte zu vermeiden
        }
        console.log("Transformed filter:", filter);

        const result = await TodoItem.find(filter)
            .limit(1) // Limit to 1 result
            .sort({ priority: 1 }) // Sort by priority (ascending)
            .select({ _id: 1, title: 1, description: 1, priority: 1 }); // Include `_id` if needed

        if (result.length > 0) {
            console.log('Found todoitem:', result);
        } else {
            console.log('No matching todoitem found.');
        }
        return result;
    } catch (error) {
        console.error('Error finding the todoitem:', error);
    }
}

export async function findAndSortTodoItems(filter: any = {}, sortBy: string = "id", order: string = "asc") {
    try {
        // Definiere die Sortierreihenfolge (-1 = absteigend, 1 = aufsteigend)
        const sortOrder = order === "desc" ? -1 : 1;

        const result = await TodoItem.find(filter)
            .sort({ [sortBy]: sortOrder }) // Dynamisches Sortieren
            .select({ _id: 0, title: 1, description: 1, priority: 1, completed: 1 });

        if (result.length > 0) {
            console.log('Sorted TodoItems:', result);
        } else {
            console.log('No matching todoitems found.');
        }

        return result;
    } catch (error) {
        console.error('Error finding and sorting the todoitems:', error);
        throw error;
    }
}

export async function findPaginatedTodoItems(page: number, limit: number) {
    try {
        const skip = (page - 1) * limit;

        // Fetch paginated data
        const todoItems = await TodoItem.find({})
            .skip(skip) // Skip documents for the previous pages
            .limit(limit) // Limit the number of documents returned
            .select({ _id: 0, title: 1, description: 1, completed: 1 }); // Optional: Select specific fields

        // Get the total count of documents
        const totalCount = await TodoItem.countDocuments();

        return { todoItems, totalCount };
    } catch (error) {
        console.error("Error in findPaginatedTodoItems:", error);
        throw error; // Propagate the error for the caller to handle
    }
}

export async function findFilteredTodos(filter: any) {
    try {
        const filteredTodos = await TodoItem.find(filter).select({
            _id: 0,
            title: 1,
            description: 1,
            categories: 1,
            completed: 1,
            priority: 1,
        });

        return filteredTodos;
    } catch (error) {
        console.error("Error in findFilteredTodos:", error);
        throw error; // Propagate the error for the caller to handle
    }
}

export async function groupTodosByCategory() {
    try {
        // MongoDB-Aggregation
        const groupedTodos = await TodoItem.aggregate([
            {
                $unwind: "$categories",
            },
            {
                $group: {
                    _id: "$categories", // Gruppiere nach Kategorie
                    todos: {
                        $push: {
                            title: "$title",
                            description: "$description",
                            completed: "$completed",
                            priority: "$priority",
                        },
                    },
                    count: { $sum: 1 }, // Zähle die Anzahl der Todos in jeder Kategorie
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        return groupedTodos;
    } catch (error) {
        console.error("Error in groupTodosByCategory:", error);
        throw error;
    }
}

export async function createTodoItem(data: any) {
    try {
        const newTodoItem = new TodoItem(data);
        const savedTodoItem = await newTodoItem.save();

        return savedTodoItem;
    } catch (error) {
        console.error("Error creating new TodoItem:", error);
        throw error;
    }
}

export async function updateTodoItem(id: number, data: any) {
    try {
        const updatedTodoItem = await TodoItem.findOneAndUpdate(
            { id }, // Filter: Todo-Item mit der entsprechenden ID
            data,   // Neue Daten, die eingefügt werden sollen
            { new: true, runValidators: true } // Optionen: Rückgabe des aktualisierten Dokuments und Validierung aktivieren
        );

        return updatedTodoItem;
    } catch (error) {
        console.error("Error updating TodoItem:", error);
        throw error;
    }
}

export async function patchTodoItem(id: number, updates: any) {
    try {
        const patchedTodoItem = await TodoItem.findOneAndUpdate(
            { id }, // Filter: Todo-Item mit der entsprechenden ID
            { $set: updates }, // Nur die angegebenen Felder aktualisieren
            { new: true, runValidators: true } // Optionen: Rückgabe des aktualisierten Dokuments und Validierung aktivieren
        );

        return patchedTodoItem;
    } catch (error) {
        console.error("Error patching TodoItem:", error);
        throw error;
    }
}

export async function deleteTodoItem(id: number) {
    try {
        const deletedTodoItem = await TodoItem.findOneAndDelete({ id });
        return deletedTodoItem;
    } catch (error) {
        console.error("Error deleting TodoItem:", error);
        throw error;
    }
}

// Call the functions
// createNewTodoitem();
// findTodoitem();