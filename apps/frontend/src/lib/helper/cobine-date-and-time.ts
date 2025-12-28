export const combineDateAndTimeUtc = (
  dateStr: string,
  timeStr: string
): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
};
