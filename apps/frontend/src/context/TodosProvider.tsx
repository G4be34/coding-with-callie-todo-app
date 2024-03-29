import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

const initialData = {
  tasks: {},
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Completed',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'Title',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2'],
};

const TodosContext = createContext<TodosContextType | null>(null);

type TaskType = {
  id: string
  content: string
  date_added: number
  date_completed: number | null
  priority: string
  due_date: number | null
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
  const { user, token } = useAuth();
  const [todosData, setTodosData] = useState<InitialDataType>(initialData);

  const value = {
    todosData,
    setTodosData,
  };

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const response = await axios.get('/api/groups?user=' + user._id, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       // setTodosData(response.data);
  //       console.log("recieved data: ", response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   getData();
  // }, []);

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