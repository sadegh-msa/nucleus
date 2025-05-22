export function syncSleep(duration: number) {
  const now = new Date().getTime();
  while (new Date().getTime() < now + duration / 1000) {
    /* Do nothing */
  }
}

export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
