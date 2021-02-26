import { AppointmentPatient } from "./appointment-patient";

export class Patient {
  _id: string;
  name: string;
  lastName: string;
  age: number;
  phone: number;
  medicines: string;
  allergies: string;
  bodyMetals: string;
  moles: string;
  tattoos: string;
  skinCancer: boolean;
  epilepsy: boolean;
  pregnant: boolean;
  previousTreatment: string;
  appointments: AppointmentPatient[];
  nextSession: string;
}
