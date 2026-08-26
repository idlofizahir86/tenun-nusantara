export type UserRole = "student" | "teacher" | "parent";

export interface User {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  classCode?: string; // For students
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends User {
  role: "student";
  classCode: string;
  avatarUrl?: string;
  level: number;
  completedIslands: string[];
}

export interface Teacher extends User {
  role: "teacher";
  classes: string[]; // Class codes they manage
}

export interface Parent extends User {
  role: "parent";
  linkedChildren: string[]; // Student IDs
}