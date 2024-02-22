import { createContext, useContext, useState } from "react";

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage', date_added: 1581744000000, date_completed: null, due_date: 1673001600000, priority: "Normal" },
    'task-2': { id: 'task-2', content: 'Watch my favorite show and drink some soda and play with my dog', date_added: 1630972800000, date_completed: null, due_date: 1673356800000, priority: "High" },
    'task-3': { id: 'task-3', content: 'Charge my phone', date_added: 1655731200000, date_completed: 1678102400000, due_date: 1673971200000, priority: "High" },
    'task-4': { id: 'task-4', content: 'Cook dinner', date_added: 1670073600000, date_completed: null, due_date: 1674326400000, priority: "Highest" },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Completed',
      taskIds: ['task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: ['task-1', 'task-2', 'task-4'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const TodosContext = createContext<TodosContextType | null>(null);

type TaskType = {
  id: string
  content: string
  date_added: number
  date_completed: number | null
}

type ColumnType = {
  id: string
  title: string
  taskIds: string[]
}

type InitialDataType = {
  tasks: {
    [key: string]: TaskType
  };
  columns: {
    [key: string]: ColumnType
  };
  columnOrder: string[];
}

type TodosContextType = {
  todosData: InitialDataType
  setTodosData: React.Dispatch<React.SetStateAction<InitialDataType>>
}

type TodosProviderPropsType = {
  children: React.ReactNode
}

export default function TodosProvider({ children }: TodosProviderPropsType) {
  const [todosData, setTodosData] = useState<InitialDataType>(initialData);

  const value = {
    todosData,
    setTodosData,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
}