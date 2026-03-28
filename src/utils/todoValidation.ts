const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 64;

type SetError = (message: string) => void;

type OnValid<T> = (validatedTitle: string) => Promise<T>;

export async function withValidatedTodoTitle<T>(
  title: string,
  setError: SetError,
  onValid: OnValid<T>
): Promise<T | undefined> {
  if (title.length < MIN_TITLE_LENGTH) {
    setError(
      `Название задачи должно быть не короче ${MIN_TITLE_LENGTH} символов`
    );
    return undefined;
  }

  if (title.length > MAX_TITLE_LENGTH) {
    setError(
      `Название задачи должно быть не длиннее ${MAX_TITLE_LENGTH} символов`
    );
    return undefined;
  }

  return onValid(title);
}
