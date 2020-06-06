export interface BasicDsl {
  id: number;
  name: string;
}
export interface Dsl extends BasicDsl {
  createdBy: string;
  createdOn: number;
  triggers: number;
  lastTrigger: number;
}
export interface LoginInfo {
  name: string;
  profilePicture: string;
  token: string;
  userId: string;
}
export interface Profile {
  id: string;
  name: string;
  profilePicture: string;
}
