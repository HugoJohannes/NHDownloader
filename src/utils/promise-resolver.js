async function promiseResolver(fn) {
  try {
    const result = await fn;

    return [result, null];
  } catch (error) {
    return [null, error];
  }
}

export default promiseResolver;
