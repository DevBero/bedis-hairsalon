export function getCurrentTime(opts?: { endtime?: boolean }): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  const hours = opts?.endtime ? now.getHours() + 5 : now.getHours();

  return `${pad(hours)}:${pad(now.getMinutes())}`;
}
