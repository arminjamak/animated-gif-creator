// Import custom device mockup images
import imgDevice1 from "@/assets/e4e504c58fbcb6230c59beef695b16fbe8fe88b3.png";
import imgDevice2 from "@/assets/67f24e8419bff5e3effca5aeac1f68520faf2d60.png";
import imgDevice3 from "@/assets/6a20dad0a2060f128b266554ad538181742a2399.png";
import imgDevice4 from "@/assets/e374b7b9b02565a79afc8e0e9ac1f5a4c481a49b.png";
import imgDevice5 from "@/assets/da5a87cad34dcd0319518b0bbcc51faf3db35ef2.png";

export interface DeviceMockup {
  id: string;
  name: string;
  category: "phone" | "tablet" | "laptop" | "desktop" | "watch";
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

export const deviceMockups: DeviceMockup[] = [
  {
    id: "workspace-setup",
    name: "Workspace Setup",
    category: "laptop",
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
    category: "laptop",
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
    category: "laptop",
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
    category: "laptop",
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
    category: "laptop",
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
];

export const deviceCategories = [
  { id: "all", name: "All Devices", icon: "Grid3x3" },
  { id: "phone", name: "Phones", icon: "Smartphone" },
  { id: "tablet", name: "Tablets", icon: "Tablet" },
  { id: "laptop", name: "Laptops", icon: "Laptop" },
  { id: "desktop", name: "Desktop", icon: "Monitor" },
  { id: "watch", name: "Watch", icon: "Watch" },
] as const;
