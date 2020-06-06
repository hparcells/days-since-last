export type Notification =
  | {
      type: 'EXCEEDS';
      sent: boolean;
      years: number;
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  | {
      type: 'RESETS';
      sent: boolean;
    };

export interface TimeData {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
