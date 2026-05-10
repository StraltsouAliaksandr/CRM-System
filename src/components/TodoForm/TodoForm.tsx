import { Button, Form, Input } from 'antd';
import { addTodo } from '../../api/todos';
import { todoTitleRules } from '../../utils/todoValidation';

interface RefreshOptions {
  force?: boolean;
}

interface Props {
  refreshTodos: (options?: RefreshOptions) => Promise<void>;
  showMessage: (content: string) => void;
}

interface TodoFormValues {
  title: string;
}

export default function TodoForm({ refreshTodos, showMessage }: Props) {
  const [form] = Form.useForm<TodoFormValues>();

  const handleNewTodoSubmit = async (values: TodoFormValues): Promise<void> => {
    const title = values.title.trim();

    try {
      await addTodo({ title, isDone: false });
      form.resetFields();
      await refreshTodos({ force: true });
    } catch {
      showMessage('Ошибка добавления задачи.');
    }
  };

  return (
    <Form form={form} layout="inline" onFinish={handleNewTodoSubmit}>
      <Form.Item
        name="title"
        rules={todoTitleRules}
        style={{ flex: 1, minWidth: 240, marginBottom: 0 }}
      >
        <Input placeholder="Название задачи" />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit">
          Создать
        </Button>
      </Form.Item>
    </Form>
  );
}
