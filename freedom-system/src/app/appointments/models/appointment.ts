import { Area } from "src/app/areas/models/area";
import { Patient } from "src/app/patients/models/patient";

export class Appointment {
  _id: string;
  day: any;
  patient: Patient;
  time: number;
  areas: Area[];
  isOverAppointment: boolean = false;
  price: number;
  paymentMethod: number;
  status: number;
  observations: string;
}
