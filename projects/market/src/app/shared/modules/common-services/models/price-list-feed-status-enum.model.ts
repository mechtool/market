export enum PriceListStatusEnum {
  // todo избавиться от IN_PROGRESS, COMPLETED когда с сервиса начнут приходить значения в camelCase
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  InProgress = 'InProgress',
  Completed = 'Completed',
  FailedNoValidPositions = 'FailedNoValidPositions',
  FailedInvalidFileUrl = 'FailedInvalidFileUrl',
  FailedInvalidFileFormat = 'FailedInvalidFileFormat',
}
