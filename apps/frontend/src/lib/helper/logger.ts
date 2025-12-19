import pino from "pino";

export const getLogger = (name: string) => {
  return pino({
    name,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
};
