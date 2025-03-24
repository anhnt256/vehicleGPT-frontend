import { LayoutType, Status, StatusColumn, Task } from '@/types';
import { useEffect, useState, useRef } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createTodo } from '@/lib/api/createTodo';
import { allStatuses } from '@/utils/constants';
import { TodoStatus as TodoStatusType } from '@/types';
import { getTodos } from '@/lib/api/getTodos';
import { updateTodo } from '@/lib/api/updateTodo';
import { deleteTodo } from '@/lib/api/deleteTodo';
import { useAuthToken } from '@/lib/utils/auth';
import { getAPITokenFromStorage } from '@/lib/utils/auth';
import { getAuthTokenFromCookie, getCookie } from '@/lib/utils/cookie';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const initialColumns: StatusColumn[] = [
  {
    id: '1',
    title: TodoStatusType.TODO,
    tasks: [
      {
        id: 'task-2',
        title: 'Task 2',
        isCompleted: false,
        createdAt: new Date(),
        status: TodoStatusType.TODO,
        note: 'Need to start this soon.',
      },
      {
        id: 'task-3',
        title: 'Task 3',
        isCompleted: true,
        createdAt: new Date(),
        status: TodoStatusType.TODO,
      },
    ],
  },
  {
    id: '2',
    title: TodoStatusType.IN_PROGRESS,
    tasks: [
      {
        id: 'task-1',
        title: 'Task 1',
        isCompleted: false,
        createdAt: new Date(),
        status: TodoStatusType.IN_PROGRESS,
        note: 'Working on this now, should be done by Friday.',
      },
    ],
  },
  {
    id: '3',
    title: TodoStatusType.BLOCKED,
    tasks: [],
  },
  {
    id: '4',
    title: TodoStatusType.REVIEW,
    tasks: [],
  },
  {
    id: '5',
    title: TodoStatusType.DONE,
    tasks: [],
  },
  {
    id: '6',
    title: TodoStatusType.CANCELED,
    tasks: [],
  },
];

