import { AppointmentPatient } from "./appointment-patient";

export class Patient {
  _id: string;
  name: string;
  lastName: string;
  age: number;
  phone: number;
  hasMedicines: Boolean;
  medicines: string;
  hasAllergies: Boolean;
  allergies: string;
  pregnancy: Boolean;
  hasBodyMetals: Boolean;
  bodyMetalsPlace: string;
  hasMoles: Boolean;
  molesPlace: string;
  hasTattoos: Boolean;
  tattoosPlace: string;
  hasSkinCancer: Boolean;
  hasEpilepsy: Boolean;
  hasPreviousTreatment: Boolean;
  previousTreatment: string;
  appointments: AppointmentPatient[];
}
