
export interface Task {
  id: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = Task['status'];

export interface TaskFilters {
  all: boolean;
  todo: boolean;
  'in-progress': boolean;
  done: boolean;
}
