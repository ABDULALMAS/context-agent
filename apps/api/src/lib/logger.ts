import pino from "pino";

export const sensitiveRedactPaths = [
  "req.headers.cookie",
  "req.headers.authorization",
  'res.headers["set-cookie"]',
  ...["password", "token", "passwordHash"].flatMap((field) =>
    Array.from({ length: 10 }, (_, depth) => `${"*.".repeat(depth)}${field}`),
  ),
];

type LoggerOptions = {
  level: pino.LevelWithSilent;
  redact: string[];
  transport?: pino.DestinationStream;
};

export const createLogger = ({ level, redact, transport }: LoggerOptions) => {
  const options = {
    level,
    redact: {
      paths: redact,
      censor: "[Redacted]",
    },
  };

  return transport ? pino(options, transport) : pino(options);
};
