import { Instance as ChalkInstance } from 'chalk';

export enum LogEnum {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export class Logger {
  private context: string;

  constructor(context: string = Logger.name) {
    this.context = context;
  }

  public setContext(context: string): void {
    this.context = context;
  }

  private getFormattedTime(): string {
    const now = new Date();
    return now.toLocaleTimeString();
  }

  private log(level: LogEnum, message: string): void {
    const color = new ChalkInstance({ level: 2 });
    const timestamp = this.getFormattedTime();

    switch (level) {
      case LogEnum.INFO:
        console.log(
          color.green(
            color`{cyan [${timestamp}]} [${level}] {cyan [${this.context}]}: ${message}`,
          ),
        );
        break;
      case LogEnum.WARNING:
        console.log(
          color.yellow(
            color`{cyan [${timestamp}]} [${level}] {cyan [${this.context}]}: ${message}`,
          ),
        );
        break;
      case LogEnum.ERROR:
        console.log(
          color.red(
            color`{cyan [${timestamp}]} [${level}] {cyan [${this.context}]}: ${message}`,
          ),
        );
        break;
    }
  }

  public info(message: string): void {
    this.log(LogEnum.INFO, message);
  }

  public warn(message: string): void {
    this.log(LogEnum.WARNING, message);
  }

  public error(message: string): void {
    this.log(LogEnum.ERROR, message);
  }
}

export const startupLogger = new Logger('Startup');
