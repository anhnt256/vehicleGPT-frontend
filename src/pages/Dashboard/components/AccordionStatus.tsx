// src/components/AccordionStatus.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { StatusColumn, Task, Status } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface AccordionStatusProps {
  column: StatusColumn;
  isPaidUser: boolean;
  addingTaskToColumnId: string | null;
  setAddingTaskToColumnId: (id: string | null) => void;
  handleAddTask: (columnId: string, title: string, notes?: string) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  handleUpdateTask: (taskId: string, updatedData: Partial<Task>) => void;
  handleDeleteTask: (taskId: string) => void;
  handleToggleCompleted: (taskId: string, updatedData: Partial<Task>) => void;
  handleUpdateColumn?: (columnId: string, title: string) => void;
  handleDeleteColumn?: (columnId: string) => void;
  activeOptionsTaskId: string | null;
  setActiveOptionsTaskId: (id: string | null) => void;
  activeOptionsColumnId: string | null;
  setActiveOptionsColumnId: (id: string | null) => void;
  statusOptions: Status[];
}

const AccordionStatus: React.FC<AccordionStatusProps> = ({
  column,
  isPaidUser,
  addingTaskToColumnId,
  setAddingTaskToColumnId,
  handleAddTask,
  editingTaskId,
  setEditingTaskId,
  handleUpdateTask,
  handleDeleteTask,
  handleToggleCompleted,
  activeOptionsTaskId,
  setActiveOptionsTaskId,
  activeOptionsColumnId,
  setActiveOptionsColumnId,
  statusOptions,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const style = {};

  const completedTaskCount = column.tasks.filter((task) => task.isCompleted).length;
  const totalTaskCount = column.tasks.length;

  return (
    <div style={style} className="mb-4 w-full bg-gray-800 rounded-md overflow-hidden">
      <div className="p-3 sm:p-4 bg-gray-700 flex items-center justify-between rounded-t-md">
        <div className="flex items-center">
          {/* Toggle icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 hover:text-white mr-2"
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Column info */}
          <div>
            <h3 className="text-gray-100 font-medium">{column.title}</h3>
            <div className="text-gray-400 text-xs">
              {completedTaskCount} / {totalTaskCount} Task Completed
            </div>
          </div>
        </div>
      </div>

      {/* Accordion content */}
      <Accordion type="single" collapsible defaultValue="tasks" className="w-full">
        <AccordionItem value="tasks" className="border-0">
          <div className="hidden">
            <AccordionTrigger>Tasks</AccordionTrigger>
          </div>
          <AccordionContent className={`${isOpen ? 'block' : 'hidden'}`}>
            <div className="px-3 sm:px-4 py-2 space-y-3">
              {/* Tasks */}
              <div className="space-y-3 overflow-visible w-full">
                {column.tasks.map((task: Task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isPaidUser={isPaidUser}
                    editingTaskId={editingTaskId}
                    setEditingTaskId={setEditingTaskId}
                    handleUpdateTask={handleUpdateTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleCompleted={handleToggleCompleted}
                    activeOptionsTaskId={activeOptionsTaskId}
                    setActiveOptionsTaskId={setActiveOptionsTaskId}
                    activeOptionsColumnId={activeOptionsColumnId}
                    setActiveOptionsColumnId={setActiveOptionsColumnId}
                    statusOptions={statusOptions}
                  />
                ))}
              </div>

              {/* Add Task Form or Button */}
              {addingTaskToColumnId === column.id ? (
                <AddTaskForm
                  onAdd={(title, note) => {
                    handleAddTask(column.id, title, note);
                  }}
                  onCancel={() => setAddingTaskToColumnId(null)}
                  defaultStatus={column.title}
                  isPaidUser={isPaidUser}
                  statusOptions={statusOptions}
                />
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-black bg-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 h-auto"
                  onClick={() => setAddingTaskToColumnId(column.id)}
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add Task</span>
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default React.memo(AccordionStatus);
