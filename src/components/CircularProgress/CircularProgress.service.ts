export class CircularProgressService {
    // actions goes here
    static getStrokeDashForProgress = (
        radius: number,
        totalProgress: number,
        currentProgress: number,
    ): { strokeDashArray: string; strokeDashOffset: number } => {
        const circumference = 2 * Math.PI * radius; // to find the circumference of the circle with radius given (2PIr - trigonometric formula)
        const strokeDashArray = `${circumference} ${circumference}`;
        const strokeDashOffset = circumference - (currentProgress / totalProgress) * circumference; // progress
        return { strokeDashArray, strokeDashOffset };
    };
}
