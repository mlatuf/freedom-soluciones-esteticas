import { Patient } from "../patient/patient";
import { Area } from "../area/area";

export class Appointment {
  _id: number;
  //TODO on BE
  // patient: Patient;
  time: number;
  patient: { 
    _id: number;
    fullName: string;
  };
  areas: number[];
  price: number;
  paymentMethod: number;
  status: number;
  observations: string;
}
