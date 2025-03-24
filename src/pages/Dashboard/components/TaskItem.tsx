import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  GripVertical,
  Pencil,
  Trash,
} from 'lucide-react';
import { Status, Task } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { allStatuses } from '@/utils/constants';

interface TaskItemProps {
  task: Task;
  isPaidUser: boolean;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  handleUpdateTask: (taskId: string, updatedData: Partial<Task>) => void;
  handleDeleteTask: (taskId: string) => void;
  handleToggleCompleted: (taskId: string, updatedData: Partial<Task>) => void;
  activeOptionsTaskId: string | null;
  setActiveOptionsTaskId: (id: string | null) => void;
  activeOptionsColumnId: string | null;
  setActiveOptionsColumnId: (id: string | null) => void;
  statusOptions: string[];
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isPaidUser,
  editingTaskId,
  setEditingTaskId,
  handleUpdateTask,
  handleDeleteTask,
  handleToggleCompleted,
  activeOptionsTaskId,
  setActiveOptionsTaskId,
  setActiveOptionsColumnId,
  statusOptions = allStatuses,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // State for editing
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.note || '');
  const [editStatus, setEditStatus] = useState<Status>(task.status);

  // Reset edit form when task changes or dialog opens
  useEffect(() => {
    if (showEditDialog || editingTaskId === task.id) {
      setEditTitle(task.title);
      setEditNotes(task.note || '');
      setEditStatus(task.status);
    }
  }, [task, showEditDialog, editingTaskId]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  // Handlers for Save and Delete operations
  const handleSaveTask = () => {
    if (!editTitle.trim()) return;

    const updatedData: Partial<Task> = {
      title: editTitle.trim() !== task.title ? editTitle.trim() : task.title,
      status: editStatus !== task.status ? editStatus : task.status,
      note: isPaidUser
        ? editNotes.trim() !== task.note
          ? editNotes.trim() || undefined
          : task.note
        : undefined,
    };

    handleUpdateTask(task.id, updatedData);

    // Reset UI states
    setShowEditDialog(false);
    setEditingTaskId(null);
  };

  const handleConfirmDelete = () => {
    handleDeleteTask(task.id);
    setShowDeleteDialog(false);
  };

  // Kiểm tra xem task hiện tại có đang hiển thị options không
  const showOptions = activeOptionsTaskId === task.id;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveOptionsTaskId(null);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveOptionsTaskId(null);
    setShowDeleteDialog(true);
  };

  const handleToggleTask = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Không cần truyền isCompleted vì hàm handleToggleCompleted sẽ đảo ngược giá trị hiện tại
    const updatedData: Partial<Task> = {
      title: task.title, // Sử dụng title hiện tại
      status: task.status, // Sử dụng status hiện tại
      note: task.note, // Sử dụng notes hiện tại
    };

    handleToggleCompleted(task.id, updatedData);
  };

  return (
    <>
      <div className="w-full bg-gray-800 hover:bg-gray-750 rounded-md p-3 relative group">
        <div className="flex items-start gap-2">
          {/* Left side with checkbox and drag handle */}
          <div className="flex flex-col items-center gap-1">
            <div className="cursor-move text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            </div>
            <button
              onClick={handleToggleTask}
              className="flex-shrink-0 text-gray-400 hover:text-white"
            >
              {task.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div
              className={`${
                task.isCompleted ? 'line-through text-gray-500' : 'text-gray-200'
              } text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis`}
              title={task.title}
            >
              {task.title}
            </div>

            {/* Date */}
            <div className="text-xs text-gray-500 mt-1">
              {task.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })}
            </div>

            {/* Notes section */}
            {isPaidUser && task.note && (
              <div className="mt-1.5">
                <button
                  type="button"
                  className="flex items-center text-xs text-gray-400 hover:text-gray-300"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  {showNotes ? (
                    <ChevronDown size={12} className="mr-1 flex-shrink-0" />
                  ) : (
                    <ChevronRight size={12} className="mr-1 flex-shrink-0" />
                  )}
                  <span>Notes</span>
                </button>

                {showNotes && (
                  <div className="mt-1 text-xs text-gray-400 pl-4 border-l border-gray-700 pr-2">
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                      title={task.note}
                    >
                      {task.note}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side with date and options */}
          <div className="absolute right-3 top-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (showOptions) {
                  setActiveOptionsTaskId(null);
                } else {
                  setActiveOptionsColumnId(null);
                  setActiveOptionsTaskId(task.id);
                }
              }}
              className="p-1 text-gray-400 hover:text-white"
            >
              <MoreHorizontal size={16} />
            </button>

            {showOptions && (
              <div className="absolute z-[9999] right-0 top-full mt-1 bg-gray-800 rounded shadow-lg py-1 min-w-40 border border-gray-700">
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700"
                  onClick={handleEditClick}
                >
                  <Pencil size={14} />
                  <span>Edit Task</span>
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-gray-700"
                  onClick={handleDeleteClick}
                >
                  <Trash size={14} />
                  <span>Delete Task</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            // Reset form when dialog closes
            setEditTitle(task.title);
            setEditNotes(task.note || '');
            setEditStatus(task.status);
          }
        }}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Task Title</label>
              <input
                type="text"
                value={editTitle}
                maxLength={50}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as Status)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {isPaidUser && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Notes (Optional)</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 min-h-[100px] text-white"
                  placeholder="Add details about this task..."
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <button
              onClick={() => setShowEditDialog(false)}
              className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTask}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              disabled={!editTitle.trim()}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
              <p className="font-medium">{task.title}</p>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
