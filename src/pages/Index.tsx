
import React, { useState, useEffect } from 'react';
import { TaskManager } from '@/utils/taskManager';
import { Task, TaskStatus } from '@/types/task';
import CommandInput from '@/components/CommandInput';
import TaskCard from '@/components/TaskCard';
import TaskStats from '@/components/TaskStats';
import TaskFilter from '@/components/TaskFilter';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare } from 'lucide-react';

const Index = () => {
  const [taskManager] = useState(() => new TaskManager());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
  const { toast } = useToast();

  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = () => {
    setTasks(taskManager.getAllTasks());
  };

  const handleCommand = (command: string, args: string[]) => {
    try {
      switch (command.toLowerCase()) {
        case 'add':
          if (args.length === 0) {
            toast({
              title: "Error",
              description: "Please provide a task description. Usage: add <description>",
              variant: "destructive"
            });
            return;
          }
          const description = args.join(' ');
          taskManager.addTask(description);
          toast({
            title: "Task Added",
            description: `"${description}" has been added to your tasks.`,
          });
          break;

        case 'update':
          if (args.length < 2) {
            toast({
              title: "Error",
              description: "Please provide task ID and new description. Usage: update <id> <new description>",
              variant: "destructive"
            });
            return;
          }
          const [updateId, ...newDescParts] = args;
          const newDescription = newDescParts.join(' ');
          const updatedTask = taskManager.updateTask(updateId, { description: newDescription });
          if (updatedTask) {
            toast({
              title: "Task Updated",
              description: `Task has been updated successfully.`,
            });
          } else {
            toast({
              title: "Error",
              description: "Task not found.",
              variant: "destructive"
            });
          }
          break;

        case 'delete':
          if (args.length === 0) {
            toast({
              title: "Error",
              description: "Please provide a task ID. Usage: delete <id>",
              variant: "destructive"
            });
            return;
          }
          const deleteId = args[0];
          const deleted = taskManager.deleteTask(deleteId);
          if (deleted) {
            toast({
              title: "Task Deleted",
              description: "Task has been deleted successfully.",
            });
          } else {
            toast({
              title: "Error",
              description: "Task not found.",
              variant: "destructive"
            });
          }
          break;

        case 'mark-in-progress':
          if (args.length === 0) {
            toast({
              title: "Error",
              description: "Please provide a task ID. Usage: mark-in-progress <id>",
              variant: "destructive"
            });
            return;
          }
          const progressId = args[0];
          const progressTask = taskManager.updateTask(progressId, { status: 'in-progress' });
          if (progressTask) {
            toast({
              title: "Status Updated",
              description: "Task marked as in progress.",
            });
          } else {
            toast({
              title: "Error",
              description: "Task not found.",
              variant: "destructive"
            });
          }
          break;

        case 'mark-done':
          if (args.length === 0) {
            toast({
              title: "Error",
              description: "Please provide a task ID. Usage: mark-done <id>",
              variant: "destructive"
            });
            return;
          }
          const doneId = args[0];
          const doneTask = taskManager.updateTask(doneId, { status: 'done' });
          if (doneTask) {
            toast({
              title: "Task Completed! 🎉",
              description: "Great job! Task has been marked as done.",
            });
          } else {
            toast({
              title: "Error",
              description: "Task not found.",
              variant: "destructive"
            });
          }
          break;

        case 'list':
          setActiveFilter('all');
          toast({
            title: "Showing All Tasks",
            description: `Displaying all ${taskManager.getAllTasks().length} tasks.`,
          });
          break;

        case 'list-done':
          setActiveFilter('done');
          const doneTasks = taskManager.getTasksByStatus('done');
          toast({
            title: "Showing Completed Tasks",
            description: `Displaying ${doneTasks.length} completed tasks.`,
          });
          break;

        case 'list-todo':
          setActiveFilter('todo');
          const todoTasks = taskManager.getTasksByStatus('todo');
          toast({
            title: "Showing To-Do Tasks",
            description: `Displaying ${todoTasks.length} pending tasks.`,
          });
          break;

        case 'list-in-progress':
          setActiveFilter('in-progress');
          const inProgressTasks = taskManager.getTasksByStatus('in-progress');
          toast({
            title: "Showing In-Progress Tasks",
            description: `Displaying ${inProgressTasks.length} tasks in progress.`,
          });
          break;

        default:
          toast({
            title: "Unknown Command",
            description: `Command "${command}" not recognized. Try: add, update, delete, mark-in-progress, mark-done, list, list-done, list-todo, list-in-progress`,
            variant: "destructive"
          });
          return;
      }
      
      refreshTasks();
    } catch (error) {
      console.error('Command execution error:', error);
      toast({
        title: "Error",
        description: "An error occurred while executing the command.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    taskManager.updateTask(id, { status });
    refreshTasks();
    
    if (status === 'done') {
      toast({
        title: "Task Completed! 🎉",
        description: "Great job! Keep up the momentum!",
      });
    }
  };

  const handleDelete = (id: string) => {
    taskManager.deleteTask(id);
    refreshTasks();
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your list.",
    });
  };

  const handleEdit = (id: string, description: string) => {
    taskManager.updateTask(id, { description });
    refreshTasks();
    toast({
      title: "Task Updated",
      description: "Task description has been updated.",
    });
  };

  const getFilteredTasks = () => {
    if (activeFilter === 'all') return tasks;
    return tasks.filter(task => task.status === activeFilter);
  };

  const stats = taskManager.getTaskStats();
  const filteredTasks = getFilteredTasks();
  
  const filterCounts = {
    all: stats.total,
    todo: stats.todo,
    'in-progress': stats.inProgress,
    done: stats.done,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Task Tracker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your tasks with CLI-style commands. Add, update, and track your progress with ease.
          </p>
        </div>

        {/* Command Input */}
        <CommandInput onCommand={handleCommand} tasks={tasks} />

        {/* Task Statistics */}
        <TaskStats stats={stats} />

        {/* Task Filters */}
        <TaskFilter 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CheckSquare className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">
                {activeFilter === 'all' ? 'No tasks yet' : `No ${activeFilter.replace('-', ' ')} tasks`}
              </h3>
              <p className="text-gray-400">
                {activeFilter === 'all' 
                  ? 'Get started by adding your first task using the command input above.'
                  : `Add some tasks or switch to a different filter to see your tasks.`
                }
              </p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            ))
          )}
        </div>

        {/* Help Text */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Commands:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">add</span> &lt;description&gt; - Add a new task
            </div>
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">update</span> &lt;id&gt; &lt;description&gt; - Update task
            </div>
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">delete</span> &lt;id&gt; - Delete a task
            </div>
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">mark-in-progress</span> &lt;id&gt; - Mark as in progress
            </div>
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">mark-done</span> &lt;id&gt; - Mark as completed
            </div>
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">list</span> - Show all tasks
            </div>
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">list-todo</span> - Show pending tasks
            </div>
            <div className="font-mono text-gray-600">
              <span className="text-blue-600 font-semibold">list-done</span> - Show completed tasks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
