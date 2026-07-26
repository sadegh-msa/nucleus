export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function sleepRandom(min = 5, max = 30) {
  return sleep(Math.floor(Math.random() * (max - min)) + min);
}
