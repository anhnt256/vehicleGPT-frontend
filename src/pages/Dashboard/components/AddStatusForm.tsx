// src/components/AddStatusForm.tsx
import React, { useState } from 'react';
import { allStatuses } from '@/utils/constants';
import { Status } from '@/types';

interface AddStatusFormProps {
  onAdd: (title: string) => void;
  onCancel: () => void;
  existingStatuses?: Status[]; // Các status đã có column
}

const AddStatusForm: React.FC<AddStatusFormProps> = ({ 
  onAdd, 
  onCancel,
  existingStatuses = [] 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');
  
  // Lọc ra các status chưa có column
  const availableStatuses = allStatuses.filter(
    status => !existingStatuses.includes(status)
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus) {
      onAdd(selectedStatus);
      setSelectedStatus('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Chọn trạng thái mới
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Status)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
          >
            <option value="">-- Chọn trạng thái --</option>
            {availableStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {availableStatuses.length === 0 && (
            <p className="mt-2 text-yellow-500 text-sm">
              Tất cả trạng thái đã có column.
            </p>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedStatus || availableStatuses.length === 0}
          >
            Thêm
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddStatusForm;