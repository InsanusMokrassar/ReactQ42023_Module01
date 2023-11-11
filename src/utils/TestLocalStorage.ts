export function TestLocalStorage(): Storage {
  return ((): object => {
    const store: { [key: string]: string } = {};
    return {
      getItem: (key: string): string | null => store[key] || null,
      setItem: (key: string, value: string): void => {
        store[key] = value.toString();
      },
      key: (index: number) => Object.keys(store)[index],
      length: () => Object.keys(store).length,
    };
  })() as Storage;
}
