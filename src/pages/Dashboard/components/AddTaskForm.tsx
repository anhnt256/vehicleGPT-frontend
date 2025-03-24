import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Status, TodoStatus } from '@/types';
import { allStatuses } from '@/utils/constants';

interface AddTaskFormProps {
  onAdd: (title: string, note?: string) => void;
  onCancel: () => void;
  defaultStatus?: Status;
  isPaidUser?: boolean;
  statusOptions?: Status[];
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onAdd,
  onCancel,
  defaultStatus = TodoStatus.TODO,
  isPaidUser = false,
  statusOptions = allStatuses,
}) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      console.log('AddTaskForm - onAdd được gọi với:', title, status, note);
      onAdd(title.trim(), isPaidUser ? note.trim() || undefined : undefined);
      setTitle('');
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-gray-700 rounded-md p-3 mt-3">
      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Enter task title..."
            value={title}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            value={status}
            disabled
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {isPaidUser && (
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note (optional)"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white min-h-[80px]"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>

          <button
            type="submit"
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!title.trim()}
          >
            <PlusCircle size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
