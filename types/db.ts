export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  projectId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSummary = Pick<User, "id" | "email">;

export interface MembershipWithUser
  extends Omit<Membership, "createdAt" | "updatedAt" | "userId"> {
  user: UserSummary;
}

export interface ProjectWithRelations extends Project {
  memberships: MembershipWithUser[];
  tasks: Task[];
}

export interface TaskWithAssigneeProps extends Task {
  assignee: UserSummary;
}
