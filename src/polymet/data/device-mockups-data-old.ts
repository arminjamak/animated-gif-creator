export interface DeviceMockup {
  id: string;
  name: string;
  category: "phone" | "tablet" | "laptop" | "desktop" | "watch" | "scene";
  aspectRatio: number;
  width: number;
  height: number;
  frameColor: string;
  icon: string;
  image: string;
  screenArea: {
    points?: Array<{ x: number; y: number }>; // 4 corner points [TL, TR, BR, BL]
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
}

// Import custom device mockup images
import imgDevice1 from "@/assets/e4e504c58fbcb6230c59beef695b16fbe8fe88b3.png";
import imgDevice2 from "@/assets/67f24e8419bff5e3effca5aeac1f68520faf2d60.png";
import imgDevice3 from "@/assets/6a20dad0a2060f128b266554ad538181742a2399.png";
import imgDevice4 from "@/assets/e374b7b9b02565a79afc8e0e9ac1f5a4c481a49b.png";
import imgDevice5 from "@/assets/da5a87cad34dcd0319518b0bbcc51faf3db35ef2.png";

export const deviceMockups: DeviceMockup[] = [
  // Custom Scene Mockups with 4-point coordinates
  {
    id: "workspace-setup",
    name: "Workspace Setup",
    category: "scene",
    aspectRatio: 16 / 9,
    width: 1920,
    height: 1080,
    frameColor: "#f5f5f5",
    icon: "Monitor",
    image: imgDevice1,
    screenArea: {
      points: [
        { x: 0.0845, y: 0.3452 },
        { x: 0.4907, y: 0.3384 },
        { x: 0.5581, y: 0.6519 },
        { x: 0.1587, y: 0.7173 },
      ],
      x: 0.08,
      y: 0.34,
      width: 0.47,
      height: 0.38,
      rotation: 0,
    },
  },
  {
    id: "coffee-desk",
    name: "Coffee Desk",
    category: "scene",
    aspectRatio: 16 / 9,
    width: 1920,
    height: 1080,
    frameColor: "#8b7355",
    icon: "Monitor",
    image: imgDevice2,
    screenArea: {
      points: [
        { x: 0.2104, y: 0.4932 },
        { x: 0.5347, y: 0.4736 },
        { x: 0.5825, y: 0.7354 },
        { x: 0.2534, y: 0.7901 },
      ],
      x: 0.21,
      y: 0.47,
      width: 0.37,
      height: 0.32,
      rotation: 0,
    },
  },
  {
    id: "city-night",
    name: "City Night",
    category: "scene",
    aspectRatio: 16 / 9,
    width: 1920,
    height: 1080,
    frameColor: "#1a1a2e",
    icon: "Monitor",
    image: imgDevice3,
    screenArea: {
      points: [
        { x: 0.1929, y: 0.461 },
        { x: 0.5435, y: 0.4375 },
        { x: 0.5786, y: 0.6856 },
        { x: 0.2271, y: 0.7471 },
      ],
      x: 0.19,
      y: 0.44,
      width: 0.39,
      height: 0.31,
      rotation: 0,
    },
  },
  {
    id: "cozy-fireplace",
    name: "Cozy Fireplace",
    category: "scene",
    aspectRatio: 16 / 9,
    width: 1920,
    height: 1080,
    frameColor: "#d4a574",
    icon: "Monitor",
    image: imgDevice4,
    screenArea: {
      points: [
        { x: 0.5903, y: 0.3926 },
        { x: 0.8726, y: 0.3828 },
        { x: 0.7983, y: 0.7158 },
        { x: 0.522, y: 0.6475 },
      ],
      x: 0.52,
      y: 0.38,
      width: 0.35,
      height: 0.33,
      rotation: 0,
    },
  },
  {
    id: "modern-office",
    name: "Modern Office",
    category: "scene",
    aspectRatio: 16 / 9,
    width: 1920,
    height: 1080,
    frameColor: "#e8e8ed",
    icon: "Monitor",
    image: imgDevice5,
    screenArea: {
      points: [
        { x: 0.5894, y: 0.3906 },
        { x: 0.8755, y: 0.3809 },
        { x: 0.7974, y: 0.7158 },
        { x: 0.521, y: 0.6504 },
      ],
      x: 0.52,
      y: 0.38,
      width: 0.35,
      height: 0.33,
      rotation: 0,
    },
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "phone",
    aspectRatio: 19.5 / 9,
    width: 430,
    height: 932,
    frameColor: "#1d1d1f",
    icon: "Smartphone",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
  },
  {
    id: "samsung-galaxy-s24",
    name: "Samsung Galaxy S24",
    category: "phone",
    aspectRatio: 19.5 / 9,
    width: 412,
    height: 915,
    frameColor: "#2c2c2c",
    icon: "Smartphone",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
  },
  {
    id: "pixel-8-pro",
    name: "Google Pixel 8 Pro",
    category: "phone",
    aspectRatio: 20 / 9,
    width: 412,
    height: 915,
    frameColor: "#3c4043",
    icon: "Smartphone",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
  },
  // Tablets
  {
    id: "ipad-pro-13",
    name: 'iPad Pro 13"',
    category: "tablet",
    aspectRatio: 4 / 3,
    width: 1024,
    height: 1366,
    frameColor: "#1d1d1f",
    icon: "Tablet",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "tablet",
    aspectRatio: 4 / 3,
    width: 820,
    height: 1180,
    frameColor: "#1d1d1f",
    icon: "Tablet",
    image:
      "https://images.unsplash.com/photo-1585790050230-5dd28404f905?w=400&h=400&fit=crop",
  },
  {
    id: "samsung-tab-s9",
    name: "Samsung Tab S9",
    category: "tablet",
    aspectRatio: 16 / 10,
    width: 1600,
    height: 2560,
    frameColor: "#2c2c2c",
    icon: "Tablet",
    image:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop",
  },
  // Laptops
  {
    id: "macbook-pro-14",
    name: 'MacBook Pro 14"',
    category: "laptop",
    aspectRatio: 16 / 10,
    width: 3024,
    height: 1964,
    frameColor: "#1d1d1f",
    icon: "Laptop",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  },
  {
    id: "macbook-pro-16",
    name: 'MacBook Pro 16"',
    category: "laptop",
    aspectRatio: 16 / 10,
    width: 3456,
    height: 2234,
    frameColor: "#1d1d1f",
    icon: "Laptop",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  },
  {
    id: "macbook-air",
    name: "MacBook Air",
    category: "laptop",
    aspectRatio: 16 / 10,
    width: 2560,
    height: 1664,
    frameColor: "#e8e8ed",
    icon: "Laptop",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  },
  // Desktop
  {
    id: "imac-24",
    name: 'iMac 24"',
    category: "desktop",
    aspectRatio: 16 / 9,
    width: 4480,
    height: 2520,
    frameColor: "#1d1d1f",
    icon: "Monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop",
  },
  {
    id: "studio-display",
    name: "Studio Display",
    category: "desktop",
    aspectRatio: 16 / 9,
    width: 5120,
    height: 2880,
    frameColor: "#e8e8ed",
    icon: "Monitor",
    image:
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=400&fit=crop",
  },
  // Watch
  {
    id: "apple-watch-ultra",
    name: "Apple Watch Ultra",
    category: "watch",
    aspectRatio: 1 / 1,
    width: 410,
    height: 502,
    frameColor: "#1d1d1f",
    icon: "Watch",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
  },
  {
    id: "apple-watch-series-9",
    name: "Apple Watch Series 9",
    category: "watch",
    aspectRatio: 1 / 1,
    width: 396,
    height: 484,
    frameColor: "#1d1d1f",
    icon: "Watch",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
  },
];

export const deviceCategories = [
  { id: "all", name: "All Devices", icon: "Grid3x3" },
  { id: "phone", name: "Phones", icon: "Smartphone" },
  { id: "tablet", name: "Tablets", icon: "Tablet" },
  { id: "laptop", name: "Laptops", icon: "Laptop" },
  { id: "desktop", name: "Desktop", icon: "Monitor" },
  { id: "watch", name: "Watch", icon: "Watch" },
] as const;
