import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export const formatter = {
  date: (date: Date): string => {
    return format(date, "PPP");
  },
  
  dateWithTime: (date: Date): string => {
    return format(date, "PPP p");
  },
  
  relativeDateLabel: (date: Date): string => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return formatDistanceToNow(date, { addSuffix: true });
  },
  
  recordingTag: (id: string): string => {
    return `REM-${id.slice(0, 6).toUpperCase()}`;
  },
  
  fileSize: (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  },
  
  duration: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  },
}; 