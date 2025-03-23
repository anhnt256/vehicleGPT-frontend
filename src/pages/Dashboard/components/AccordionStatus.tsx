// src/components/AccordionStatus.tsx
import React, { useState, useRef } from 'react';
import {
  PlusCircle,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  GripVertical,
  Pencil,
  Trash,
} from 'lucide-react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { StatusColumn, Task, Status } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AccordionStatusProps {
  column: StatusColumn;
  isPaidUser: boolean;
  addingTaskToColumnId: string | null;
  setAddingTaskToColumnId: (id: string | null) => void;
  handleAddTask: (columnId: string, title: string, status?: Status, notes?: string) => void;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
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
  draggingTaskId: string | null;
  statusOptions: Status[];
}

const AccordionStatus: React.FC<AccordionStatusProps> = ({
  column,
  isPaidUser,
  addingTaskToColumnId,
  setAddingTaskToColumnId,
  handleAddTask,
  handleDragStart,
  editingTaskId,
  setEditingTaskId,
  handleUpdateTask,
  handleDeleteTask,
  handleToggleCompleted,
  handleUpdateColumn,
  handleDeleteColumn,
  activeOptionsTaskId,
  setActiveOptionsTaskId,
  activeOptionsColumnId,
  setActiveOptionsColumnId,
  draggingTaskId,
  statusOptions,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);

  // Sử dụng useSortable để xử lý kéo thả
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Thay vào đó, sử dụng state global
  const showOptions = activeOptionsColumnId === column.id;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitleInput(column.title);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleSaveColumnTitle = () => {
    if (!titleInput.trim() || !handleUpdateColumn) return;
    handleUpdateColumn(column.id, titleInput);
    setShowEditDialog(false);
  };

  // Hàm xử lý click vào header (trừ phần GripVertical)
  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
  };

  // Tính số task đã hoàn thành
  const completedTasks = column.tasks.filter((task) => task.completed).length;
  const totalTasks = column.tasks.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 bg-gray-800 rounded-lg overflow-hidden w-full"
    >
      <div className="p-3 sm:p-4 bg-gray-700 flex items-center">
        {/* Toggle icon */}
        <div className="cursor-pointer mr-2 flex-shrink-0" onClick={handleHeaderClick}>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>

        {/* Grip icon */}
        <div className="cursor-grab mr-2 flex-shrink-0" {...listeners} {...attributes}>
          <GripVertical size={20} className="text-gray-500" />
        </div>

        {/* Title */}
        {editingTaskId === column.id ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="bg-gray-800 text-white text-sm py-1 px-2 rounded mr-auto"
            autoFocus
          />
        ) : (
          <div className="flex flex-col mr-auto">
            <span className="text-white font-medium">{column.title}</span>
            <span className="text-xs text-gray-400">
              {completedTasks} / {totalTasks} Task Completed
            </span>
          </div>
        )}

        {/* Options menu - căn phải */}
        <div className="relative ml-auto flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            className="text-gray-400 hover:text-white p-1"
            onClick={(e) => {
              e.stopPropagation();
              if (showOptions) {
                setActiveOptionsColumnId(null);
              } else {
                setActiveOptionsTaskId(null);
                setActiveOptionsColumnId(column.id);
              }
            }}
          >
            <MoreHorizontal size={20} />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded shadow-lg py-1 z-50 min-w-40 border border-gray-700">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                onClick={handleEditClick}
              >
                <Pencil size={14} />
                <span>Edit Column</span>
              </button>
              <div className="border-t border-gray-700 my-1"></div>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
                onClick={handleDeleteClick}
              >
                <Trash size={14} />
                <span>Delete Column</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Phần nội dung của accordion */}
      {isOpen && (
        <div className="p-3 sm:p-4 w-full">
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

          {addingTaskToColumnId === column.id ? (
            <AddTaskForm
              onAdd={(title, status, notes) => handleAddTask(column.id, title, status, notes)}
              onCancel={() => setAddingTaskToColumnId(null)}
              defaultStatus={column.title}
              isPaidUser={isPaidUser}
              statusOptions={statusOptions}
            />
          ) : (
            <button
              onClick={() => setAddingTaskToColumnId(column.id)}
              className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md text-sm"
              style={{
                pointerEvents: draggingTaskId ? 'none' : 'auto',
                opacity: draggingTaskId ? 0.5 : 1,
              }}
            >
              <PlusCircle size={16} className="flex-shrink-0" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      )}

      {/* Dialog Edit Column */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Column Title</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Column Title</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowEditDialog(false)}
              className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveColumnTitle}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              disabled={!titleInput.trim()}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete Column */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Column: {column.title}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this column and all its tasks? This action cannot be
              undone.
            </p>

            {column.tasks.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-medium text-white">
                  Please review the following {column.tasks.length} task
                  {column.tasks.length !== 1 ? 's' : ''} before deletion:
                </h3>
                <div className="bg-gray-700 border border-gray-600 rounded-md p-3 max-h-[200px] overflow-y-auto">
                  {column.tasks.map((task) => (
                    <div key={task.id} className="py-2 border-b border-gray-600 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-400'}`}
                        ></div>
                        <p className="font-medium text-sm">{task.title}</p>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-gray-400 ml-4 mt-1 truncate">
                          Note: {task.notes}
                        </p>
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
              onClick={() => {
                if (handleDeleteColumn) {
                  handleDeleteColumn(column.id);
                }
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
    </div>
  );
};

export default React.memo(AccordionStatus);
