import { Injectable } from "@angular/core";
import { Appointment, Time, TimeSlot } from "../models";
import { StatusList, getStatusByKey } from "../constants/status.enum";

const APPOINTMENT_PERIOD = 15;
const START_DAY_TIME = 8;
const END_DAY_TIME = 21;
const MAX_APPOINTMENTS_IN_HOUR = 4;

@Injectable({
  providedIn: "root",
})
export class HelperService {
  constructor() {}

  public getBillableAppointments = (
    appointments: Appointment[]
  ): Appointment[] =>
    appointments.filter(
      (appointment) =>
        appointment.status === StatusList.Ended.key ||
        appointment.status === StatusList.Present.key
    );

  public getSelectedAppointment = (
    appointments: Appointment[],
    appointmentChanged: any
  ) =>
    appointments.find(
      (appointment) =>
        appointment._id === appointmentChanged.selectedAppointment
    );

  public isEndDayDisabled = (
    appointments: Appointment[],
    isFinished: Boolean
  ): Boolean => {
    const pendingAppointments = appointments.filter((appointment) => {
      const statusObj = getStatusByKey(appointment.status);
      return statusObj === StatusList.Confirmed;
    });
    return (
      isFinished || appointments.length === 0 || pendingAppointments.length > 0
    );
  };

  public getInitialTimes = () => {
    let initialTimes = [];
    for (let i = START_DAY_TIME; i < END_DAY_TIME; i++) {
      for (let j = 0; j < MAX_APPOINTMENTS_IN_HOUR; j++) {
        initialTimes.push(i + ":" + (j === 0 ? "00" : APPOINTMENT_PERIOD * j));
      }
    }

    return initialTimes.map((value, index) => ({
      _id: index,
      available: true,
      time: value,
    }));
  };

  public getInitialSlots = (
    appointments: Appointment[],
    currentAppointment: string
  ): Time[] => {
    const initialSlotTimes = this.getInitialTimes();
    //to not take in consideration the currentAppointment
    const busyAppointments = currentAppointment
      ? appointments.filter(
          (appointment) => appointment._id != currentAppointment
        )
      : appointments;
    if (busyAppointments) {
      busyAppointments.forEach((appointment) => {
        const duration = appointment.areas.reduce(
          (acc, area) => acc + area.duration,
          0
        );
        for (let index = 0; index < duration; index++) {
          initialSlotTimes[appointment.time + index].available = false;
        }
      });
    }

    return initialSlotTimes;
  };

  public updateAvailableSlots = (
    initialSlotTimes: Time[],
    duration: number = 1
  ): TimeSlot[] => {
    let availableTimesUpdated: TimeSlot[] = [];
    const slots = Array.from(Array(initialSlotTimes.length).keys());
    slots.forEach((slotElm, index) => {
      // TODO necesito todos los initialtimes para saber cuales estan available
      if (initialSlotTimes[index].available) {
        let count = 0;
        for (
          let i = index;
          i < slots.length && count < duration && initialSlotTimes[i].available;
          i++
        ) {
          count++;
          if (count === duration) {
            const newSlot = {
              _id: index,
              startTime: initialSlotTimes[slotElm].time,
              slot: initialSlotTimes
                .slice(slotElm, slotElm + duration)
                .map((t) => t._id),
            };
            availableTimesUpdated.push(newSlot);
          }
        }
      }
    });
    return availableTimesUpdated;
  };
}
