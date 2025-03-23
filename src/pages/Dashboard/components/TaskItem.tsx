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
import { STATUS_LIST, allStatuses } from '@/utils/constants';

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
  activeOptionsColumnId,
  setActiveOptionsColumnId,
  statusOptions = allStatuses,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // State for editing
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || '');
  const [editStatus, setEditStatus] = useState<Status>(task.status);

  // Reset edit form when task changes or dialog opens
  useEffect(() => {
    if (showEditDialog || editingTaskId === task.id) {
      setEditTitle(task.title);
      setEditNotes(task.notes || '');
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
      title: editTitle.trim(),
      status: editStatus,
      notes: isPaidUser ? editNotes.trim() || undefined : undefined,
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
    setShowEditDialog(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleToggleTask = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Không cần truyền isCompleted vì hàm handleToggleCompleted sẽ đảo ngược giá trị hiện tại
    const updatedData: Partial<Task> = {
      title: task.title, // Sử dụng title hiện tại
      status: task.status, // Sử dụng status hiện tại
      notes: task.notes, // Sử dụng notes hiện tại
    };

    handleToggleCompleted(task.id, updatedData);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    // Dừng lan truyền sự kiện để tránh xung đột
    e.stopPropagation();

    // Thiết lập dữ liệu kéo thả
    const dragEvent = e.nativeEvent as unknown as React.DragEvent;
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.setData('text/plain', task.id);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="flex flex-col bg-gray-800 rounded-md p-1.5 sm:p-2 border border-gray-700 hover:border-gray-500 w-full gap-1.5"
      >
        <div className="flex items-start gap-2">
          <div className="cursor-move self-center" {...listeners}>
            <GripVertical size={14} className="text-gray-500" />
          </div>

          <div className="flex items-start justify-between gap-2 w-full">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <button onClick={handleToggleTask} className="flex-shrink-0 mt-0.5">
                {task.isCompleted ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-gray-400" />
                )}
              </button>
              <span
                className={`${
                  task.isCompleted ? 'line-through text-gray-500' : 'text-gray-200'
                } text-sm sm:text-base break-words`}
              >
                {task.title}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs text-gray-500">{task.createdAt.toLocaleDateString()}</span>
              <div className="relative z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Thay đổi logic hiển thị options
                    if (showOptions) {
                      setActiveOptionsTaskId(null);
                    } else {
                      // Đóng menu của column nếu đang mở
                      setActiveOptionsColumnId(null);
                      // Mở menu của task
                      setActiveOptionsTaskId(task.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <MoreHorizontal size={16} />
                </button>

                {showOptions && (
                  <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded shadow-lg py-1 z-50 min-w-40 border border-gray-700">
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
        </div>

        {isPaidUser && task.notes && (
          <div className="mt-1 pl-5">
            <button
              type="button"
              className="flex items-center text-xs text-gray-400 hover:text-gray-300 w-full py-0.5"
              onClick={toggleNotes}
            >
              {showNotes ? (
                <ChevronDown size={10} className="mr-1 flex-shrink-0" />
              ) : (
                <ChevronRight size={10} className="mr-1 flex-shrink-0" />
              )}
              <span className="whitespace-nowrap">Notes</span>
            </button>
            {showNotes && (
              <div className="mt-0.5 text-xs text-gray-400 pl-3 border-l border-gray-700 overflow-x-auto">
                {task.notes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            // Reset form when dialog closes
            setEditTitle(task.title);
            setEditNotes(task.notes || '');
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
