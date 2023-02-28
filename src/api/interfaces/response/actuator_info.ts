export interface Message {
  full: string;
  short: string;
}

export interface Id {
  describe: string;
  abbrev: string;
  full: string;
}

export interface User {
  email: string;
  name: string;
}

export interface Commit {
  time: number;
  message: Message;
  id: Id;
  user: User;
}

export interface User2 {
  name: string;
  email: string;
}

export interface Build {
  version: string;
  user: User2;
  host: string;
}

export interface Commit2 {
  count: string;
}

export interface Total {
  commit: Commit2;
}

export interface Commit3 {
  count: string;
}

export interface Tag {
  commit: Commit3;
  name: string;
}

export interface Closest {
  tag: Tag;
}

export interface Origin {
  url: string;
}

export interface Remote {
  origin: Origin;
}

export interface Git {
  branch: string;
  commit: Commit;
  build: Build;
  dirty: string;
  tags: string;
  total: Total;
  closest: Closest;
  remote: Remote;
}

export interface ActuatorInfo {
  git: Git;
}

