export enum Payments {
 nonPayment = 'Impago',
 cash = 'Efectivo', 
 debit = 'Debito',
 credit = 'Credito'
};

export const PaymentList = {
  NonPayment: {
    key: 1,
    label: Payments.nonPayment
  },
  Cash: {
    key: 2,
    label: Payments.cash
  },
  Debit: {
    key: 3,
    label: Payments.debit
  },
  Credit: {
    key: 4,
    label: Payments.credit
  },
};

export const getPayments = () => {
  return [PaymentList.NonPayment, PaymentList.Cash, PaymentList.Debit, PaymentList.Credit];
}
export const getPaymentByKey = (value: number) => ( getPayments().find(payment => payment.key === value));