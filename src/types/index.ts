export type Status = 'TO DO' | 'IN PROGRESS' | 'DONE';
export type LayoutType = 'kanban' | 'accordion';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  notes?: string;
  status: Status;
}

export interface StatusColumn {
  id: string;
  title: Status;
  tasks: Task[];
}