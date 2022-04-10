import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

/**
 *
 * Simulate Network call delay while development
 * @param delay in seconds
 * @default 4000
 */
export const introduceDelay = async (delay = 4000): Promise<boolean> =>
    new Promise((resolve) =>
        setTimeout(() => {
            resolve(true);
        }, delay),
    );

/**
 *
 * @param dateString - date string of the published from server
 * @returns relative time string in the format of "2 days ago"
 */
export const getProcessedPublishedTime = (dateString: string) => dayjs(dateString).fromNow();
