export enum TodoStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  BLOCKED = 'Blocked',
  REVIEW = 'Review',
  DONE = 'Done',
  CANCELED = 'Canceled',
}

export type Status = TodoStatus;

export interface Task {
  id: string;
  title: string;
  status: Status;
  isCompleted: boolean;
  createdAt: Date;
  note?: string;
}

export interface StatusColumn {
  id: string;
  title: Status;
  tasks: Task[];
}

export type LayoutType = 'kanban' | 'list';
