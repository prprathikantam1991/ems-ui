export const environment = {
  production: false,
  authServiceUrl: 'http://localhost:8081',
  apiBaseUrl: 'http://localhost:8080/api/v1',
  logging: {
    logLevel: 'debug',
    enableConsole: true,
    enableStorage: false,
    storageKey: 'ems-ui-logs',
    maxStoredLogs: 100
  }
};
