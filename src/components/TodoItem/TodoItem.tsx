import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Space, Typography } from 'antd';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/todo';

interface RefreshOptions {
  force?: boolean;
}

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
    <div style={{ width: '100%' }}>
      <Flex align="center" gap={12} style={{ width: '100%' }}>
        <Checkbox checked={todo.isDone} onChange={() => void updateStatus()} />
        <Typography.Text
          delete={todo.isDone}
          type={todo.isDone ? 'secondary' : undefined}
          style={{ flex: 1 }}
        >
          {todo.title}
        </Typography.Text>
        <Space>
          <Button
            type={isEditing ? 'primary' : 'default'}
            htmlType="button"
            onClick={() => onEditStart(todo)}
            icon={<EditOutlined />}
          >
            Редактировать
          </Button>
          <Button
            danger
            htmlType="button"
            onClick={handleTodoRemove}
            icon={<DeleteOutlined />}
          >
            Удалить
          </Button>
        </Space>
      </Flex>
    </div>
  );
}
