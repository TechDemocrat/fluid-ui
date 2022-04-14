import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export class TimeFromNowService {
    /**
     *
     * @param dateString - date string of the published from server
     * @returns relative time string in the format of "2 days ago"
     */
    static getTimeFromNow = (dateString: string) => dayjs(dateString).fromNow();
}
