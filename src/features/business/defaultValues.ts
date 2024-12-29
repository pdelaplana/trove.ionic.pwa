import { OperatingHours } from '@src/domain';

const defaultOperatingHours: OperatingHours[] = [
  {
    day: 'Monday',
    isClosed: false,
    openAt: '09:00',
    closeAt: '18:00',
  },
  {
    day: 'Tuesday',
    isClosed: false,
    openAt: '09:00',
    closeAt: '18:00',
  },
  {
    day: 'Wednesday',
    isClosed: false,
    openAt: '09:00',
    closeAt: '18:00',
  },
  {
    day: 'Thursday',
    isClosed: false,
    openAt: '09:00',
    closeAt: '18:00',
  },
  {
    day: 'Friday',
    isClosed: false,
    openAt: '09:00',
    closeAt: '18:00',
  },
  {
    day: 'Saturday',
    isClosed: false,
    openAt: '10:00',
    closeAt: '16:00',
  },
  {
    day: 'Sunday',
    isClosed: true,
    openAt: '',
    closeAt: '',
  },
];

export { defaultOperatingHours };
