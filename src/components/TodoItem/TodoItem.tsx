import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Space, Typography } from 'antd';
import { deleteTodo, updateTodo } from '../../api/todos';
import { RefreshOptions } from '../../types/refresh';
import { Todo } from '../../types/todo';

interface Props {
  todo: Todo;
  refreshTodos: (options?: RefreshOptions) => Promise<void>;
  showMessage: (content: string) => void;
  isEditing: boolean;
  onEditStart: (todo: Todo) => void;
}

export default function TodoItem({
  todo,
  refreshTodos,
  showMessage,
  isEditing,
  onEditStart,
}: Props) {
  const updateStatus = async (): Promise<void> => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await refreshTodos({ force: true });
    } catch {
      showMessage('Не удалось обновить статус задачи.');
    }
  };

  const handleTodoRemove = async (): Promise<void> => {
    try {
      await deleteTodo(todo.id);
      await refreshTodos({ force: true });
    } catch {
      showMessage('Не удалось удалить задачу.');
    }
  };

  return (
    <Flex align="center" gap={12} style={{ width: '100%' }}>
      <Checkbox checked={todo.isDone} onChange={updateStatus} />
      <Typography.Text
        type={todo.isDone ? 'secondary' : undefined}
        style={{ flex: 1 }}
        delete={todo.isDone}
      >
        {todo.title}
      </Typography.Text>
      <Space>
        <Button
          type={isEditing ? 'primary' : 'default'}
          onClick={() => onEditStart(todo)}
          icon={<EditOutlined />}
          htmlType="button"
        >
          Редактировать
        </Button>
        <Button
          onClick={handleTodoRemove}
          icon={<DeleteOutlined />}
          htmlType="button"
          danger
        >
          Удалить
        </Button>
      </Space>
    </Flex>
  );
}
