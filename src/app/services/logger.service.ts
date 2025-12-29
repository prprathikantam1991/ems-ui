import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  private currentLogLevel: LogLevel;
  private enableConsole: boolean;
  private enableStorage: boolean;
  private storageKey: string;
  private maxStoredLogs: number;

  constructor() {
    const config = (environment as any).logging || {};
    this.currentLogLevel = config.logLevel || 'debug';
    this.enableConsole = config.enableConsole !== false;
    this.enableStorage = config.enableStorage === true;
    this.storageKey = config.storageKey || 'ems-ui-logs';
    this.maxStoredLogs = config.maxStoredLogs || 100;
  }

  /**
   * Check if a log level should be logged based on current configuration
   */
  private shouldLog(level: LogLevel): boolean {
    const currentLevelIndex = this.logLevels.indexOf(this.currentLogLevel);
    const logLevelIndex = this.logLevels.indexOf(level);
    return logLevelIndex >= currentLevelIndex;
  }

  /**
   * Create a structured log entry
   */
  private createLogEntry(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };
  }

  /**
   * Log to console if enabled
   */
  private logToConsole(entry: LogEntry): void {
    if (!this.enableConsole) {
      return;
    }

    const formattedMessage = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(formattedMessage, entry.context || '');
        break;
      case 'info':
        console.info(formattedMessage, entry.context || '');
        break;
      case 'warn':
        console.warn(formattedMessage, entry.context || '');
        break;
      case 'error':
        console.error(formattedMessage, entry.context || '');
        break;
      default:
        console.log(formattedMessage, entry.context || '');
    }
  }

  /**
   * Store log entry in localStorage if enabled and level is error
   */
  private storeLog(entry: LogEntry): void {
    if (!this.enableStorage || entry.level !== 'error') {
      return;
    }

    try {
      const storedLogs = this.getStoredLogs();
      storedLogs.push(entry);

      // Keep only the last maxStoredLogs entries
      if (storedLogs.length > this.maxStoredLogs) {
        storedLogs.shift();
      }

      localStorage.setItem(this.storageKey, JSON.stringify(storedLogs));
    } catch (error) {
      // Silently fail if localStorage is not available or quota exceeded
      console.warn('Failed to store log in localStorage:', error);
    }
  }

  /**
   * Get stored logs from localStorage
   */
  private getStoredLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, context);
    this.logToConsole(entry);
    this.storeLog(entry);
  }

  /**
   * Log debug message
   */
  public debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }

  /**
   * Log info message
   */
  public info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  /**
   * Log warning message
   */
  public warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  /**
   * Log error message
   */
  public error(message: string, context?: any): void {
    this.log('error', message, context);
  }

  /**
   * Generic log method (defaults to info level)
   */
  public logMessage(message: string, context?: any): void {
    this.log('info', message, context);
  }

  /**
   * Get stored error logs from localStorage
   */
  public getStoredErrorLogs(): LogEntry[] {
    if (!this.enableStorage) {
      return [];
    }
    return this.getStoredLogs();
  }

  /**
   * Clear stored logs from localStorage
   */
  public clearStoredLogs(): void {
    if (!this.enableStorage) {
      return;
    }
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear stored logs:', error);
    }
  }
}

