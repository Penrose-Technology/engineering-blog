import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export const formatDate = (date: string) => {
	// in a week
	if (dayjs(date).isBetween(dayjs().subtract(7, 'day'), dayjs())) {
		return dayjs(date).fromNow();
	}

	// the current year
	if (dayjs(date).get('year') === dayjs().get('year')) {
		return dayjs(date).format('MMM.D');
	}

	// before the current year
	return dayjs(date).format('YYYY.MMM.D');
};
