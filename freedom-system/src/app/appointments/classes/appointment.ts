import { Area } from "src/app/areas/classes/area";
import { Patient } from "src/app/patients/classes/patient";

export class Appointment {
  _id: string;
  day: any;
  patient: Patient;
  time: number;
  areas: Area[];
  price: number;
  paymentMethod: number;
  status: number;
  observations: string;
}
