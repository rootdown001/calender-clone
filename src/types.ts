export type EventType = {
  date: Date;
} & EventTypeNoDate;

export type EventTypeNoDate = {
  id: `${string}-${string}-${string}-${string}-${string}`;
} & EventNoIdNoDate;

export type EventNoIdNoDate = {
  name: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
  color: string;
};

export type ButtonRowProps = {
  isModalEdit: boolean;
};
