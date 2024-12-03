export type ThemeType = 'default' | 'light' | 'dark' | 'rainbow' | 'purple' | 'red';
export type FontType = 'playfair' | 'kalam' | 'montserrat';

export type UserType = {
  username: string;
  photo: string;
  email: string;
  _id: number;
  theme: ThemeType;
  font: FontType;
  background: string;
};

export type TaskType = {
  todo_id: string;
  id: string | number | undefined;
  description: string;
  date_added: number | string;
  date_completed: number | string | null;
  priority: string;
  due_date: number | string;
  position: number;
  groupId: string;
};

export type InitialDataType = {
  tasks: {
    [key: string]: TaskType
  };
  columns: {
    [key: string]: ColumnData
  };
  columnOrder: string[];
};

export type ColumnData = {
  id: string;
  column_id: string;
  title: string;
  taskIds: string[];
};

export type LoadedTodosDataType = {
  fetchedTodosData: InitialDataType
  access_token: string
  userId: string
};

