import dayjs from 'dayjs';
import { ApplicationInfo, VCInfo } from '../types';

export const setYears = (): string[] => {
  const dataYears = [];

  for (let i = new Date().getFullYear(); i >= 1970; i--) {
    dataYears.push(i.toString() + '年');
  }
  return dataYears;
};

export const setMonths = (): string[] => {
  const dataMonths = [];

  for (let i = 1; i <= 12; i++) {
    dataMonths.push(i.toString() + '月');
  }
  return dataMonths;
};

export const years = setYears();
export const months = setMonths();

export const sortInfoList = <T extends ApplicationInfo[] | VCInfo[]>(
  listState: T,
  order: 'asc' | 'desc' = 'asc'
): T => {
  return <T>listState.slice().sort((a, b) => {
    const aDate = dayjs(a.sortIdx);
    const bDate = dayjs(b.sortIdx);

    if (bDate.isBefore(aDate)) {
      return order === 'asc' ? 1 : -1;
    } else if (bDate.isAfter(aDate)) {
      return order === 'asc' ? -1 : 1;
    } else {
      return 0;
    }
  });
};
