import winston from "winston";
import { TransformableInfo } from "logform";

const consoleFormat = winston.format.printf((info: TransformableInfo) => {
  return `${String(info.timestamp)} [${String(info.level)}]: ${String(info.message)}`;
});

const fileFormat = winston.format.printf((info: TransformableInfo) => {
  return `${String(info.timestamp)} [${String(info.level).toUpperCase()}]: ${String(info.message)}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    fileFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize(),
        consoleFormat,
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
