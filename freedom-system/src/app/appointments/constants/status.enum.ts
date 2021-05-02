export enum Status {
  new = "Nuevo",
  waitingConfirmation = "Esperando confirmacion",
  confirmed = "Confirmado",
  missing = "Ausente",
  present = "Presente",
  ended = "Finalizado",
  terminated = "Cancelado",
  paid = "Pago",
}

export const StatusList = {
  New: {
    key: 1,
    label: Status.new,
    classRow: "new",
    next: [2],
  },
  WaitingConfirmation: {
    key: 2,
    label: Status.waitingConfirmation,
    classRow: "waiting-confirmation",
    next: [3, 7],
  },
  Confirmed: {
    key: 3,
    label: Status.confirmed,
    classRow: "confirmed",
    next: [4, 5],
  },
  Missing: {
    key: 4,
    label: Status.missing,
    classRow: "missing",
    next: [1],
  },
  Present: {
    key: 5,
    label: Status.present,
    classRow: "present",
    next: [6],
  },
  Ended: {
    key: 6,
    label: Status.ended,
    classRow: "ended",
    next: [],
  },
  Terminated: {
    key: 7,
    label: Status.terminated,
    classRow: "terminated",
    next: [0],
  },
};

export const getStatuses = () => {
  return [
    StatusList.New,
    StatusList.WaitingConfirmation,
    StatusList.Confirmed,
    StatusList.Missing,
    StatusList.Present,
    StatusList.Ended,
    StatusList.Terminated,
  ];
};

export const getStatusesForDetails = () => {
  return [
    StatusList.New,
    StatusList.WaitingConfirmation,
    StatusList.Confirmed,
    StatusList.Missing,
    StatusList.Present,
    StatusList.Terminated,
  ];
};

export const getStatusByKey = (value: number) =>
  getStatuses().find((status) => status.key === value);

export const getNextStatus = (value: number) =>
  getStatuses().find((status) => status.key === value).next;
