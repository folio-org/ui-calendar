export default function flattenObject<T extends Record<string, unknown>>(
  obj: Record<number, T>
): Partial<T>[] | undefined {
  if (Object.keys(obj).length === 0) {
    return undefined;
  }

  const arr = Array<Partial<T>>(
    Object.keys(obj)
      .map((k) => parseInt(k, 10))
      .reduce((a, b) => Math.max(a, b))
  ).fill({});

  Object.keys(obj).forEach((k) => {
    arr[parseInt(k, 10)] = obj[parseInt(k, 10)];
  });

  return arr;
}
