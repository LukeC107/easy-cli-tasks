
import React from 'react';
import { TaskStatus } from '@/types/task';

interface TaskFilterProps {
  activeFilter: TaskStatus | 'all';
  onFilterChange: (filter: TaskStatus | 'all') => void;
  counts: {
    all: number;
    todo: number;
    'in-progress': number;
    done: number;
  };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { key: 'all' as const, label: 'All Tasks', count: counts.all },
    { key: 'todo' as const, label: 'To Do', count: counts.todo },
    { key: 'in-progress' as const, label: 'In Progress', count: counts['in-progress'] },
    { key: 'done' as const, label: 'Done', count: counts.done },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === filter.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            activeFilter === filter.key
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
