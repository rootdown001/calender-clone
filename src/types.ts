import { Dispatch, SetStateAction } from "react";

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

export type AddEventProps = {
  dateOfEvent: Date;
  isEventFormOpen: boolean;
  isModalEdit: boolean;
  onClose: () => void;
  events: EventType[];
  setEvents: Dispatch<SetStateAction<EventType[]>>;
  eventToPass?: EventType;
};

export type ButtonRowProps = {
  isModalEdit: boolean;
};
