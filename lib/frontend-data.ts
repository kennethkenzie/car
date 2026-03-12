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
    logoUrl: "/logo.png",
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
        title: "Top categories in TV spare parts",
        tiles: [
          { label: "T-CON boards", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", href: "/category/tcon" },
          { label: "Main boards", image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=900&q=80", href: "/category/main-boards" },
          { label: "Power supply", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80", href: "/category/power-supply" },
          { label: "LED backlights", image: "https://images.unsplash.com/photo-1563770660941-10a636076e17?auto=format&fit=crop&w=900&q=80", href: "/category/backlights" },
        ],
        cta: { label: "Shop TV parts", href: "/tv-parts" },
      },
      {
        title: "Repair tools & workshop essentials",
        tiles: [
          { label: "Rework stations", image: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=900", href: "/category/rework-stations" },
          { label: "Multimeters", image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80", href: "/category/multimeters" },
          { label: "Soldering irons", image: "https://images.unsplash.com/photo-1581092334631-7b0c5ed9c4d7?auto=format&fit=crop&w=900&q=80", href: "/category/soldering" },
          { label: "Signal finders", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80", href: "/category/signal-finders" },
        ],
        cta: { label: "Explore repair tools", href: "/tools" },
      },
      {
        title: "Home appliances & replacement parts",
        tiles: [
          { label: "Microwave parts", image: "https://images.unsplash.com/photo-1585655852389-6f9b9c8a2b1c?auto=format&fit=crop&w=900&q=80", href: "/category/microwave-parts" },
          { label: "Fridge spares", image: "https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=900&q=80", href: "/category/fridge-spares" },
          { label: "Washing machine", image: "https://images.unsplash.com/photo-1581579186898-13e6b8e5b8c0?auto=format&fit=crop&w=900&q=80", href: "/category/washing-machine" },
          { label: "Electric kettles", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=900&q=80", href: "/category/kettles" },
        ],
        cta: { label: "Shop appliance parts", href: "/appliances" },
      },
      {
        title: "Popular accessories for installers",
        tiles: [
          { label: "HDMI & AV cables", image: "https://images.unsplash.com/photo-1602524816604-3d0f42c7b9a8?auto=format&fit=crop&w=900&q=80", href: "/category/cables" },
          { label: "TV remotes", image: "https://images.unsplash.com/photo-1617957743094-0c7c9dbe2c35?auto=format&fit=crop&w=900&q=80", href: "/category/remotes" },
          { label: "Wall mounts", image: "https://images.unsplash.com/photo-1581345331967-6d7ccacb7002?auto=format&fit=crop&w=900&q=80", href: "/category/wall-mounts" },
          { label: "Power adapters", image: "https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=900", href: "/category/adapters" },
        ],
        cta: { label: "Explore accessories", href: "/accessories" },
      },
    ],
  },
  latestProducts: {
    title: "Latest",
    ctaLabel: "View all",
    ctaHref: "/products",
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
  brands: [],
  categories: [],
};
