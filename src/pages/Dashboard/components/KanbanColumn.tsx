// src/components/KanbanColumn.tsx
import React, { useState } from 'react';
import { PlusCircle, MoreHorizontal, Pencil, Trash, X, Check, GripVertical } from 'lucide-react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { StatusColumn, Task } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface KanbanColumnProps {
  column: StatusColumn;
  isPaidUser: boolean;
  addingTaskToColumnId: string | null;
  setAddingTaskToColumnId: (id: string | null) => void;
  handleAddTask: (columnId: string, title: string) => void;
  handleUpdateColumn: (columnId: string, title: string) => void;
  handleDeleteColumn: (columnId: string) => void;
  editingColumnId: string | null;
  setEditingColumnId: (id: string | null) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  handleUpdateTask: (taskId: string, updatedData: Partial<Task>) => void;
  handleDeleteTask: (taskId: string) => void;
  handleToggleCompleted: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  isPaidUser,
  addingTaskToColumnId,
  setAddingTaskToColumnId,
  handleAddTask,
  handleUpdateColumn,
  handleDeleteColumn,
  editingColumnId,
  setEditingColumnId,
  editingTaskId,
  setEditingTaskId,
  handleUpdateTask,
  handleDeleteTask,
  handleToggleCompleted
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });

  const [titleInput, setTitleInput] = useState(column.title);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(false);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        style={style}
        className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[350px] flex flex-col bg-gray-800 rounded-lg overflow-hidden"
      >
        <div 
          className="p-2 sm:p-3 bg-gray-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div className="cursor-move self-center mr-1" {...listeners} {...attributes}>
              <GripVertical size={16} className="text-gray-500" />
            </div>
            
            {editingColumnId === column.id ? (
              <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="bg-gray-800 text-white text-sm py-1 px-2 rounded w-full"
                  autoFocus
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateColumn(column.id, titleInput);
                  }}
                  className="p-1 text-green-500 hover:text-green-400"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingColumnId(null);
                  }}
                  className="p-1 text-red-500 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium truncate text-sm sm:text-base">{column.title}</span>
                <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded-full shrink-0">
                  {column.tasks.length}
                </span>
              </>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
              className="text-gray-400 hover:text-white p-1"
            >
              <MoreHorizontal size={16} />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded shadow-lg py-1 z-50 min-w-40 border border-gray-700">
                <button 
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingColumnId(column.id);
                    setShowOptions(false);
                  }}
                >
                  <Pencil size={14} />
                  <span>Edit Column</span>
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                <button 
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowOptions(false);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash size={14} />
                  <span>Delete Column</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="flex-1 p-2 sm:p-3 overflow-y-auto"
          style={{ height: 'calc(100vh - 180px)' }}
        >
          <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
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
                />
              ))}
              
              {addingTaskToColumnId === column.id ? (
                <AddTaskForm 
                  onAdd={(title) => handleAddTask(column.id, title)}
                  onCancel={() => setAddingTaskToColumnId(null)}
                />
              ) : (
                <button
                  onClick={() => setAddingTaskToColumnId(column.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md text-base"
                >
                  <PlusCircle size={20} className="flex-shrink-0" />
                  <span>Add Task</span>
                </button>
              )}
            </div>
          </SortableContext>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Column: {column.title}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this column and all its tasks? This action cannot be undone.
            </p>
            
            {column.tasks.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-medium text-white">
                  Please review the following {column.tasks.length} task{column.tasks.length !== 1 ? 's' : ''} before deletion:
                </h3>
                <div className="bg-gray-700 border border-gray-600 rounded-md p-3 max-h-[200px] overflow-y-auto">
                  {column.tasks.map(task => (
                    <div key={task.id} className="py-2 border-b border-gray-600 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <p className="font-medium text-sm">{task.title}</p>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-gray-400 ml-4 mt-1 truncate">Note: {task.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-amber-400 text-sm">
                  Warning: All these tasks will be permanently deleted.
                </p>
              </div>
            ) : (
              <p className="text-gray-400 italic">This column doesn't contain any tasks.</p>
            )}
          </div>
          
          <DialogFooter>
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteColumn(column.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash size={16} />
              <span>Delete Column</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanColumn;