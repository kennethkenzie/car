export function formatGBP(amount: number | string) {
  const numericAmount = typeof amount === "string" 
    ? Number(amount.replace(/[^0-9.-]+/g, "")) 
    : amount;

  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function formatUGX(amount: number | string) {
  const numericAmount = typeof amount === "string" 
    ? Number(amount.replace(/[^0-9.-]+/g, "")) 
    : amount;

  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
