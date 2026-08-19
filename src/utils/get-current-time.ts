import { getHours } from "date-fns";

export function getCurrentTime() {
  const hours = getHours(new Date());

  switch (true) {
    case hours >= 0 && hours < 10:
      return "Pagi";
    case hours >= 10 && hours < 15:
      return "Siang";
    case hours >= 15 && hours < 19:
      return "Sore";
    default:
      return "Malam";
  }
}
