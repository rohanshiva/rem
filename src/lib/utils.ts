import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shadow = {
  sm: {
    boxShadow:
      "0px 2px 5px 0px rgba(232, 214, 180, 25%), inset 0px 2px 5px 0px rgb(232, 214, 180)",
    normal:
      "shadow-[0px_2px_5px_0px_rgba(232, 214, 180,25%)] shadow-[inset_0px_2px_5px_0px_rgb(232, 214, 180)]",
    hover:
      "hover:shadow-[0px_2px_5px_0px_rgba(232, 214, 180,25%)] hover:shadow-[inset_0px_2px_5px_0px_rgb(232, 214, 180)]",
  },
  md: {
    boxShadow:
      "0px 4px 10px 0px rgba(232, 214, 180, 25%), inset 0px 4px 10px 0px rgb(232, 214, 180)",
    normal:
      "shadow-[0px_4px_10px_0px_rgba(232, 214, 180,25%)] shadow-[inset_0px_4px_10px_0px_rgb(232, 214, 180)]",
    hover:
      "hover:shadow-[0px_4px_10px_0px_rgba(232, 214, 180,25%)] hover:shadow-[inset_0px_4px_10px_0px_rgb(232, 214, 180)]",
  },
  lg: {
    boxShadow:
      "0px 6px 15px 0px rgba(232, 214, 180, 25%), inset 0px 6px 15px 0px rgb(232, 214, 180)",
    normal:
      "shadow-[0px_6px_15px_0px_rgba(232, 214, 180,25%)] shadow-[inset_0px_6px_15px_0px_rgb(232, 214, 180)]",
    hover:
      "hover:shadow-[0px_6px_15px_0px_rgba(232, 214, 180,25%)] hover:shadow-[inset_0px_6px_15px_0px_rgb(232, 214, 180)]",
  },
};