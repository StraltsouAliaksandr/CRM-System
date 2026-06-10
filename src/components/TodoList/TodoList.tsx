import { Empty, List } from 'antd';
import TodoItem from '../TodoItem/TodoItem';
import { RefreshOptions } from '../../types/refresh';
import { Todo } from '../../types/todo';
import { getTodoKey } from '../../utils/todoKeys';

interface Props {
  todos: Todo[];
  refreshTodos: (options?: RefreshOptions) => Promise<void>;
  showMessage: (content: string) => void;
  editingTodoId: number | null;
  onEditStart: (todo: Todo) => void;
}

export default function TodoList({
  todos,
  refreshTodos,
  showMessage,
  editingTodoId,
  onEditStart,
}: Props) {
  if (todos.length === 0) {
    return <Empty description="Нет задач" />;
  }

  return (
    <List
      dataSource={todos}
      rowKey={getTodoKey}
      renderItem={(todo) => (
        <List.Item key={getTodoKey(todo)} style={{ paddingInline: 0 }}>
          <TodoItem
            todo={todo}
            refreshTodos={refreshTodos}
            showMessage={showMessage}
            isEditing={editingTodoId === todo.id}
            onEditStart={onEditStart}
          />
        </List.Item>
      )}
    />
  );
}
