export enum Payments {
 nonPayment = 'Impago',
 cash = 'Efectivo', 
 payMarket = 'Mercado Pago'
};

export const PaymentList = {
  NonPayment: {
    key: 1,
    label: Payments.nonPayment,
  },
  Cash: {
    key: 2,
    label: Payments.cash,
  },
  PayMarket: {
    key: 3,
    label: Payments.payMarket,
  }
};

export const getPayments = () => {
  return [PaymentList.NonPayment, PaymentList.Cash, PaymentList.PayMarket];
}
export const getPaymentByKey = (value: number) => ( getPayments().find(payment => payment.key === value));