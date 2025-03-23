import { TodoStatus } from '@/types';

// Danh sách các trạng thái với mô tả
export const STATUS_LIST: { value: TodoStatus; description: string }[] = [
  { value: TodoStatus.TODO, description: 'Chưa bắt đầu' },
  { value: TodoStatus.IN_PROGRESS, description: 'Đang thực hiện' },
  { value: TodoStatus.BLOCKED, description: 'Bị chặn' },
  { value: TodoStatus.REVIEW, description: 'Đang xem xét' },
  { value: TodoStatus.DONE, description: 'Hoàn thành' },
  { value: TodoStatus.CANCELED, description: 'Hủy bỏ' },
];

// Danh sách giá trị trạng thái đơn giản
export const allStatuses = [
  TodoStatus.TODO,
  TodoStatus.IN_PROGRESS,
  TodoStatus.BLOCKED,
  TodoStatus.REVIEW,
  TodoStatus.DONE,
  TodoStatus.CANCELED,
];
