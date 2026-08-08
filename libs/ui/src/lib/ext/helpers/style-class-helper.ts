export function uniquifyStyleClass(...styleClasses: string[]) {
  return Array.from(
    new Set(
      styleClasses
        .join(' ')
        .split(' ')
        .map((v) => v.trim())
        .filter((v) => v.length > 0),
    ),
  ).join(' ');
}
