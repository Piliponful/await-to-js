const {promisify} = require('es6-promisify');
const isPromise = require('is-promise');

/**
 * @param { PromiseOrFunction } promise or function
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error> (
  promiseOrFunction: Promise<T> | (() => T | U),
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  const promise = isPromise(promiseOrFunction) ? promiseOrFunction as Promise<T> : (promisify(promiseOrFunction) as () => Promise<T>)();

  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}

export default to;
