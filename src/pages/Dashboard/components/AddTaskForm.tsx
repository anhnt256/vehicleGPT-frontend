import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Status } from '@/types';

interface AddTaskFormProps {
  onAdd: (title: string, status?: Status, notes?: string) => void;
  onCancel: () => void;
  defaultStatus?: Status;
  isPaidUser?: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ 
  onAdd, 
  onCancel, 
  defaultStatus = 'TO DO', 
  isPaidUser = false 
}) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), status, isPaidUser ? (notes.trim() || undefined) : undefined);
      setTitle('');
      setNotes('');
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
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white"
            autoFocus
          />
        </div>
        
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white"
          >
            <option value="TO DO">TO DO</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        
        {isPaidUser && (
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)"
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