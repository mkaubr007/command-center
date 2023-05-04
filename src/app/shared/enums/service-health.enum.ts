export enum ServiceHealth {
  RECEIVED = 'Received',
  NOT_RECEIVED = 'Not Received',
  HEALTHY = 'Healthy',
  NOT_SET = 'Not Set',
  WAITING = 'Waiting',
}

export enum ServiceHealthTable {
  SERVICE = 'service',
  CLIENT = 'client',
  ENVIRONMENT = 'environment',
  CHECK_IN_STATUS = 'check-in status',
  NEW_ERRORS = 'new errors',
}
