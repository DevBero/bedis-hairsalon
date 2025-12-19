export default function combineDateAndTime(
  dateInput: string | Date,
  timeInput: string
): Date {
  const dateStr =
    dateInput instanceof Date
      ? dateInput.toISOString().slice(0, 10)
      : dateInput.includes("T")
        ? dateInput.slice(0, 10)
        : dateInput;

  const timeStr = timeInput.includes(":") ? timeInput.slice(0, 5) : timeInput;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}
