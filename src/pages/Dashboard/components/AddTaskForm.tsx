import React, { useState } from 'react';

interface AddTaskFormProps {
  onAdd: (title: string) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  
  const handleSubmit = () => {
    if (title.trim() === '') return;
    onAdd(title);
    setTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className="bg-gray-700 p-2 sm:p-3 rounded-md w-full">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={handleSubmit}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm whitespace-nowrap"
          >
            Add
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-500 px-3 py-1.5 rounded text-sm whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;