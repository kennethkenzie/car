// Mock API for Car Bazaar Inventory
// In a real app, these would call Supabase or another backend

export async function getDealerVehicles() {
  // Simulating fetching data
  return [
    { id: "1", make: "Mercedes-Benz", model: "C-Class", trim: "C200 AMG Line", year: 2022, price: 45000, mileage: 12500, status: "PUBLISHED", images: ["/slider-1.png"] },
    { id: "2", make: "Toyota", model: "Land Cruiser", trim: "V8 VX", year: 2021, price: 85000, mileage: 34000, status: "DRAFT", images: ["/slider-2.png"] },
    { id: "3", make: "BMW", model: "X5", trim: "xDrive40i", year: 2023, price: 65000, mileage: 5000, status: "PUBLISHED", images: ["/slider-3.png"] },
    { id: "4", make: "Range Rover", model: "Sport", trim: "HSE Dynamic", year: 2020, price: 55000, mileage: 48000, status: "ARCHIVED", images: ["/slider-1.png"] },
  ];
}

export async function deleteVehicleReal(id: string) {
  console.log(`Deleting vehicle ${id}`);
  return { success: true };
}

export async function publishVehicleReal(id: string) {
  console.log(`Publishing vehicle ${id}`);
  return { success: true };
}

export async function archiveVehicleReal(id: string) {
  console.log(`Archiving vehicle ${id}`);
  return { success: true };
}

export async function createVehicleReal(formData: FormData) {
  console.log("Creating vehicle with data:", Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function getDealers() {
  return [
    { id: "d1", name: "Main Bond Showroom" },
    { id: "d2", name: "Luxury Collection Office" },
  ];
}
