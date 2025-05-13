import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new task
export const createTask = async (taskData: Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
  const response = await axios.post(
    API_URL,
    taskData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  
  return response.data;
};

// Get all tasks for the current user
export const getTasks = async () => {
  const response = await axios.get(
    API_URL,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  
  return response.data;
};

// Get a specific task by ID
export const getTaskById = async (id: string) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  
  return response.data;
};

// Update a task
export const updateTask = async (id: string, taskData: Partial<Task>) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    taskData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  
  return response.data;
};

// Get tasks by status
export const getTasksByStatus = async (status: Task['status']) => {
  const response = await axios.get(
    `${API_URL}/status/${status}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  
  return response.data;
};
