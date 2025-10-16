export type Thread = {
  _id: string;
  content: string;
  resolved: boolean;
  createdAt: string;
  createdBy: string;
  __v: number;
};

export type ToolbarMode = "add" | "palette" | "list";

export type ContentAppProps = {
  projectId: string;
  roomId: string;
  accessToken: string;
};
