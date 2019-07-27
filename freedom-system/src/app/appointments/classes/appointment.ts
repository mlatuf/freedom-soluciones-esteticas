import { Area } from "src/app/areas/classes/area";

export class Appointment {
  _id: string;
  day: any;
  patient: any;
  time: number;
  areas: Area[];
  price: number;
  paymentMethod: number;
  status: number;
  observations: string;
}
