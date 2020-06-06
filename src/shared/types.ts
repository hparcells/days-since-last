export type Visibility = 'PUBLIC' | 'UNLISTED';

export interface BasicDsl {
  id: number;
  name: string;
  visibility: Visibility;
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
