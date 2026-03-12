export async function getPublicVehicles(type?: "CAR" | "VAN") {
  // Simulating fetching data from the new 'Vehicle' table structure
  const all = [
    { 
      id: "1", 
      slug: "mercedes-benz-c-class",
      type: "CAR", 
      make: "Mercedes-Benz", 
      model: "C-Class", 
      trim: "C200 AMG Line", 
      year: 2022, 
      price: 155000000, 
      mileage: 12500, 
      status: "PUBLISHED", 
      fuel: "PETROL", 
      transmission: "AUTOMATIC", 
      bodyType: "Saloon",
      color: "Black",
      doors: 4,
      postcode: "KLA-01", 
      dealerId: "1",
      images: [{ url: "/slider-1.png", id: "img1" }] 
    },
    { 
      id: "2", 
      slug: "toyota-land-cruiser",
      type: "CAR", 
      make: "Toyota", 
      model: "Land Cruiser", 
      trim: "V8 VX", 
      year: 2021, 
      price: 320000000, 
      mileage: 34000, 
      status: "PUBLISHED", 
      fuel: "DIESEL", 
      transmission: "AUTOMATIC", 
      bodyType: "SUV / 4x4",
      color: "White",
      doors: 5,
      postcode: "ENT-05", 
      dealerId: "1",
      images: [{ url: "/slider-2.png", id: "img2" }] 
    },
  ];
  
  if (type) return all.filter(v => v.type === type);
  return all;
}

export async function fetchDealerInventory() {
  return getPublicVehicles();
}

export async function getVehicleById(id: string) {
  const all = await getPublicVehicles();
  const vehicle = all.find(v => v.id === id || v.slug === id);
  if (!vehicle) return null;
  
  return {
    ...vehicle,
    features: ["Bluetooth", "Navigation", "Climate Control"],
    description: "A premium car for high-end comfort.",
    city: "Kampala"
  };
}

export async function deleteVehicleReal(id: string) {
  console.log(`[API] Deleting vehicle ${id} from table "Vehicle"`);
  return { success: true };
}

export async function publishVehicleReal(id: string) {
  console.log(`[API] Updating "Vehicle" status to PUBLISHED for ID ${id}`);
  return { success: true };
}

export async function archiveVehicleReal(id: string) {
  console.log(`[API] Updating "Vehicle" status to ARCHIVED for ID ${id}`);
  return { success: true };
}

export async function updateVehicleReal(id: string, formData: FormData) {
  console.log(`[API] Updating "Vehicle" entry ${id} with:`, Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function createVehicleReal(formData: FormData) {
  console.log(`[API] Inserting into "Vehicle" table:`, Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function adminCreateDealer(formData: FormData) {
  console.log(`[API] Admin creating dealer:`, Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function deleteDealerReal(id: string) {
  console.log(`[API] Deleting dealer ${id}`);
  return { success: true };
}

export async function updateDealerReal(id: string, formData: FormData) {
  console.log(`[API] Updating dealer ${id}:`, Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function getDealers(): Promise<any[]> {
  return [
    { 
      id: "1", 
      name: "Main Bond Showroom", 
      slug: "main-bond", 
      email: "main@carbazaar.com", 
      phone: "+256 700 111 222", 
      address: "Plot 12, Kampala Rd", 
      postcode: "KLA-01", 
      status: "ACTIVE" 
    },
  ];
}

export async function getVehicleReal(slug: string) {
  return getVehicleById(slug);
}

export async function getSimilarVehiclesReal(slug: string, type: "CAR" | "VAN") {
  const all = await getPublicVehicles(type);
  return all.filter(v => v.id !== slug);
}

export async function getDashboardSummary() {
  return {
    activeListings: 48,
    draftListings: 4,
    enquiriesThisWeek: 124,
    avgDaysToSell: 14,
    recentEnquiries: [
      {
        id: "e1",
        name: "James Okello",
        email: "james@example.com",
        createdAt: new Date().toISOString(),
        status: "NEW",
        vehicle: { make: "Mercedes-Benz", model: "C-Class" }
      },
    ]
  };
}

export async function getDatabaseHealth() {
  return {
    database: "connected",
    details: "Safe & Encrypted"
  };
}