function Dashboard() {
  useDocumentTitle('Dashboard | Super Todo is super tool with AI');
  const { userRole } = useLoaderData();
  const navigate = useNavigate();

  const [columns, setColumns] = useState<StatusColumn[]>(initialColumns);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [addingTaskToColumnId, setAddingTaskToColumnId] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<LayoutType>('list');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [activeOptionsTaskId, setActiveOptionsTaskId] = useState<string | null>(null);
  const [activeOptionsColumnId, setActiveOptionsColumnId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const [activeDropId, setActiveDropId] = useState<string | null>(null);
  const [activeDropType, setActiveDropType] = useState<'before' | 'after' | 'inside' | null>(null);

  // Sử dụng hook trong component
  const { getAuthToken } = useAuthToken();

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
      },
    })
  );

  useEffect(() => {
    if (!window.location.search.includes('userRole')) {
      // Lấy userRole từ cookie
      const cookieRole = getCookie('userRole') || 'free';
      navigate(`/dashboard?userRole=${cookieRole}`, { replace: true });
    }
  }, [navigate]);

  // Fetch todos khi component mount
  useEffect(() => {
    // Sử dụng biến cờ bên ngoài useEffect để tránh gọi lại
    if (hasFetchedRef.current) {
      return;
    }

    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Đánh dấu ngay từ đầu để tránh multiple calls
        hasFetchedRef.current = true;

        // Lấy token trong component
        let token = await getAuthToken();
        if (!token) {
          token = await getAPITokenFromStorage();
        }

        // Truyền token vào API
        const todos = await getTodos();

        // Map trực tiếp, không cần chuyển đổi tên trường
        const mappedTodos = todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          status: todo.status as Status,
          isCompleted: todo.isCompleted,
          createdAt: new Date(todo.createdAt),
          note: todo.note || undefined,
        }));

        // Biến đổi dữ liệu để phù hợp với cấu trúc columns
        const todosByStatus = mappedTodos.reduce(
          (acc, todo) => {
            if (!acc[todo.status]) {
              acc[todo.status] = [];
            }
            acc[todo.status].push(todo);
            return acc;
          },
          {} as Record<Status, Task[]>
        );

        // Cập nhật columns với dữ liệu từ API
        const updatedColumns = initialColumns.map((column) => ({
          ...column,
          tasks: todosByStatus[column.title] || [],
        }));

        setColumns(updatedColumns);
      } catch (err) {
        console.error('Error loading todos:', err);
        setError('Could not load data. Please try again later.');
        // Reset flag nếu có lỗi để có thể thử lại
        hasFetchedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();

    // Quan trọng: LOẠI BỎ TẤT CẢ DEPENDENCIES không cần thiết
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi mount

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    // Đóng tất cả các menu options khi bắt đầu kéo
    setActiveOptionsTaskId(null);
    setActiveOptionsColumnId(null);

    if (activeData?.type === 'task') {
      setDraggingTaskId(active.id as string);
      const taskId = active.id as string;
      const taskColumn = columns.find((col) => col.tasks.some((task) => task.id === taskId));
      if (taskColumn) {
        const task = taskColumn.tasks.find((t) => t.id === taskId);
        if (task) setActiveTask(task);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveDropId(null);
      setActiveDropType(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Chỉ xử lý kéo thả của task
    if (activeData?.type !== 'task') return;

    // Reset nếu kéo vào chính nó
    if (activeId === overId) {
      setActiveDropId(null);
      setActiveDropType(null);
      return;
    }

    // Xử lý kéo vào task
    if (overData?.type === 'task') {
      // Tính toán vị trí tương đối (trên/dưới)
      const overRect = over.rect;
      const overCenter = overRect.top + overRect.height / 2;

      // Instead of event.clientY, use coordinates from the activator event
      const clientY =
        event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientY : overCenter;

      // Use this value for positioning
      const pointerPosition = clientY;

      // Xác định vị trí dự kiến (trước hay sau task)
      const isBeforeTask = pointerPosition < overCenter;

      setActiveDropId(overId);
      setActiveDropType(isBeforeTask ? 'before' : 'after');
    }
    // Xử lý kéo vào drop zone của column
    else if (overData?.type === 'column-drop-zone') {
      const columnId = overData.columnId;
      setActiveDropId(columnId);
      setActiveDropType('inside');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset các state
    setDraggingTaskId(null);
    setDraggingColumnId(null);
    setActiveTask(null);
    setActiveDropId(null);
    setActiveDropType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Chỉ xử lý task
    if (activeData?.type !== 'task') return;

    // Tìm task đang kéo
    let sourceColumn: StatusColumn | undefined;
    let sourceTask: Task | undefined;
    let sourceColumnIndex = -1;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const taskIndex = column.tasks.findIndex((task) => task.id === activeId);
      if (taskIndex >= 0) {
        sourceColumn = column;
        sourceTask = column.tasks[taskIndex];
        sourceColumnIndex = i;
        break;
      }
    }

    if (!sourceColumn || !sourceTask) return;

    // Xử lý 3 trường hợp: kéo vào task khác, kéo vào column trực tiếp, hoặc kéo vào dropzone
    if (overData?.type === 'task') {
      // Kéo vào task khác
      let targetColumn: StatusColumn | undefined;
      let targetIndex = -1;
      let targetColumnIndex = -1;

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const taskIndex = column.tasks.findIndex((task) => task.id === overId);
        if (taskIndex >= 0) {
          targetColumn = column;
          targetIndex = taskIndex;
          targetColumnIndex = i;
          break;
        }
      }

      if (!targetColumn) return;

      // Tạo bản sao của state
      const newColumns = [...columns];

      // Xóa task khỏi column nguồn
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: sourceColumn.tasks.filter((task) => task.id !== activeId),
      };

      // Nếu là cùng một column
      if (sourceColumnIndex === targetColumnIndex) {
        // Chèn task vào vị trí mới trong cùng column
        const newTasks = [...newColumns[sourceColumnIndex].tasks];
        newTasks.splice(targetIndex, 0, sourceTask);

        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          tasks: newTasks,
        };
      } else {
        // Nếu khác column, cập nhật status của task
        const updatedTask = {
          ...sourceTask,
          status: targetColumn.title,
        };

        // Chèn task vào column đích
        const newTasks = [...targetColumn.tasks];
        newTasks.splice(targetIndex, 0, updatedTask);

        newColumns[targetColumnIndex] = {
          ...targetColumn,
          tasks: newTasks,
        };

        // Đồng bộ với server nếu cần
        updateTaskOnServer(activeId, { status: targetColumn.title });
      }

      setColumns(newColumns);
    } else if (overData?.type === 'column-drop-zone') {
      // Xử lý kéo vào drop zone trong column
      const targetColumnId = overData.columnId;
      const targetColumn = columns.find((col) => col.id === targetColumnId);

      if (!targetColumn) return;

      // Tạo bản sao của state
      const newColumns = [...columns];

      // Xóa task khỏi column nguồn
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: sourceColumn.tasks.filter((task) => task.id !== activeId),
      };

      // Cập nhật status của task
      const updatedTask = {
        ...sourceTask,
        status: targetColumn.title,
      };

      // Tìm index của column đích
      const targetColumnIndex = columns.findIndex((col) => col.id === targetColumnId);

      // Thêm task vào cuối column đích
      newColumns[targetColumnIndex] = {
        ...targetColumn,
        tasks: [...targetColumn.tasks, updatedTask],
      };

      setColumns(newColumns);

      // Đồng bộ với server
      updateTaskOnServer(activeId, { status: targetColumn.title });
    } else if (overData?.type === 'column') {
      // Kéo vào column
      const targetColumnId = overId;
      const targetColumn = columns.find((col) => col.id === targetColumnId);

      if (!targetColumn) return;

      // Tạo bản sao của state
      const newColumns = [...columns];

      // Xóa task khỏi column nguồn
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: sourceColumn.tasks.filter((task) => task.id !== activeId),
      };

      // Cập nhật status của task
      const updatedTask = {
        ...sourceTask,
        status: targetColumn.title,
      };

      // Tìm index của column đích
      const targetColumnIndex = columns.findIndex((col) => col.id === targetColumnId);

      // Thêm task vào cuối column đích
      newColumns[targetColumnIndex] = {
        ...targetColumn,
        tasks: [...targetColumn.tasks, updatedTask],
      };

      setColumns(newColumns);

      // Đồng bộ với server nếu cần
      updateTaskOnServer(activeId, { status: targetColumn.title });
    }
  };

  // Hàm hỗ trợ đồng bộ với server
  const updateTaskOnServer = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      const token = getAuthTokenFromCookie();
      await updateTodo(taskId, token, updatedData);
    } catch (error) {
      console.error('Error updating task on server:', error);
      // Có thể thêm logic rollback UI nếu cần
    }
  };

  // Add new task
  const handleAddTask = async (
    columnId: string,
    title: string,
    notes?: string
  ) => {
    if (!title.trim()) return;

    try {
      setIsLoading(true);

      // Lấy token từ cookie
      const token = getAuthTokenFromCookie();

      // Xác định status dựa trên column mà người dùng đang thêm
      const columnStatus = columns.find((col) => col.id === columnId)?.title || TodoStatusType.TODO;

      // Tạo task trên server
      const response = await createTodo(title, columnStatus, token, notes);

      if (response.errors) {
        toast.error('Error creating task: ' + response.errors.join(', '));
        return;
      }

      // Nếu server trả về dữ liệu hợp lệ
      if (response.data && response.data.id) {
        // Tạo task mới với dữ liệu từ API
        const newTask: Task = {
          id: response.data.id,
          title: response.data.title || title,
          status: columnStatus, // Sử dụng status của column hiện tại
          isCompleted: columnStatus === TodoStatusType.DONE,
          createdAt: new Date(response.data.createdAt),
          note: response.data.note || notes || undefined,
        };

        // Sử dụng requestAnimationFrame để cập nhật UI mượt mà
        requestAnimationFrame(() => {
          // Thêm task vào đúng column mà người dùng đã chọn
          setColumns((prev) =>
            prev.map((col) => {
              if (col.id === columnId) {
                return {
                  ...col,
                  tasks: [...col.tasks, newTask],
                };
              }
              return col;
            })
          );

          // Hiển thị toast thành công
          setTimeout(() => {
            toast.success('Task created successfully');
          }, 100);
        });
      } else {
        toast.error('Cannot create task: Missing data from API');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('An error occurred while creating the task. Please try again later.');
    } finally {
      setIsLoading(false);
      setAddingTaskToColumnId(null);
    }
  };

  // Hàm xử lý cập nhật task
  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    try {
      const token = getAuthTokenFromCookie();

      // Tạo bản sao của data để không ảnh hưởng tới dữ liệu gốc
      const updateData = { ...data };

      // Nếu status là DONE, tự động đánh dấu completed
      if (data.status === TodoStatusType.DONE) {
        updateData.isCompleted = true;
      }

      // Gọi API cập nhật task với dữ liệu đã được điều chỉnh
      const updatedTodo = await updateTodo(taskId, token, updateData);

      console.log('updatedTodo', updatedTodo);

      if (updatedTodo.errors) {
        toast.error('Error updating task: ' + updatedTodo.errors.join(', '));
        return;
      }

      toast.success('Task updated successfully');
      // Cập nhật lại state columns với task đã được cập nhật
      setColumns((prevColumns) => {
        // Tìm column chứa task cần cập nhật
        const columnWithTask = prevColumns.find((column) =>
          column.tasks.some((task) => task.id === taskId)
        );

        if (!columnWithTask) return prevColumns;

        // Tạo bản sao của task cần cập nhật
        const taskToUpdate = { ...columnWithTask.tasks.find((task) => task.id === taskId)! };

        // Cập nhật dữ liệu task
        const updatedTask = { ...taskToUpdate, ...updateData };

        // Nếu status thay đổi, di chuyển task giữa các column
        if (updateData.status && updateData.status !== taskToUpdate.status) {
          // Tìm column đích dựa trên status mới
          const targetColumn = prevColumns.find((col) => col.title === updateData.status);

          if (!targetColumn) return prevColumns;

          return prevColumns.map((column) => {
            // Xóa task khỏi column cũ
            if (column.id === columnWithTask.id) {
              return {
                ...column,
                tasks: column.tasks.filter((task) => task.id !== taskId),
              };
            }
            // Thêm task vào column mới
            if (column.id === targetColumn.id) {
              return {
                ...column,
                tasks: [...column.tasks, updatedTask],
              };
            }
            return column;
          });
        }

        // Nếu status không thay đổi, chỉ cập nhật task
        return prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updateData } : task
          ),
        }));
      });

      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('An error occurred while updating the task. Please try again later.');
    }
  };

  // Hàm xử lý xóa task
  const handleDeleteTask = async (taskId: string) => {
    try {
      // Lấy token từ local storage
      const token = getAuthTokenFromCookie();

      // Gọi API xóa todo
      const success = await deleteTodo(taskId, token);

      if (success) {
        // Cập nhật UI sau khi xóa thành công
        setColumns((prev) =>
          prev.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }))
        );
        toast.success('Task deleted successfully');
      } else {
        console.warn('API returned unsuccessful deletion result');
        toast.error('An error occurred while deleting the task. Please try again later.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Vẫn xóa trên UI dù API lỗi để đồng bộ trạng thái
      setColumns((prev) =>
        prev.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        }))
      );
    }
  };

  // Hàm xử lý cập nhật column
  const handleUpdateColumn = (columnId: string, newTitle: string) => {
    if (newTitle.trim() === '') return;

    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId ? { ...column, title: newTitle as Status } : column
      )
    );
    setEditingColumnId(null);
  };

  // Hàm xử lý xóa column
  const handleDeleteColumn = (columnId: string) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnId));
  };

  // Hàm toggle completed status
  const handleToggleCompleted = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      // Tìm task hiện tại
      let currentTask: Task | undefined;
      for (const column of columns) {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) {
          currentTask = task;
          break;
        }
      }

      if (!currentTask) return;

      // Lấy token từ local storage
      const token = getAuthTokenFromCookie();

      // Gọi API cập nhật isCompleted, kết hợp dữ liệu từ updatedData và currentTask
      await updateTodo(taskId, token, {
        // Ưu tiên dữ liệu từ updatedData, nếu không có thì lấy từ currentTask
        title: updatedData.title || currentTask.title,
        status: updatedData.status || currentTask.status,
        // Đảo ngược trạng thái isCompleted hiện tại
        isCompleted: !currentTask.isCompleted,
        note: updatedData.note || currentTask.note,
      });

      // Cập nhật UI
      setColumns((prev) =>
        prev.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        }))
      );
    } catch (error) {
      console.error('Error updating completion status:', error);
      // Vẫn cập nhật UI dù API lỗi
    }
  };

  const isPaidUser = userRole === 'paid';

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Header section */}
          <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-2 sm:p-4 border-b border-gray-700/50 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div className="flex items-center gap-3">
                {/* Nút List luôn hiển thị cho tất cả người dùng */}
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

                {/* Chỉ hiển thị nút Kanban cho người dùng có subscription paid */}
                {userRole === 'paid' && (
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
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 mb-4 rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="flex-1 w-full">
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                {layoutType === 'kanban' && userRole === 'paid' ? (
                  <div className="flex gap-2 overflow-x-auto pb-4 min-h-[calc(100vh-120px)] p-2 sm:p-4">
                    <SortableContext
                      items={columns.map((col) => col.id)}
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
                          activeOptionsTaskId={activeOptionsTaskId}
                          setActiveOptionsTaskId={setActiveOptionsTaskId}
                          activeOptionsColumnId={activeOptionsColumnId}
                          setActiveOptionsColumnId={setActiveOptionsColumnId}
                          draggingTaskId={draggingTaskId}
                          statusOptions={allStatuses}
                          activeDropId={activeDropId}
                          activeDropType={activeDropType}
                        />
                      ))}
                    </SortableContext>
                  </div>
                ) : (
                  <div className="w-full p-2 sm:p-4">
                    {columns.map((column) => (
                      <AccordionStatus
                        key={column.id}
                        column={column}
                        isPaidUser={isPaidUser}
                        addingTaskToColumnId={addingTaskToColumnId}
                        setAddingTaskToColumnId={setAddingTaskToColumnId}
                        handleAddTask={handleAddTask}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                        handleUpdateTask={handleUpdateTask}
                        handleDeleteTask={handleDeleteTask}
                        handleToggleCompleted={handleToggleCompleted}
                        handleUpdateColumn={handleUpdateColumn}
                        handleDeleteColumn={handleDeleteColumn}
                        activeOptionsTaskId={activeOptionsTaskId}
                        setActiveOptionsTaskId={setActiveOptionsTaskId}
                        activeOptionsColumnId={activeOptionsColumnId}
                        setActiveOptionsColumnId={setActiveOptionsColumnId}
                        statusOptions={allStatuses}
                      />
                    ))}
                  </div>
                )}

                {/* Thêm DragOverlay để hiển thị task đang kéo */}
                <DragOverlay>
                  {activeTask && (
                    <div
                      className="bg-gray-800/90 border border-gray-700 rounded-md p-3 shadow-xl min-w-[250px] max-w-[350px]"
                      style={{ transform: 'rotate(2deg)' }}
                    >
                      <div className="flex items-center gap-2">
                        {activeTask.isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                        )}
                        <span className="text-white font-medium">{activeTask.title}</span>
                      </div>
                      {activeTask.note && (
                        <div className="mt-2 text-sm text-gray-300 line-clamp-2">
                          {activeTask.note}
                        </div>
                      )}
                    </div>
                  )}

                  {draggingColumnId && !activeTask && (
                    <div
                      className="flex-shrink-0 w-[320px] flex flex-col bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl opacity-95"
                      style={{ transform: 'rotate(1deg)' }}
                    >
                      <div className="p-3 bg-gray-700 flex items-center">
                        <span className="text-white font-medium ml-2">
                          {columns.find((col) => col.id === draggingColumnId)?.title}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-800 h-[100px] flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Column Content</span>
                      </div>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
