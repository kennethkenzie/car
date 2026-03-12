export async function getPublicVehicles(type?: "CAR" | "VAN") {
  // Simulating fetching data
  const all = [
    { id: "1", type: "CAR", make: "Mercedes-Benz", model: "C-Class", trim: "C200 AMG Line", year: 2022, price: 45000, mileage: 12500, status: "PUBLISHED", fuel: "Petrol", transmission: "Automatic", postcode: "KLA-01", images: ["/slider-1.png"] },
    { id: "2", type: "CAR", make: "Toyota", model: "Land Cruiser", trim: "V8 VX", year: 2021, price: 85000, mileage: 34000, status: "PUBLISHED", fuel: "Diesel", transmission: "Automatic", postcode: "ENT-05", images: ["/slider-2.png"] },
    { id: "3", type: "CAR", make: "BMW", model: "X5", trim: "xDrive40i", year: 2023, price: 65000, mileage: 5000, status: "PUBLISHED", fuel: "Petrol", transmission: "Automatic", postcode: "KLA-02", images: ["/slider-3.png"] },
    { id: "5", type: "VAN", make: "Ford", model: "Transit", trim: "Custom", year: 2022, price: 35000, mileage: 15000, status: "PUBLISHED", fuel: "Diesel", transmission: "Manual", postcode: "KLA-03", images: ["/slider-1.png"] },
  ];
  
  if (type) return all.filter(v => v.type === type);
  return all;
}

export async function fetchDealerInventory() {
  return getPublicVehicles();
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

export async function getDealers(): Promise<any[]> {
  return [
    { 
      id: "d1", 
      name: "Main Bond Showroom", 
      slug: "main-bond", 
      email: "main@carbazaar.com", 
      phone: "+256 700 111 222", 
      address: "Plot 12, Kampala Rd", 
      postcode: "KLA-01", 
      status: "ACTIVE" 
    },
    { 
      id: "d2", 
      name: "Luxury Collection Office", 
      slug: "luxury-office", 
      email: "luxury@carbazaar.com", 
      phone: "+256 700 333 444", 
      address: "Entebbe Rd, Zana", 
      postcode: "ENT-05", 
      status: "PENDING" 
    },
  ];
}

export async function adminCreateDealer(formData: FormData) {
  console.log("Admin creating dealer:", Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function updateDealerReal(slug: string, formData: FormData) {
  console.log(`Updating dealer ${slug} with:`, Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function deleteDealerReal(slug: string) {
  console.log(`Deleting dealer ${slug}`);
  return { success: true };
}

export async function getVehicleReal(slug: string) {
  const all = await getPublicVehicles();
  const vehicle = all.find(v => v.id === slug || v.id === "1"); // Fallback for demo
  if (!vehicle) return null;
  
  return {
    ...vehicle,
    features: [
      "2-Zone Automatic Climate Control",
      "Apple CarPlay & Android Auto",
      "Heated Front Seats",
      "LED Headlights with Signature DRL",
      "Panoramic Sunroof",
      "Premium Surround Sound System",
      "Park Assist with 360 Camera",
      "Adaptive Cruise Control"
    ],
    description: "This exceptional vehicle represents the pinnacle of its class, offering a perfect blend of performance, luxury, and technology. Meticulously maintained and fully inspected by our Car Bazaar specialists.\n\nKey Highlights:\n- One previous owner\n- Full service history\n- Professional ceramic coating\n- Extended warranty available",
    dealerId: "d1"
  };
}

export async function getSimilarVehiclesReal(slug: string, type: "CAR" | "VAN") {
  const all = await getPublicVehicles(type);
  return all.filter(v => v.id !== slug);
}
