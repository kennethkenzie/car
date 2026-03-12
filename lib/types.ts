export interface Vehicle {
  id: string;
  slug?: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  price: number | string;
  type: "CAR" | "VAN";
  postcode: string;
  images: Array<string | { url: string }>;
  features?: string[];
  description?: string;
  status: "PUBLISHED" | "DRAFT" | "SOLD" | "ARCHIVED";
  dealerId: string;
}

export interface Dealer {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  logoUrl?: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
}

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "DEALER_OWNER" | "DEALER_STAFF" | "ADMIN" | "DEALER";
  name?: string;
  dealerId?: string;
}
