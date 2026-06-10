export const MIN_TITLE_LENGTH = 2;
export const MAX_TITLE_LENGTH = 64;

export const todoTitleRules = [
  {
    required: true,
    whitespace: true,
    message: 'Введите название задачи',
  },
  {
    min: MIN_TITLE_LENGTH,
    message: `Название задачи должно быть не короче ${MIN_TITLE_LENGTH} символов`,
  },
  {
    max: MAX_TITLE_LENGTH,
    message: `Название задачи должно быть не длиннее ${MAX_TITLE_LENGTH} символов`,
  },
];
