export interface TicketModel {
    _id: string; // Optional, as it may not be present until the ticket is saved
    EventName: string;
    Userid: string; // Assuming Userid is a string representation of ObjectId
    Eventid: string; // Assuming Eventid is a string representation of ObjectId
    Date: Date;
    EventPrice: number;
    Place: string;
    photo?: string; // Optional
    qrcode?: string; // Optional, defaults to an empty string
}
