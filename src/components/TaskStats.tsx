
import React from 'react';
import { CheckCircle, Circle, PlayCircle, BarChart3 } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  const getCompletionPercentage = () => {
    return stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Task Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 flex items-center justify-center gap-1">
            <Circle className="w-5 h-5" />
            {stats.todo}
          </div>
          <div className="text-sm text-gray-500">To Do</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
            <PlayCircle className="w-5 h-5" />
            {stats.inProgress}
          </div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
            <CheckCircle className="w-5 h-5" />
            {stats.done}
          </div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{getCompletionPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
