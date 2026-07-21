export function syncSleep(duration: number) {
  const now = Date.now();
  while (Date.now()< now + duration / 1000) {
    /* Do nothing */
  }
}

export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function sleepRandom(min = 5, max = 30) {
  return sleep(Math.floor(Math.random() * (max - min)) + min);
}
