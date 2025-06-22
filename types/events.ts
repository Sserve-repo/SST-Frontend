export interface Instructor {
  name: string;
  title: string;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: Date;
  endDate: Date;
  type: string;
  duration: number;
  location: string;
  capacity: number;
  registered: number;
  instructor?: Instructor;
  topics: string[];
  status:
    | "upcoming"
    | "full"
    | "completed"
    | "in_progress"
    | "cancelled"
    | "draft";
  image: string;
  organizer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  attendees: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: string;
  }[];
  createdAt: Date | string;
}
