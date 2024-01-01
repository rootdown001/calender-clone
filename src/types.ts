export type EventType = {
  readonly id: string;
} & EventNoId;

export type EventNoId = {
  date: Date;
  name: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
  color: string;
};
