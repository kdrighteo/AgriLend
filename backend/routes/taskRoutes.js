const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, taskController.createTask);

// @route   GET /api/tasks
// @desc    Get all tasks for current user
// @access  Private
router.get('/', auth, taskController.getTasks);

// @route   GET /api/tasks/:id
// @desc    Get a specific task by ID
// @access  Private
router.get('/:id', auth, taskController.getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, taskController.updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, taskController.deleteTask);

// @route   GET /api/tasks/status/:status
// @desc    Get tasks by status
// @access  Private
router.get('/status/:status', auth, taskController.getTasksByStatus);

module.exports = router;
