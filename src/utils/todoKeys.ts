import { Todo } from '../types/todo';

export function getTodoKey(todo: Todo): string {
  return String(todo.id);
}
