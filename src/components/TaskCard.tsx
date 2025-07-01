
import React from 'react';
import { Task } from '@/types/task';
import { Clock, CheckCircle, PlayCircle, Circle, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, description: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(task.description);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'done':
        return 'border-l-green-500 bg-green-50';
      case 'in-progress':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const handleEdit = () => {
    if (isEditing && editValue.trim() !== task.description) {
      onEdit(task.id, editValue.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditValue(task.description);
      setIsEditing(false);
    }
  };

  return (
    <div className={`border-l-4 ${getStatusColor()} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => {
              const nextStatus = 
                task.status === 'todo' ? 'in-progress' :
                task.status === 'in-progress' ? 'done' : 'todo';
              onStatusChange(task.id, nextStatus);
            }}
            className="mt-1 hover:scale-110 transition-transform"
          >
            {getStatusIcon()}
          </button>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleEdit}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                autoFocus
              />
            ) : (
              <h3 className={`text-lg font-medium ${
                task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.description}
              </h3>
            )}
            
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
              </span>
              {task.updatedAt !== task.createdAt && (
                <span>
                  Updated {format(new Date(task.updatedAt), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          task.status === 'done' ? 'bg-green-100 text-green-800' :
          task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
