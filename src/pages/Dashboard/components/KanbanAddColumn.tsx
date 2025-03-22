import React, { useState } from 'react';
import { PlusCircle, X, Check } from 'lucide-react';

interface KanbanAddColumnProps {
  onAdd: (title: string) => void;
}

const KanbanAddColumn: React.FC<KanbanAddColumnProps> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="flex-shrink-0 w-[320px] md:w-[350px] h-min flex flex-col bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-700">
        <button
          onClick={() => setIsAdding(true)}
          className="flex flex-col items-center justify-center w-full py-6 hover:bg-gray-800/40 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <PlusCircle size={28} className="mb-2" />
          <span className="font-medium">Add Status</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-[320px] md:w-[350px] flex flex-col bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-3 sm:p-4 bg-gray-700">
        <div className="mb-2">
          <label className="text-sm font-medium text-gray-300 mb-1 block">
            Status Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 text-white text-sm py-2 px-3 rounded w-full"
            placeholder="e.g., TO DO, IN PROGRESS..."
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => setIsAdding(false)}
            className="p-1.5 rounded bg-gray-800 text-red-500 hover:bg-gray-700"
          >
            <X size={18} />
          </button>
          <button
            onClick={handleSubmit}
            className="p-1.5 rounded bg-gray-800 text-green-500 hover:bg-gray-700"
            disabled={!title.trim()}
          >
            <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanAddColumn; 