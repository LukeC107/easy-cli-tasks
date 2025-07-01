
import { Task, TaskStatus } from '@/types/task';

const STORAGE_KEY = 'task-tracker-tasks';

export class TaskManager {
  private tasks: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.tasks = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = [];
    }
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addTask(description: string): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.generateId(),
      description: description.trim(),
      status: 'todo',
      createdAt: now,
      updatedAt: now
    };

    this.tasks.unshift(task);
    this.saveTasks();
    return task;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.tasks[taskIndex] = updatedTask;
    this.saveTasks();
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    if (this.tasks.length < initialLength) {
      this.saveTasks();
      return true;
    }
    return false;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getTaskStats() {
    const total = this.tasks.length;
    const todo = this.tasks.filter(task => task.status === 'todo').length;
    const inProgress = this.tasks.filter(task => task.status === 'in-progress').length;
    const done = this.tasks.filter(task => task.status === 'done').length;

    return { total, todo, inProgress, done };
  }
}
