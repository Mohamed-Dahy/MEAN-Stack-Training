export interface EventModel {
  _id: string; // MongoDB ObjectId will be string when returned to frontend
  name: string;
  description: string;
  datetime: string; // Date in ISO string format
  location: string;
  price: number;
  totalseats: number;
  availableseats?: number;
  category: 'Music' | 'Sports' | 'Arts' | 'Theater' | 'Comedy' | 'Other';
  imageurl?: string;
  createdby?: string;
  createdat?: string;
  bookedusers: string[]; // Array of user IDs
}
