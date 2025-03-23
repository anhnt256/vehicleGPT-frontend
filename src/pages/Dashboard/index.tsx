import { LayoutType, Status, StatusColumn, Task } from '@/types';
import { useEffect, useState, useRef } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
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
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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

  console.log('debug', userRole);

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
        console.log('Bắt đầu fetch dữ liệu lần đầu');
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
        console.error('Lỗi khi tải todos:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
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
      const activeColumn = columns.find((col) => col.tasks.some((task) => task.id === activeId));

      // Case 1: Dragging over another task (reordering or changing column)
      if (overData?.type === 'task') {
        const overColumn = columns.find((col) => col.tasks.some((task) => task.id === overId));

        if (!activeColumn || !overColumn) return;

        setColumns((prev) => {
          // Get the active task
          const activeTask = activeColumn.tasks.find((task) => task.id === activeId);
          if (!activeTask) return prev;

          return prev.map((col) => {
            // Handle reordering within the same column
            if (col.id === activeColumn.id && col.id === overColumn.id) {
              const oldIndex = col.tasks.findIndex((task) => task.id === activeId);
              const newIndex = col.tasks.findIndex((task) => task.id === overId);

              const newTasks = [...col.tasks];
              newTasks.splice(oldIndex, 1);
              newTasks.splice(newIndex, 0, activeTask);

              return {
                ...col,
                tasks: newTasks,
              };
            }

            // Remove from source column
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== activeId),
              };
            }

            // Add to target column
            if (col.id === overColumn.id) {
              const overTaskIndex = col.tasks.findIndex((task) => task.id === overId);
              const newTasks = [...col.tasks];

              // Insert at the right position
              newTasks.splice(overTaskIndex, 0, { ...activeTask, status: col.title });

              return {
                ...col,
                tasks: newTasks,
              };
            }

            return col;
          });
        });
      }

      // Case 2: Dragging over a column
      else if (overData?.type === 'column') {
        const overColumn = columns.find((col) => col.id === overId);
        if (!activeColumn || !overColumn) return;

        setColumns((prev) => {
          const activeTask = activeColumn.tasks.find((task) => task.id === activeId);
          if (!activeTask) return prev;

          return prev.map((col) => {
            // Remove from source column
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== activeId),
              };
            }

            // Add to target column
            if (col.id === overColumn.id) {
              return {
                ...col,
                tasks: [...col.tasks, { ...activeTask, status: col.title }],
              };
            }

            return col;
          });
        });
      }
    }

    // Handle column reordering
    else if (activeData?.type === 'column' && overData?.type === 'column') {
      setColumns((prev) => {
        const oldIndex = prev.findIndex((col) => col.id === activeId);
        const newIndex = prev.findIndex((col) => col.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Lấy dữ liệu từ đối tượng đang kéo
    const activeId = active.id as string;
    const activeData = active.data.current;

    // Reset states
    setDraggingTaskId(null);
    setDraggingColumnId(null);
    setActiveTask(null);

    // Nếu không có vùng thả, chỉ reset states - không cần làm gì thêm
    // Task/Column sẽ trở về vị trí ban đầu do không có thay đổi nào đối với state columns
    if (!over) return;

    const overId = over.id as string;

    // Nếu kéo và thả cùng một item, không làm gì cả
    if (activeId === overId) return;

    const overData = over.data.current;

    // Kiểm tra xem overData có tồn tại và có type hợp lệ không
    if (!overData || !['task', 'column'].includes(overData.type)) {
      console.log('Dropped on invalid target');
      return; // Trở về vị trí ban đầu
    }

    // Kiểm tra xem đang kéo thả Task hay Column
    if (activeData?.type === 'column' && overData.type === 'column') {
      // Xử lý kéo thả columns
      setColumns((prev) => {
        const oldIndex = prev.findIndex((col) => col.id === activeId);
        const newIndex = prev.findIndex((col) => col.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    } else if (activeData?.type === 'task') {
      // Chỉ xử lý kéo thả tasks nếu target là task hoặc column
      if (overData.type === 'task' || overData.type === 'column') {
        // Find source and target columns
        const activeColumn = columns.find((col) => col.tasks.some((task) => task.id === activeId));

        // Case: Dropping on Task
        if (overData.type === 'task') {
          const overColumn = columns.find((col) => col.tasks.some((task) => task.id === overId));

          if (!activeColumn || !overColumn) return;

          setColumns((prev) => {
            // Get the active task
            const activeTask = activeColumn.tasks.find((task) => task.id === activeId);
            if (!activeTask) return prev;

            return prev.map((col) => {
              // Handle reordering within the same column
              if (col.id === activeColumn.id && col.id === overColumn.id) {
                const oldIndex = col.tasks.findIndex((task) => task.id === activeId);
                const newIndex = col.tasks.findIndex((task) => task.id === overId);

                const newTasks = [...col.tasks];
                newTasks.splice(oldIndex, 1);
                newTasks.splice(newIndex, 0, activeTask);

                return {
                  ...col,
                  tasks: newTasks,
                };
              }

              // Remove from source column
              if (col.id === activeColumn.id) {
                return {
                  ...col,
                  tasks: col.tasks.filter((task) => task.id !== activeId),
                };
              }

              // Add to target column
              if (col.id === overColumn.id) {
                const overTaskIndex = col.tasks.findIndex((task) => task.id === overId);
                const newTasks = [...col.tasks];

                // Insert at the right position
                newTasks.splice(overTaskIndex, 0, { ...activeTask, status: col.title });

                return {
                  ...col,
                  tasks: newTasks,
                };
              }

              return col;
            });
          });
        }

        // Case: Dropping on Column
        else if (overData.type === 'column') {
          const overColumn = columns.find((col) => col.id === overId);
          if (!activeColumn || !overColumn) return;

          setColumns((prev) => {
            const activeTask = activeColumn.tasks.find((task) => task.id === activeId);
            if (!activeTask) return prev;

            return prev.map((col) => {
              // Remove from source column
              if (col.id === activeColumn.id) {
                return {
                  ...col,
                  tasks: col.tasks.filter((task) => task.id !== activeId),
                };
              }

              // Add to target column
              if (col.id === overColumn.id) {
                return {
                  ...col,
                  tasks: [...col.tasks, { ...activeTask, status: col.title }],
                };
              }

              return col;
            });
          });
        }
      } else {
        console.log('Dropped task on invalid target type');
        // Không làm gì, để task trở về vị trí ban đầu
      }
    }
  };

  // Add new task
  const handleAddTask = async (columnId: string, title: string, status?: Status, note?: string) => {
    try {
      // Lấy token từ cookie
      const token = getAuthTokenFromCookie();
      // Xác định status nếu không có
      const statusToUse = status || (columns.find((col) => col.id === columnId)?.title as Status);

      // Gọi createTodo với các tham số riêng biệt theo đúng thứ tự
      const createdTodo = await createTodo(title, statusToUse, token, note);

      // Tạo task mới từ dữ liệu API trả về
      const newTask: Task = {
        id: createdTodo.id,
        title: createdTodo.title,
        status: createdTodo.status as Status,
        isCompleted: createdTodo.isCompleted,
        createdAt: new Date(createdTodo.createdAt),
        note: createdTodo.note || note || undefined,
      };

      // Tìm column đích dựa trên status
      const targetColumnId =
        columns.find((col) => col.title === createdTodo.status)?.id || columnId;

      // Thêm task vào column dựa trên status
      setColumns((prev) =>
        prev.map((column) =>
          column.id === targetColumnId ? { ...column, tasks: [...column.tasks, newTask] } : column
        )
      );

      setAddingTaskToColumnId(null);
    } catch (error) {
      console.error('Lỗi khi tạo Task mới:', error);
      // Có thể hiển thị thông báo lỗi cho người dùng ở đây

      // Tạm thời, vẫn thêm task vào UI dù API lỗi (có thể bỏ phần này nếu muốn)
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        status: status || (columns.find((col) => col.id === columnId)?.title as Status),
        isCompleted: false,
        createdAt: new Date(),
        note: note,
      };

      // Hiển thị log lỗi nhưng vẫn thêm task vào UI
      console.log('Đã thêm task vào UI dù API lỗi. Task:', newTask);

      // Tìm column đích
      const actualStatus = status || (columns.find((col) => col.id === columnId)?.title as Status);
      const targetColumnId = columns.find((col) => col.title === actualStatus)?.id || columnId;

      // Thêm task vào column
      setColumns((prev) =>
        prev.map((column) =>
          column.id === targetColumnId ? { ...column, tasks: [...column.tasks, newTask] } : column
        )
      );

      setAddingTaskToColumnId(null);
    }
  };

  // Hàm xử lý cập nhật task
  const handleUpdateTask = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      // Lấy token từ local storage
      const token = getAuthTokenFromCookie();

      // Gọi API cập nhật todo
      const result = await updateTodo(taskId, token, {
        title: updatedData.title,
        status: updatedData.status,
        isCompleted: updatedData.isCompleted,
        note: updatedData.note,
      });

      console.log('Cập nhật todo thành công:', result);

      // Cập nhật UI
      setColumns((prev) => {
        // Tìm column chứa task cần cập nhật
        const columnWithTask = prev.find((column) =>
          column.tasks.some((task) => task.id === taskId)
        );

        if (!columnWithTask) return prev;

        // Tạo bản sao của task cần cập nhật
        const taskToUpdate = { ...columnWithTask.tasks.find((task) => task.id === taskId)! };

        // Cập nhật dữ liệu task
        const updatedTask = { ...taskToUpdate, ...updatedData };

        // Nếu status thay đổi, di chuyển task giữa các column
        if (updatedData.status && updatedData.status !== taskToUpdate.status) {
          // Tìm column đích dựa trên status mới
          const targetColumn = prev.find((col) => col.title === updatedData.status);

          if (!targetColumn) return prev;

          return prev.map((column) => {
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
        return prev.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedData } : task
          ),
        }));
      });

      setEditingTaskId(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật task:', error);
      // Vẫn cập nhật UI dù API lỗi
      // (code cập nhật UI tương tự như trên)
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
        console.log('Xóa todo thành công, ID:', taskId);

        // Cập nhật UI sau khi xóa thành công
        setColumns((prev) =>
          prev.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }))
        );
      } else {
        console.warn('API trả về kết quả xóa không thành công');
        // Vẫn xóa trên UI để đồng bộ trạng thái
        setColumns((prev) =>
          prev.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }))
        );
      }
    } catch (error) {
      console.error('Lỗi khi xóa task:', error);
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
      console.error('Lỗi khi cập nhật trạng thái hoàn thành:', error);
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
                        />
                      ))}
                    </SortableContext>
                  </div>
                ) : (
                  <div className="w-full p-2 sm:p-4">
                    <SortableContext
                      items={columns.map((col) => col.id)}
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
                          draggingTaskId={draggingTaskId}
                          statusOptions={allStatuses}
                        />
                      ))}
                    </SortableContext>
                  </div>
                )}

                {/* Thêm DragOverlay để hiển thị task đang kéo */}
                <DragOverlay>
                  {activeTask && (
                    <div
                      className="bg-gray-800 border border-gray-700 rounded-md p-3 shadow-xl opacity-95 min-w-[250px] max-w-[350px]"
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
