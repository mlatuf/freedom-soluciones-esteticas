import { Area } from "src/app/areas/classes/area";
import { Patient } from "src/app/patients/classes/patient";
import { Day } from "src/app/calendar/classes/day";

export class Appointment {
  _id: string;
  patient: Patient;
  day: Day;
  time: number;
  areas: Area[];
  price: number;
  paymentMethod: number;
  status: number;
  observations: string;
}
