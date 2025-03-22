// src/components/AddStatusForm.tsx
import React, { useState } from 'react';

interface AddStatusFormProps {
  onAdd: (title: string) => void;
  onCancel: () => void;
}

const AddStatusForm: React.FC<AddStatusFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  
  const handleSubmit = () => {
    if (title.trim() === '') return;
    onAdd(title);
    setTitle('');
  };
  
  return (
    <div className="mb-4 p-3 sm:p-4 bg-gray-800 rounded-md w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="New Status Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleSubmit}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap"
          >
            Add
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStatusForm;