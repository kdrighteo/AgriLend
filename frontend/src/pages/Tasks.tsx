import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as taskService from '../services/taskService';
import { Task } from '../services/taskService';
import '../styles/Tasks.css';

const Tasks: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: undefined
  });

  // Fetch tasks on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  // Fetch tasks based on active filter
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let fetchedTasks: Task[];
      
      if (activeFilter === 'all') {
        fetchedTasks = await taskService.getTasks();
      } else {
        fetchedTasks = await taskService.getTasksByStatus(activeFilter);
      }
      
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: 'all' | 'pending' | 'in-progress' | 'completed') => {
    setActiveFilter(filter);
    // Re-fetch tasks with the new filter
    setIsLoading(true);
    setActiveFilter(filter);
    
    // We need to wait for state update before fetching
    setTimeout(() => {
      fetchTasks();
    }, 0);
  };

  // Open modal for creating a new task
  const openCreateModal = () => {
    setCurrentTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: undefined
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing task
  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle date input changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setFormData({ ...formData, [name]: new Date(value) });
    } else {
      setFormData({ ...formData, [name]: undefined });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (currentTask) {
        // Update existing task
        await taskService.updateTask(currentTask._id as string, formData);
      } else {
        // Create new task
        await taskService.createTask(formData as Required<Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>>);
      }
      
      // Close modal and refresh tasks
      closeModal();
      fetchTasks();
    } catch (err: any) {
      console.error('Error saving task:', err);
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        // Refresh tasks
        fetchTasks();
      } catch (err: any) {
        console.error('Error deleting task:', err);
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date for input field
  const formatDateForInput = (dateString?: Date) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">My Tasks</h1>
        <button 
          className="create-task-button" 
          onClick={openCreateModal}
        >
          <svg className="task-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Task
        </button>
      </div>

      {/* Filter buttons */}
      <div className="tasks-filter">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All Tasks
        </button>
        <button 
          className={`filter-button ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterChange('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-button ${activeFilter === 'in-progress' ? 'active' : ''}`}
          onClick={() => handleFilterChange('in-progress')}
        >
          In Progress
        </button>
        <button 
          className={`filter-button ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="form-error" role="alert">
          <svg className="error-icon" width="20" height="20" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="loading-spinner">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && tasks.length === 0 && (
        <div className="empty-tasks">
          <div className="empty-tasks-icon">📋</div>
          <h3 className="empty-tasks-message">No tasks found</h3>
          <button 
            className="create-task-button" 
            onClick={openCreateModal}
          >
            Create Your First Task
          </button>
        </div>
      )}

      {/* Tasks grid */}
      {!isLoading && tasks.length > 0 && (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div 
              key={task._id} 
              className={`task-card priority-${task.priority}`}
            >
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <div className="task-meta">
                <span className={`task-status status-${task.status}`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                </span>
                <span className="task-due-date">
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                </span>
              </div>
              <div className="task-actions">
                <button 
                  className="task-action-button" 
                  onClick={() => openEditModal(task)}
                  aria-label="Edit task"
                >
                  <svg className="task-icon edit-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  className="task-action-button" 
                  onClick={() => handleDeleteTask(task._id as string)}
                  aria-label="Delete task"
                >
                  <svg className="task-icon delete-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{currentTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button 
                className="modal-close" 
                onClick={closeModal}
                aria-label="Close modal"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Title*</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Task title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Task description"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate ? formatDateForInput(formData.dueDate) : ''}
                    onChange={handleDateChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="modal-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-submit"
                  disabled={isSubmitting || !formData.title}
                >
                  {isSubmitting ? 'Saving...' : currentTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
