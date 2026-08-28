export function rejectString(): Promise<never> {
  return Promise.reject('failure');
}
