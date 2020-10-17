export enum Status  {
  new = 'Nuevo',
  waitingConfirmation = 'Esperando confirmacion',
  confirmed = 'Confirmado',
  missing = 'Ausente',
  present = 'Presente',
  ended = 'Finalizado',
  terminated = 'Cancelado'
}

export const StatusList = {
  New : {
    key: 1,
    label: Status.new,
    classRow: 'new'
  },
  WaitingConfirmation : {
    key: 2,
    label: Status.waitingConfirmation,
    classRow: 'waiting-confirmation'
  },
  Confirmed : {
    key: 3,
    label: Status.confirmed,
    classRow: 'confirmed'
  },
  Missing : {
    key: 4,
    label: Status.missing,
    classRow: 'missing'
  },
  Present : {
    key: 5,
    label: Status.present,
    classRow: 'present'
  },
  Ended : {
    key: 6,
    label: Status.ended,
    classRow: 'ended'
  },
  Terminated : {
    key: 7,
    label: Status.terminated,
    classRow: 'terminated'
  },
};

export const getStatuses = () => {
  return [StatusList.New, StatusList.WaitingConfirmation, StatusList.Confirmed, StatusList.Confirmed, StatusList.Missing, StatusList.Present, StatusList.Present, StatusList.Ended, StatusList.Terminated];
} 

export const getStatusByKey = (value: number) => ( getStatuses().find(status => status.key === value));