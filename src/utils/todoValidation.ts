const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 64;

export function validateTodoTitle(title: string): string | null {
  if (title.length < MIN_TITLE_LENGTH) {
    return `Название задачи должно быть не короче ${MIN_TITLE_LENGTH} символов`;
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return `Название задачи должно быть не длиннее ${MAX_TITLE_LENGTH} символов`;
  }

  return null;
}
