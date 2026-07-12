export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

export const categories = [
  "All Products",
  "T-Shirts",
  "Hoodies",
  "Crewnecks",
  "Long-Sleeves",
  "Caps",
  "Totes",
] as const;

export type Category = (typeof categories)[number];

export const products: Product[] = [
  {
    id: "1",
    slug: "sunset-wave-tee",
    name: "Sunset Wave Tee",
    description: "Premium cotton tee with watercolor sunset print",
    longDescription:
      "Wrap yourself in golden hour. The Sunset Wave Tee features a hand-painted watercolor gradient of warm pinks, oranges, and yellows across the chest. Cut from 100% combed ring-spun cotton for a buttery-soft feel that holds its shape wash after wash. Pre-shrunk, side-seamed, and printed with eco-friendly water-based inks.",
    price: 32.0,
    image: "/imgs/sunset_wave_tee.jpg",
    category: "T-Shirts",
    rating: 4.8,
    reviews: 312,
    inStock: true,
    isBestseller: true,
    colors: ["White", "Sand", "Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: [
      "100% combed ring-spun cotton, 180gsm",
      "Hand-illustrated watercolor artwork",
      "Water-based, eco-friendly inks",
      "Pre-shrunk and side-seamed fit",
      "Tear-away neck label",
      "Machine washable, fade resistant",
    ],
  },
  {
    id: "2",
    slug: "mountain-peak-hoodie",
    name: "Mountain Peak Hoodie",
    description: "Heavyweight hoodie with minimalist mountain graphic",
    longDescription:
      "Built for crisp mornings and quiet summits. The Mountain Peak Hoodie is a heavyweight 400gsm fleece with a minimalist white mountain silhouette printed on the chest. Features a double-lined hood, ribbed cuffs and hem, and a generous kangaroo pocket. Cut for a relaxed unisex fit.",
    price: 68.0,
    image: "/imgs/mountain_peak_hoodie.jpg",
    category: "Hoodies",
    rating: 4.9,
    reviews: 487,
    inStock: true,
    isBestseller: true,
    colors: ["Black", "Charcoal", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [
      "400gsm heavyweight brushed-back fleece",
      "Double-lined drawstring hood",
      "Kangaroo pocket with hidden phone sleeve",
      "Ribbed cuffs and hem",
      "YKK metal eyelets and tipped drawcords",
      "Relaxed unisex fit, runs true to size",
    ],
  },
  {
    id: "3",
    slug: "cosmic-dreams-tee",
    name: "Cosmic Dreams Tee",
    description: "Navy tee with vibrant galaxy print",
    longDescription:
      "Wear the night sky. The Cosmic Dreams Tee features an original hand-illustrated galaxy illustration with deep purples, electric blues, and pinks. Cut from heavyweight ring-spun cotton, garment-dyed for that broken-in, vintage feel from the very first wear.",
    price: 36.0,
    image: "/imgs/cosmic_dreams_tee.jpg",
    category: "T-Shirts",
    rating: 4.7,
    reviews: 256,
    inStock: true,
    isNew: true,
    colors: ["Navy", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    features: [
      "220gsm heavyweight cotton",
      "Garment-dyed for vintage feel",
      "Original galaxy illustration",
      "Side-seamed, retail fit",
      "Reactive-dyed so colors stay vibrant",
      "Tear-away neck label",
    ],
  },
  {
    id: "4",
    slug: "botanical-crewneck",
    name: "Botanical Crewneck",
    description: "Cream crewneck with minimalist line art",
    longDescription:
      "Quietly beautiful. The Botanical Crewneck features a delicate hand-drawn illustration of trailing vines and leaves in a single-color line art style. Midweight 320gsm fleece, drop shoulder, and ribbed collar for a clean, modern silhouette.",
    price: 54.0,
    image: "/imgs/botanical_crewneck.jpg",
    category: "Crewnecks",
    rating: 4.6,
    reviews: 178,
    inStock: true,
    colors: ["Cream", "Sage", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "320gsm midweight fleece",
      "Original hand-drawn illustration",
      "Drop shoulder, relaxed fit",
      "1x1 ribbed collar, cuffs, and hem",
      "Twill tape at neck for comfort",
      "OEKO-TEX certified cotton blend",
    ],
  },
  {
    id: "5",
    slug: "retro-geometric-sweatshirt",
    name: "Retro Geometric Sweatshirt",
    description: "Geometric pattern in mustard and terracotta",
    longDescription:
      "A throwback to 70s optimism. The Retro Geometric Sweatshirt features a repeating geometric tile pattern in warm mustard, terracotta, and cream. Midweight fleece with a classic crew neck, ribbed trim, and a vintage-soft hand feel.",
    price: 58.0,
    image: "/imgs/retro_geometric_sweatshirt.jpg",
    category: "Crewnecks",
    rating: 4.5,
    reviews: 142,
    inStock: true,
    isNew: true,
    colors: ["Heather Gray", "Sand"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [
      "300gsm midweight fleece",
      "All-over print, seamless pattern",
      "Vintage-soft enzyme wash",
      "Classic crew neckline",
      "Twill-reinforced neck tape",
      "Pre-shrunk for consistent fit",
    ],
  },
  {
    id: "6",
    slug: "abstract-splash-longsleeve",
    name: "Abstract Splash Long-Sleeve",
    description: "White long-sleeve with multicolor paint splatter",
    longDescription:
      "An original piece of wearable art. The Abstract Splash Long-Sleeve features a hand-painted multicolor paint splatter design that makes every piece one of a kind. Lightweight cotton jersey, perfect for layering or wearing solo.",
    price: 42.0,
    image: "/imgs/abstract_splash_longsleeve.jpg",
    category: "Long-Sleeves",
    rating: 4.7,
    reviews: 198,
    inStock: true,
    colors: ["White", "Off-White"],
    sizes: ["XS", "S", "M", "L", "XL"],
    features: [
      "180gsm lightweight cotton jersey",
      "Hand-painted original artwork",
      "Slight variations make each unique",
      "Ribbed crew neck and cuffs",
      "Side vents at hem",
      "Pre-washed for softness",
    ],
  },
  {
    id: "7",
    slug: "focus-typography-tee",
    name: "Focus Typography Tee",
    description: "Olive tee with bold FOCUS typography",
    longDescription:
      "Sometimes the message is the design. The Focus Typography Tee features bold minimalist sans-serif typography on the chest. Cut from heavyweight cotton with a generous, contemporary fit. Designed to be worn on repeat.",
    price: 32.0,
    image: "/imgs/focus_typography_tee.jpg",
    category: "T-Shirts",
    rating: 4.8,
    reviews: 421,
    inStock: true,
    isBestseller: true,
    colors: ["Olive", "Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [
      "220gsm heavyweight cotton",
      "Bold screen-printed typography",
      "Discharge ink for soft hand feel",
      "Drop shoulder, modern fit",
      "Reinforced shoulder seams",
      "Tear-away label",
    ],
  },
  {
    id: "8",
    slug: "urban-skyline-hoodie",
    name: "Urban Skyline Hoodie",
    description: "Charcoal hoodie with city skyline print",
    longDescription:
      "For the dreamers who walk the city at night. The Urban Skyline Hoodie features an artistic city skyline silhouette in white and gold across the chest. Heavyweight fleece, double-lined hood, and a brushed inner for serious warmth.",
    price: 72.0,
    image: "/imgs/urban_skyline_hoodie.jpg",
    category: "Hoodies",
    rating: 4.9,
    reviews: 367,
    inStock: true,
    isBestseller: true,
    colors: ["Charcoal", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [
      "420gsm heavyweight fleece",
      "Metallic gold ink detail",
      "Brushed inner for warmth",
      "Reinforced kangaroo pocket",
      "Metal-tipped drawcords",
      "Relaxed unisex fit",
    ],
  },
  {
    id: "9",
    slug: "wave-cap",
    name: "Wave Cap",
    description: "Six-panel cap with embroidered wave logo",
    longDescription:
      "Six-panel low-profile cap with a hand-stitched embroidered wave logo on the front. Premium brushed cotton twill, curved brim, and an adjustable metal clasp closure. One size, broken-in feel from day one.",
    price: 28.0,
    image: "/imgs/wave_cap.jpg",
    category: "Caps",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    colors: ["Black", "Stone", "Navy"],
    sizes: ["One Size"],
    features: [
      "100% brushed cotton twill",
      "Hand-embroidered logo",
      "Curved brim, six-panel construction",
      "Adjustable metal clasp closure",
      "Pre-curved visor",
      "Cotton sweatband",
    ],
  },
  {
    id: "10",
    slug: "cat-tote",
    name: "Cat Tote",
    description: "Canvas tote with hand-drawn cat illustration",
    longDescription:
      "Heavyweight 12oz natural canvas tote with an original hand-drawn cat illustration printed on the front. Reinforced straps, double-stitched seams, and an interior pocket. Perfect for books, groceries, or the daily carry.",
    price: 24.0,
    image: "/imgs/cat_tote.jpg",
    category: "Totes",
    rating: 4.7,
    reviews: 234,
    inStock: true,
    isNew: true,
    colors: ["Natural", "Black"],
    sizes: ["One Size"],
    features: [
      "12oz heavyweight natural canvas",
      "Original hand-drawn illustration",
      "Reinforced 22-inch cotton webbing straps",
      "Interior hanging pocket",
      "Double-stitched seams",
      "Water-based ink print",
    ],
  },
  {
    id: "11",
    slug: "lightning-tee",
    name: "Lightning Bolt Tee",
    description: "Pop-art lightning bolt graphic tee",
    longDescription:
      "Channel pure energy. The Lightning Bolt Tee features a pop-art style comic book lightning bolt in vibrant yellow and red on premium white cotton. A nod to comic book nostalgia, executed with modern fit and finish.",
    price: 34.0,
    image: "/imgs/lightning_tee.jpg",
    category: "T-Shirts",
    rating: 4.5,
    reviews: 188,
    inStock: true,
    colors: ["White", "Black"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "180gsm combed cotton",
      "Vibrant pop-art print",
      "Side-seamed retail fit",
      "Shoulder-to-shoulder neck tape",
      "Tear-away label",
      "Pre-shrunk",
    ],
  },
  {
    id: "12",
    slug: "wolf-emblem-tee",
    name: "Wolf Emblem Tee",
    description: "Vintage circular emblem with wolf illustration",
    longDescription:
      "Heritage-inspired heavyweight tee with a vintage distressed circular emblem featuring a wolf silhouette and retro typography. Garment-dyed for a soft, broken-in feel, with a relaxed contemporary fit.",
    price: 38.0,
    image: "/imgs/wolf_emblem_tee.jpg",
    category: "T-Shirts",
    rating: 4.8,
    reviews: 274,
    inStock: true,
    isBestseller: true,
    colors: ["Maroon", "Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [
      "240gsm heavyweight cotton",
      "Vintage distressed print",
      "Garment-dyed",
      "Drop shoulder fit",
      "Twill-reinforced seams",
      "Tear-away label",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export function getRelatedProducts(
  currentId: string,
  category: string,
  limit = 4
): Product[] {
  return products
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, limit);
}
