export default function lazy<T>(callback: () => T): () => T {
  let inited: T | undefined = undefined;
  return (): T => {
    if (inited) return inited;

    inited = callback();

    return inited;
  };
}
