import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { updateUserRole } from '@/lib/api/updateUserRole';

interface UpgradeButtonProps {
  className?: string;
}

export const UpgradeButton = ({ className = '' }: UpgradeButtonProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpgrade = async () => {
    if (!user || !user.primaryEmailAddress) {
      console.error('Không tìm thấy thông tin người dùng');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Lấy email từ user hiện tại
      const email = user.primaryEmailAddress.emailAddress;
      
      // Gọi API cập nhật role
      await updateUserRole(email, 'paid');
      
      // Redirect lại trang dashboard với vai trò mới
      navigate('/dashboard?userRole=paid', { replace: true });
      
      // Hiển thị thông báo thành công
      alert('Chúc mừng! Bạn đã nâng cấp lên tài khoản Premium.');
    } catch (error) {
      console.error('Lỗi khi nâng cấp tài khoản:', error);
      alert('Có lỗi xảy ra khi nâng cấp tài khoản. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </span>
      ) : (
        'Nâng cấp ngay'
      )}
    </button>
  );
}; 