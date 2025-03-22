import { LayoutType, Status, StatusColumn, Task } from '@/types';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import AddStatusForm from './components/AddStatusForm';
import KanbanColumn from './components/KanbanColumn';
import AccordionStatus from './components/AccordionStatus';
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors 
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanAddColumn from './components/KanbanAddColumn';
import { PlusCircle } from 'lucide-react';

const initialColumns: StatusColumn[] = [
  {
    id: '1',
    title: 'TO DO',
    tasks: [
      {
        id: 'task-2',
        title: 'Task 2',
        completed: false,
        createdAt: new Date(),
        status: 'TO DO',
        notes: 'Need to start this soon.',
      },
      { id: 'task-3', title: 'Task 3', completed: false, createdAt: new Date(), status: 'TO DO' },
    ],
  },
  {
    id: '2',
    title: 'IN PROGRESS',
    tasks: [
      {
        id: 'task-1',
        title: 'Task 1',
        completed: false,
        createdAt: new Date(),
        status: 'IN PROGRESS',
        notes: 'Working on this now, should be done by Friday.',
      },
    ],
  },
  {
    id: '3',
    title: 'DONE',
    tasks: [],
  },
];

function Dashboard() {
  const { userRole } = useLoaderData();
  const navigate = useNavigate();

  const [columns, setColumns] = useState<StatusColumn[]>(initialColumns);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [addingTaskToColumnId, setAddingTaskToColumnId] = useState<string | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(true);
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>('list');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

  // Configure sensors for both mouse/touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 50,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
        pressure: 0,
      },
    })
  );

  useEffect(() => {
    if (!window.location.search.includes('userRole')) {
      navigate(`/dashboard?userRole=${userRole}`, { replace: true });
    }
  }, [userRole, navigate]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    
    if (activeData?.type === 'task') {
      setDraggingTaskId(active.id as string);
    } else if (activeData?.type === 'column') {
      setDraggingColumnId(active.id as string);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Skip if nothing changed
    if (activeId === overId) return;

    // Handle task movement
    if (activeData?.type === 'task') {
      // Find source and target columns
      const activeColumn = columns.find(col => 
        col.tasks.some(task => task.id === activeId)
      );
      
      // Case 1: Dragging over another task (reordering or changing column)
      if (overData?.type === 'task') {
        const overTask = overData.task;
        const overColumn = columns.find(col => 
          col.tasks.some(task => task.id === overId)
        );
        
        if (!activeColumn || !overColumn) return;
        
        setColumns(prev => {
          // Get the active task
          const activeTask = activeColumn.tasks.find(task => task.id === activeId);
          if (!activeTask) return prev;
          
          return prev.map(col => {
            // Handle reordering within the same column
            if (col.id === activeColumn.id && col.id === overColumn.id) {
              const oldIndex = col.tasks.findIndex(task => task.id === activeId);
              const newIndex = col.tasks.findIndex(task => task.id === overId);
              
              const newTasks = [...col.tasks];
              newTasks.splice(oldIndex, 1);
              newTasks.splice(newIndex, 0, activeTask);
              
              return {
                ...col,
                tasks: newTasks
              };
            }
            
            // Remove from source column
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: col.tasks.filter(task => task.id !== activeId)
              };
            }
            
            // Add to target column
            if (col.id === overColumn.id) {
              const overTaskIndex = col.tasks.findIndex(task => task.id === overId);
              const newTasks = [...col.tasks];
              
              // Insert at the right position
              newTasks.splice(overTaskIndex, 0, {...activeTask, status: col.title});
              
              return {
                ...col,
                tasks: newTasks
              };
            }
            
            return col;
          });
        });
      }
      
      // Case 2: Dragging over a column
      else if (overData?.type === 'column') {
        const overColumn = columns.find(col => col.id === overId);
        if (!activeColumn || !overColumn) return;
        
        setColumns(prev => {
          const activeTask = activeColumn.tasks.find(task => task.id === activeId);
          if (!activeTask) return prev;
          
          return prev.map(col => {
            // Remove from source column
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: col.tasks.filter(task => task.id !== activeId)
              };
            }
            
            // Add to target column
            if (col.id === overColumn.id) {
              return {
                ...col,
                tasks: [...col.tasks, {...activeTask, status: col.title}]
              };
            }
            
            return col;
          });
        });
      }
    }
    
    // Handle column reordering
    else if (activeData?.type === 'column' && overData?.type === 'column') {
      setColumns(prev => {
        const oldIndex = prev.findIndex(col => col.id === activeId);
        const newIndex = prev.findIndex(col => col.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      // Nếu không thả vào đâu cả, reset state
      setDraggingTaskId(null);
      setDraggingColumnId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // Nếu kéo thả vào cùng một chỗ, không làm gì cả
    if (activeId === overId) {
      setDraggingTaskId(null);
      setDraggingColumnId(null);
      return;
    }
    
    // Xử lý kéo thả columns
    if (activeData?.type === 'column' && overData?.type === 'column') {
      setColumns(prev => {
        const oldIndex = prev.findIndex(col => col.id === activeId);
        const newIndex = prev.findIndex(col => col.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
    
    // Reset các state
    setDraggingTaskId(null);
    setDraggingColumnId(null);
  };

  // Add new task
  const handleAddTask = (columnId: string, title: string) => {
    if (title.trim() === '') return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title,
      completed: false,
      createdAt: new Date(),
      status: columns.find((col) => col.id === columnId)?.title as Status,
    };

    const newColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, newTask],
        };
      }
      return col;
    });

    setColumns(newColumns);
    setAddingTaskToColumnId(null);
  };

  // Add new status column
  const handleAddStatus = (title: string) => {
    if (title.trim() === '') return;

    const newColumn: StatusColumn = {
      id: `column-${Date.now()}`,
      title: title as Status,
      tasks: [],
    };

    setColumns([...columns, newColumn]);
    setShowAddStatus(false);
  };

  // Hàm xử lý cập nhật task
  const handleUpdateTask = (taskId: string, updatedData: Partial<Task>) => {
    setColumns(prev => 
      prev.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === taskId 
            ? { ...task, ...updatedData } 
            : task
        )
      }))
    );
    setEditingTaskId(null);
  };

  // Hàm xử lý xóa task
  const handleDeleteTask = (taskId: string) => {
    setColumns(prev => 
      prev.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }))
    );
  };

  // Hàm xử lý cập nhật column
  const handleUpdateColumn = (columnId: string, newTitle: string) => {
    if (newTitle.trim() === '') return;
    
    setColumns(prev => 
      prev.map(column => 
        column.id === columnId 
          ? { ...column, title: newTitle as Status } 
          : column
      )
    );
    setEditingColumnId(null);
  };

  // Hàm xử lý xóa column
  const handleDeleteColumn = (columnId: string) => {
    setColumns(prev => prev.filter(column => column.id !== columnId));
  };

  // Hàm toggle completed status
  const handleToggleCompleted = (taskId: string) => {
    setColumns(prev => 
      prev.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: !task.completed } 
            : task
        )
      }))
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white w-full">
      {/* Header section với 2 nút tách biệt - List đặt trước vì là mặc định */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-2 sm:p-4 border-b border-gray-700/50 w-full">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <div className="flex items-center gap-3">
            {/* Nút List riêng biệt đặt trước */}
            <button
              onClick={() => setLayoutType('list')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                layoutType === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              List
            </button>
            
            {/* Nút Kanban riêng biệt */}
            <button
              onClick={() => setLayoutType('kanban')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                layoutType === 'kanban' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Main content - improved styling */}
      <div className="flex-1 w-full">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {layoutType === 'kanban' ? (
            <div className="flex gap-2 overflow-x-auto pb-4 min-h-[calc(100vh-120px)] p-2 sm:p-4">
              <SortableContext 
                items={columns.map(col => col.id)}
                strategy={verticalListSortingStrategy}
              >
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    isPaidUser={isPaidUser}
                    addingTaskToColumnId={addingTaskToColumnId}
                    setAddingTaskToColumnId={setAddingTaskToColumnId}
                    handleAddTask={handleAddTask}
                    handleUpdateColumn={handleUpdateColumn}
                    handleDeleteColumn={handleDeleteColumn}
                    editingColumnId={editingColumnId}
                    setEditingColumnId={setEditingColumnId}
                    editingTaskId={editingTaskId}
                    setEditingTaskId={setEditingTaskId}
                    handleUpdateTask={handleUpdateTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleCompleted={handleToggleCompleted}
                  />
                ))}
              </SortableContext>
              <KanbanAddColumn onAdd={handleAddStatus} />
            </div>
          ) : (
            <div className="w-full p-2 sm:p-4">
              <SortableContext 
                items={columns.map(col => col.id)}
                strategy={verticalListSortingStrategy}
              >
                {columns.map((column) => (
                  <AccordionStatus
                    key={column.id}
                    column={column}
                    isPaidUser={isPaidUser}
                    addingTaskToColumnId={addingTaskToColumnId}
                    setAddingTaskToColumnId={setAddingTaskToColumnId}
                    handleAddTask={handleAddTask}
                    handleDragStart={handleDragStart}
                    editingTaskId={editingTaskId}
                    setEditingTaskId={setEditingTaskId}
                    handleUpdateTask={handleUpdateTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleCompleted={handleToggleCompleted}
                    handleUpdateColumn={handleUpdateColumn}
                    handleDeleteColumn={handleDeleteColumn}
                  />
                ))}
              </SortableContext>
              
              <button
                onClick={() => setShowAddStatus(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
              >
                <PlusCircle size={20} />
                <span className="font-medium">Add Status</span>
              </button>
              
              {showAddStatus && (
                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <AddStatusForm 
                    onAdd={handleAddStatus} 
                    onCancel={() => setShowAddStatus(false)} 
                  />
                </div>
              )}
            </div>
          )}
        </DndContext>
      </div>
    </div>
  );
}

export default Dashboard;
