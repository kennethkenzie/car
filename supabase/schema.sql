-- Create custom enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DEALER_OWNER', 'DEALER_MANAGER', 'DEALER_SALES', 'DEALER_VIEWER', 'BUYER');
CREATE TYPE "DealerStatus" AS ENUM ('PENDING', 'ACTIVE', 'DISABLED');
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'VAN');
CREATE TYPE "VehicleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SOLD');
CREATE TYPE "Fuel" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC');
CREATE TYPE "Transmission" AS ENUM ('MANUAL', 'AUTOMATIC');
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'TEST_DRIVE', 'NEGOTIATION', 'WON', 'LOST');

-- Create Dealer table
CREATE TABLE "Dealer" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "logoUrl" TEXT,
    "description" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "status" "DealerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create User table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "dealerId" INTEGER REFERENCES "Dealer"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Vehicle table
CREATE TABLE "Vehicle" (
    "id" SERIAL PRIMARY KEY,
    "dealerId" INTEGER NOT NULL REFERENCES "Dealer"("id") ON DELETE CASCADE,
    "type" "VehicleType" NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'DRAFT',
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuel" "Fuel" NOT NULL,
    "transmission" "Transmission" NOT NULL,
    "bodyType" TEXT,
    "color" TEXT,
    "doors" INTEGER,
    "seats" INTEGER,
    "engineSize" DOUBLE PRECISION,
    "description" TEXT,
    "locationPostcode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create VehicleImage table
CREATE TABLE "VehicleImage" (
    "id" SERIAL PRIMARY KEY,
    "vehicleId" INTEGER NOT NULL REFERENCES "Vehicle"("id") ON DELETE CASCADE,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Enquiry table
CREATE TABLE "Enquiry" (
    "id" SERIAL PRIMARY KEY,
    "vehicleId" INTEGER REFERENCES "Vehicle"("id") ON DELETE SET NULL,
    "dealerId" INTEGER NOT NULL REFERENCES "Dealer"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "notes" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'website',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create LeadSellCar table
CREATE TABLE "LeadSellCar" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "regPlate" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Category table
CREATE TABLE "Category" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE
);

-- Create Article table
CREATE TABLE "Article" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "categoryId" INTEGER NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create MakeModel table
CREATE TABLE "MakeModel" (
    "id" SERIAL PRIMARY KEY,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    UNIQUE("make", "model")
);

-- Create Indexes
CREATE INDEX "Vehicle_make_model_idx" ON "Vehicle"("make", "model");
CREATE INDEX "Vehicle_price_idx" ON "Vehicle"("price");
CREATE INDEX "Vehicle_locationPostcode_idx" ON "Vehicle"("locationPostcode");
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");
