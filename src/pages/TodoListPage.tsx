import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Flex, Form, Input, Modal, Typography, message } from 'antd';
import { getAllToDos, updateTodo } from '../api/todos';
import TodoForm from '../components/TodoForm/TodoForm';
import TodoFilters from '../components/TodoFilters/TodoFilters';
import TodoList from '../components/TodoList/TodoList';
import styles from './TodoListPage.module.css';
import { Filter, Todo, TodoInfo } from '../types/todo';
import { todoTitleRules } from '../utils/todoValidation';

const AUTO_REFRESH_INTERVAL_MS = 5000;

interface RefreshOptions {
  force?: boolean;
}

interface EditTodoValues {
  title: string;
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [counts, setCounts] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [filter, setFilter] = useState<Filter>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const latestRefreshRequestIdRef = useRef(0);
  const activeRefreshControllerRef = useRef<AbortController | null>(null);
  const [editForm] = Form.useForm<EditTodoValues>();

  const showErrorMessage = useCallback((content: string): void => {
    void message.error(content);
  }, []);

  const refreshTodos = useCallback(
    async (options: RefreshOptions = {}): Promise<void> => {
      activeRefreshControllerRef.current?.abort();

      const controller = new AbortController();
      activeRefreshControllerRef.current = controller;
      const requestId = ++latestRefreshRequestIdRef.current;

      try {
        const { data, info } = await getAllToDos(filter, {
          signal: controller.signal,
        });

        if (requestId !== latestRefreshRequestIdRef.current) {
          return;
        }

        if (!options.force && editingTodo) {
          return;
        }

        setTodos(data);
        setCounts(info);
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        if (requestId === latestRefreshRequestIdRef.current) {
          showErrorMessage('Не удалось загрузить список задач.');
        }
      } finally {
        if (activeRefreshControllerRef.current === controller) {
          activeRefreshControllerRef.current = null;
        }
      }
    },
    [editingTodo, filter, showErrorMessage]
  );

  const handleEditStart = useCallback(
    (todo: Todo) => {
      activeRefreshControllerRef.current?.abort();
      setEditingTodo(todo);
      editForm.setFieldsValue({ title: todo.title });
    },
    [editForm]
  );

  const handleEditCancel = useCallback(() => {
    setEditingTodo(null);
    editForm.resetFields();
  }, [editForm]);

  const handleEditSave = useCallback(
    async (values: EditTodoValues): Promise<void> => {
      if (!editingTodo) {
        return;
      }

      try {
        await updateTodo(editingTodo.id, {
          title: values.title.trim(),
          isDone: editingTodo.isDone,
        });
        handleEditCancel();
        await refreshTodos({ force: true });
      } catch {
        showErrorMessage('Не удалось сохранить задачу.');
      }
    },
    [editingTodo, handleEditCancel, refreshTodos, showErrorMessage]
  );

  useEffect(() => {
    void refreshTodos({ force: true });

    return () => {
      activeRefreshControllerRef.current?.abort();
    };
  }, [refreshTodos]);

  useEffect(() => {
    if (editingTodo) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void refreshTodos();
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [editingTodo, refreshTodos]);

  return (
    <>
      <Card className={styles.wrapper}>
        <Flex vertical gap={16}>
          <div>
            <Typography.Title level={2}>Список задач</Typography.Title>
          </div>
          <TodoForm refreshTodos={refreshTodos} showMessage={showErrorMessage} />
          <TodoFilters filter={filter} setFilter={setFilter} counts={counts} />
          <TodoList
            todos={todos}
            refreshTodos={refreshTodos}
            showMessage={showErrorMessage}
            editingTodoId={editingTodo?.id ?? null}
            onEditStart={handleEditStart}
          />
        </Flex>
      </Card>

      <Modal
        title="Редактировать задачу"
        open={Boolean(editingTodo)}
        onCancel={handleEditCancel}
        footer={null}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSave}>
          <Form.Item name="title" rules={todoTitleRules}>
            <Input placeholder="Название задачи" />
          </Form.Item>
          <Flex justify="end" gap={8}>
            <Button onClick={handleEditCancel}>Отмена</Button>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
}
