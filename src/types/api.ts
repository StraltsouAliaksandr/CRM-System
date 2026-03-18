export interface Response<T> {
  data: T;
}

export interface MetaResponse<T, N extends object> extends Response<T> {
  meta: N;
}
