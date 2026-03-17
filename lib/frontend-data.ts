export type NavTopLink = {
  label: string;
  href: string;
  icon: "home" | "info" | "mail";
};

export type NavQuickLink = {
  label: string;
  href: string;
};

export type NavbarData = {
  logoUrl: string;
  logoAlt: string;
  searchPlaceholder: string;
  topLinks: NavTopLink[];
  quickLinks: NavQuickLink[];
};

export type HeroSlide = {
  id: string;
  image: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HeroSideCard = {
  id: string;
  eyebrow: string;
  title: string;
  image: string;
  href: string;
};

export type HeroData = {
  slides: HeroSlide[];
  sideCards: HeroSideCard[];
};

export type TrustItem = {
  icon: "wallet" | "package" | "truck";
  title: string;
  subtitle: string;
};

export type TrustBarData = {
  items: TrustItem[];
};

export type CategoryTile = {
  label: string;
  image: string;
  href: string;
};

export type CategoryCard = {
  title: string;
  tiles: CategoryTile[];
  cta: { label: string; href: string };
};

export type CategoryTilesData = {
  cards: CategoryCard[];
};

export type LatestProduct = {
  id: string;
  name: string;
  shortDesc: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating?: number;
  href: string;
};

export type LatestProductsData = {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  products: LatestProduct[];
};

export type RelatedProduct = {
  id: string;
  title: string;
  image: string;
  href: string;
  rating: number;
  reviews?: string;
  price: string;
  oldPrice?: string;
  tag?: string;
};

export type RelatedProductsData = {
  title: string;
  sponsoredLabel: string;
  pageLabel: string;
  products: RelatedProduct[];
};

export type ProductGalleryItem = {
  id: number;
  image: string;
  alt: string;
  isVideo?: boolean;
};

export type ProductSize = {
  label: string;
  price: string;
  oldPrice?: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductDetailsData = {
  title: string;
  storeLabel: string;
  rating: number;
  ratingsLabel: string;
  bestsellerLabel: string;
  bestsellerCategory: string;
  boughtLabel: string;
  priceMajor: string;
  priceMinor: string;
  shippingLabel: string;
  inStockLabel: string;
  deliveryLabel: string;
  aboutTitle: string;
  aboutItems: string[];
  gallery: ProductGalleryItem[];
  sizes: ProductSize[];
  specs: ProductSpec[];
};

export type Category = {
  id: string;
  title: string;
  rootCategory?: string;
  order: number;
  commission: string;
  isFeatured: boolean;
  isActive: boolean;
  thumbnail: string; // Cloudinary URL
  banner: string; // Cloudinary URL
  icon: string; // Cloudinary URL
  slug: string;
};

export type Brand = {
  id: string;
  title: string;
  slug: string;
  logo: string; // Cloudinary URL
  banner?: string; // Cloudinary URL
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  isFeatured?: boolean;
  order: number;
};

export type FrontendData = {
  navbar: NavbarData;
  hero: HeroData;
  trustBar: TrustBarData;
  categoryTiles: CategoryTilesData;
  latestProducts: LatestProductsData;
  relatedProducts: RelatedProductsData;
  productDetails: ProductDetailsData;
  brands: Brand[];
  categories: Category[];
};

export const defaultFrontendData: FrontendData = {
  navbar: {
    logoUrl: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773677628/CAR_2_wl4xru.svg",
    logoAlt: "Car Bazaar",
    searchPlaceholder: "Search here...",
    topLinks: [
      { label: "Home", href: "/", icon: "home" },
      { label: "About Us", href: "/about", icon: "info" },
      { label: "Contact", href: "/contact", icon: "mail" },
    ],
    quickLinks: [
      { label: "TV Parts", href: "/tv-parts" },
      { label: "Featured Category", href: "/featured" },
      { label: "Hot Deals!", href: "/wholesale" },
      { label: "Blog", href: "/blog" },
    ],
  },
  hero: {
    slides: [
      {
        id: "s1",
        image: "/slider-1.png",
        title: "Discover Your Dream Car at Car Bazaar",
        description: "Explore our premium collection of luxury sedans and sports cars. Quality and trust in every mile.",
        ctaLabel: "View Inventory",
        ctaHref: "#",
      },
      {
        id: "s2",
        image: "/slider-2.png",
        title: "Rugged Versatility for Every Adventure",
        description: "Our SUV and 4x4 collection is built for power and comfort. Find the perfect companion for your journey.",
        ctaLabel: "Explore SUVs",
        ctaHref: "#",
      },
      {
        id: "s3",
        image: "/slider-3.png",
        title: "Professional Maintenance & Service",
        description: "Our high-tech service center ensures your vehicle remains in peak condition. Reliability you can count on.",
        ctaLabel: "Book Service",
        ctaHref: "#",
      },
    ],
    sideCards: [
      {
        id: "c1",
        eyebrow: "REWORK STATION",
        title: "Low Price, Good Quality..",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
        href: "/category/rework-station",
      },
      {
        id: "c2",
        eyebrow: "DB METER",
        title: "Buy Best TV Signal Finder...",
        image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80",
        href: "/category/db-meter",
      },
    ],
  },
  trustBar: {
    items: [
      { icon: "wallet", title: "Secure Shopping", subtitle: "100% Safe & Secure" },
      { icon: "package", title: "Easy Support", subtitle: "Whatsapp & Call" },
      { icon: "truck", title: "Fast Delivery", subtitle: "Fast delivery around Kampala" },
    ],
  },
  categoryTiles: {
    cards: [
      {
        title: "Popular Brands",
        tiles: [
          { label: "Toyota", image: "https://images.unsplash.com/photo-1619682817481-e994891cc1f5?auto=format&fit=crop&w=800&q=80", href: "/cars?make=Toyota" },
          { label: "Mercedes", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80", href: "/cars?make=Mercedes" },
          { label: "BMW", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", href: "/cars?make=BMW" },
          { label: "Audi", image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800&q=80", href: "/cars?make=Audi" },
        ],
        cta: { label: "View all makes", href: "/cars" },
      },
      {
        title: "Browse by Style",
        tiles: [
          { label: "SUV", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", href: "/cars?bodyType=SUV" },
          { label: "Sedan", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80", href: "/cars?bodyType=Sedan" },
          { label: "Pickup", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", href: "/cars?bodyType=Pickup" },
          { label: "Hatchback", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", href: "/cars?bodyType=Hatchback" },
        ],
        cta: { label: "All body styles", href: "/cars" },
      },
      {
        title: "Fuel Types",
        tiles: [
          { label: "Electric", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80", href: "/cars?fuel=Electric" },
          { label: "Hybrid", image: "https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?auto=format&fit=crop&w=800&q=80", href: "/cars?fuel=Hybrid" },
          { label: "Petrol", image: "https://images.unsplash.com/photo-1553921007-99d744c51201?auto=format&fit=crop&w=800&q=80", href: "/cars?fuel=Petrol" },
          { label: "Diesel", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80", href: "/cars?fuel=Diesel" },
        ],
        cta: { label: "Compare fuel types", href: "/cars" },
      },
      {
        title: "Budget Deals",
        tiles: [
          { label: "Under 20M", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80", href: "/cars?priceMax=20000000" },
          { label: "20M - 50M", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80", href: "/cars?priceMin=20000000&priceMax=50000000" },
          { label: "50M - 100M", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80", href: "/cars?priceMin=50000000&priceMax=100000000" },
          { label: "Luxury", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80", href: "/cars?priceMin=100000000" },
        ],
        cta: { label: "View all deals", href: "/cars" },
      },
    ],
  },
  latestProducts: {
    title: "Latest",
    ctaLabel: "View all",
    ctaHref: "/inventory",
    products: [
      { 
        id: "v1", 
        name: "Mercedes-Benz C-Class C200", 
        shortDesc: "Premium luxury sedan with AMG line styling and panoramic roof.", 
        image: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800", 
        price: 45000, 
        oldPrice: 48000, 
        discountPercent: 6, 
        rating: 4.8, 
        href: "/cars/mercedes-c-class" 
      },
      { 
        id: "v2", 
        name: "Audi A5 Sportback 40 TFSI", 
        shortDesc: "Elegant coupe-inspired design with advanced technology features.", 
        image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800", 
        price: 38500, 
        oldPrice: 41000, 
        discountPercent: 6, 
        rating: 4.7, 
        href: "/cars/audi-a5" 
      },
      { 
        id: "v3", 
        name: "Volkswagen Golf R-Line", 
        shortDesc: "The ultimate hatchback with sporty R-Line trim and efficient engine.", 
        image: "https://images.pexels.com/photos/1519192/pexels-photo-1519192.jpeg?auto=compress&cs=tinysrgb&w=800", 
        price: 24000, 
        oldPrice: 26500, 
        discountPercent: 9, 
        rating: 4.9, 
        href: "/cars/vw-golf" 
      },
      { 
        id: "v4", 
        name: "Ford Transit Custom Sport", 
        shortDesc: "Reliable and powerful van with sporty exterior and comfortable cabin.", 
        image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800", 
        price: 28000, 
        oldPrice: 31000, 
        discountPercent: 10, 
        rating: 4.6, 
        href: "/vans/ford-transit" 
      },
      { 
        id: "v5", 
        name: "Toyota Land Cruiser V8", 
        shortDesc: "Legendary off-road performance meets uncompromising luxury.", 
        image: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=800", 
        price: 85000, 
        oldPrice: 92000, 
        discountPercent: 7, 
        rating: 5.0, 
        href: "/cars/toyota-land-cruiser" 
      },
    ],
  },
  relatedProducts: {
    title: "Products related to this item",
    sponsoredLabel: "Sponsored",
    pageLabel: "Page 1 of 58",
    products: [
      { id: "1", title: "Instant Pot Cooking Times Chart - Pressure Cooker Accessories Cook Times - Easy to ...", image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=700&q=80", href: "/product/cooking-times-chart", rating: 5, reviews: "8,826", price: "UGX 35,000" },
      { id: "2", title: "10 in 1 Electric Pressure Cooker with 24-Hour Reservation Function, 6L, Slow Cooker...", image: "https://images.unsplash.com/photo-1585515656973-94d1ea4f5b0b?auto=format&fit=crop&w=700&q=80", href: "/product/10-in-1-pressure-cooker", rating: 5, price: "UGX 275,000" },
      { id: "3", title: "12-in-1 Electric Pressure Cooker 8 Quart, 1200W olla de presion Multi-Cooker with S...", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80", href: "/product/12-in-1-electric-cooker", rating: 4, reviews: "7", price: "UGX 310,000" },
      { id: "4", title: "9-in-1 Electric Pressure Cooker 6 Qt, Dual Inner Pots, Stainless Steel Pot and Non-...", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80", href: "/product/9-in-1-pressure-cooker", rating: 4, reviews: "12", price: "UGX 335,000" },
      { id: "5", title: "Barton 8QT Pressure Canner Release Valve Aluminum Canning Pot Cooker Pot Stove Top ...", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=700&q=80", href: "/product/barton-pressure-canner", rating: 4, reviews: "4,075", price: "UGX 165,000" },
      { id: "6", title: "CHEF iQ Smart Pressure Cooker with WiFi and Built-in Scale - Easy-to-Use 10-in-1 Mu...", image: "https://images.unsplash.com/photo-1585515656882-cfb0c9d8689b?auto=format&fit=crop&w=700&q=80", href: "/product/chef-iq-smart-cooker", rating: 5, reviews: "2,976", price: "UGX 520,000", oldPrice: "UGX 650,000", tag: "Limited time deal" },
      { id: "7", title: "KINGBULL 12-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Saute...", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=700&q=80", href: "/product/kingbull-12-in-1", rating: 5, reviews: "63", price: "UGX 365,000" },
    ],
  },
  productDetails: {
    title: "Instant Pot Duo Plus 9-in-1 Multicooker, Pressure Cooker, Slow Cook, Rice Maker, Steamer, Saute, Yogurt, Warmer & Sterilizer, Stainless Steel, 6 Quarts",
    storeLabel: "Visit Car Bazaar Ltd",
    rating: 4.4,
    ratingsLabel: "52,048 ratings",
    bestsellerLabel: "#1 Best Seller",
    bestsellerCategory: "in Electric Pressure Cookers",
    boughtLabel: "5K+ bought in past month",
    priceMajor: "420",
    priceMinor: ",000",
    shippingLabel: "UGX 58,000 shipping to Uganda.",
    inStockLabel: "In Stock",
    deliveryLabel: "Thursday, March 19",
    aboutTitle: "About this item",
    aboutItems: [
      "9 cooking functions: pressure cook, slow cook, saute, steam, sterilize, rice, soup, yogurt and warm.",
      "Customizable smart programs to make everyday meals easy and consistent.",
      "Intuitive display with cooking progress, time indicator and one-touch controls.",
      "Durable stainless steel cooking pot with easy-clean interior and removable sealing parts.",
    ],
    gallery: [
      { id: 1, image: "https://images.unsplash.com/photo-1585515656973-94d1ea4f5b0b?auto=format&fit=crop&w=900&q=80", alt: "Pressure cooker front view" },
      { id: 2, image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80", alt: "Pressure cooker in kitchen" },
      { id: 3, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80", alt: "Cooked meal example" },
      { id: 4, image: "https://images.unsplash.com/photo-1585515656882-cfb0c9d8689b?auto=format&fit=crop&w=900&q=80", alt: "Open lid cooker detail" },
      { id: 5, image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80", alt: "Preset cooking programs" },
      { id: 6, image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=900&q=80", alt: "Top view" },
      { id: 7, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80", alt: "Video preview", isVideo: true },
    ],
    sizes: [
      { label: "3 Quarts", price: "UGX 285,000", oldPrice: "UGX 349,000" },
      { label: "6 Quarts", price: "UGX 420,000", oldPrice: "UGX 489,000" },
    ],
    specs: [
      { label: "Brand", value: "Modern Electronics Ltd" },
      { label: "Capacity", value: "6 Quarts" },
      { label: "Material", value: "Stainless steel" },
      { label: "Color", value: "Stainless Plus" },
      { label: "Finish Type", value: "Chrome" },
      { label: "Product Dimensions", value: "12.2\"D x 13.39\"W x 12.99\"H" },
      { label: "Special Feature", value: "Electric stovetop compatible" },
      { label: "Wattage", value: "1000 watts" },
      { label: "Item Weight", value: "12.35 Pounds" },
      { label: "Control Method", value: "Touch" },
    ],
  },
  brands: [
    {
      id: "brand1",
      title: "Toyota",
      slug: "toyota",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678120/emblem_001_whtz1b.jpg",
      isActive: true,
      isFeatured: true,
      order: 1,
    },
    {
      id: "brand2",
      title: "Mercedes-Benz",
      slug: "mercedes-benz",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678164/Mercedes-Logo.svg_byuwhe.png",
      isActive: true,
      isFeatured: true,
      order: 2,
    },
    {
      id: "brand3",
      title: "BMW",
      slug: "bmw",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678299/BMW.svg_1_xr7kfq.png",
      isActive: true,
      isFeatured: true,
      order: 3,
    },
    {
      id: "brand4",
      title: "Audi",
      slug: "audi",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678348/Audi-Logo-Banner_qqez29.avif",
      isActive: true,
      isFeatured: true,
      order: 4,
    },
    {
      id: "brand5",
      title: "Volkswagen",
      slug: "volkswagen",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678695/Volkswagen_logo_aruqsa.png",
      isActive: true,
      isFeatured: true,
      order: 5,
    },
    {
      id: "brand6",
      title: "Ford",
      slug: "ford",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678840/Ford-Logo-720x405_jud2s4.png",
      isActive: true,
      isFeatured: true,
      order: 6,
    },
    {
      id: "brand7",
      title: "Nissan",
      slug: "nissan",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678919/nissan-logo-png_seeklogo-99770_karkw9.png",
      isActive: true,
      isFeatured: true,
      order: 7,
    },
    {
      id: "brand8",
      title: "Land Rover",
      slug: "land-rover",
      logo: "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773678917/Land-Rover-emblem_o8lmc2.jpg",
      isActive: true,
      isFeatured: true,
      order: 8,
    },
  ],
  categories: [
    {
      id: "cat1",
      title: "SUV",
      order: 1,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "car-front",
      slug: "suv",
    },
    {
      id: "cat2",
      title: "Sedan",
      order: 2,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "car",
      slug: "sedan",
    },
    {
      id: "cat3",
      title: "Hatchback",
      order: 3,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "layout-grid",
      slug: "hatchback",
    },
    {
      id: "cat4",
      title: "Pickup",
      order: 4,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "truck",
      slug: "pickup",
    },
    {
      id: "cat5",
      title: "Coupe",
      order: 5,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "gauge",
      slug: "coupe",
    },
    {
      id: "cat6",
      title: "Convertible",
      order: 6,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "wind",
      slug: "convertible",
    },
    {
      id: "cat7",
      title: "Luxury",
      order: 7,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "crown",
      slug: "luxury",
    },
    {
      id: "cat8",
      title: "Electric",
      order: 8,
      commission: "0",
      isFeatured: true,
      isActive: true,
      thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
      banner: "",
      icon: "battery-charging",
      slug: "electric",
    },
  ],
};
