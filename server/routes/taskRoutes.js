import express from "express";
import { getTasks, createTask, getTaskById, updateTask, deleteTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateCreateTask, validateUpdateTask, validateMongoId, handleValidationErrors } from "../middleware/validators.js";

const router = express.Router();

router.use(protect);

router.post('/', validateCreateTask, handleValidationErrors, createTask);
router.get('/', getTasks);
router.get('/:id', validateMongoId, handleValidationErrors, getTaskById);
router.put('/:id', validateMongoId, validateUpdateTask, handleValidationErrors, updateTask);
router.delete('/:id', validateMongoId, handleValidationErrors, deleteTask);

export default router;