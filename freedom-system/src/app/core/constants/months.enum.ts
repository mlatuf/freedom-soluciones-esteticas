export enum Months {
  january = "Enero",
  february = "Febrero",
  march = "Marzo",
  april = "Abril",
  may = "Mayo",
  june = "Junio",
  july = "Julio",
  august = "Agosto",
  september = "Septiembre",
  october = "October",
  november = "Noviembre",
  december = "Diciembre",
}

export const MonthList = {
  January: {
    key: 1,
    label: Months.january,
  },
  February: {
    key: 2,
    label: Months.february,
  },
  March: {
    key: 3,
    label: Months.march,
  },
  April: {
    key: 4,
    label: Months.april,
  },
  May: {
    key: 5,
    label: Months.may,
  },
  June: {
    key: 6,
    label: Months.june,
  },
  July: {
    key: 7,
    label: Months.july,
  },
  August: {
    key: 8,
    label: Months.august,
  },
  September: {
    key: 9,
    label: Months.september,
  },
  October: {
    key: 10,
    label: Months.october,
  },
  November: {
    key: 11,
    label: Months.november,
  },
  December: {
    key: 12,
    label: Months.december,
  },
};

export const getMonths = () => {
  return [
    MonthList.January,
    MonthList.February,
    MonthList.March,
    MonthList.April,
    MonthList.May,
    MonthList.June,
    MonthList.July,
    MonthList.August,
    MonthList.September,
    MonthList.October,
    MonthList.November,
    MonthList.December,
  ];
};
export const getMonthByKey = (value: number) =>
  getMonths().find((month) => month.key === value);

export const getNextMonth = (value: number) => {
  return getMonths().find((month) => {
    if (value === 12) return month.key === 1;
    return month.key + 1 === value;
  });
};
