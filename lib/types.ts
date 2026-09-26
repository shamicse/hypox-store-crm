export type Product = { variants?: string;
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  comparePrice: number;
  image: string;
  stock: number;
  rating: number;
  reviewCount: number;
  badge: string;
  sellerId: string;
  active: number;
  createdAt: string;
};
export type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
};
export const money = (n: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n / 100);
export const categories = [
  "All clothing",
  "T-shirts",
  "Hoodies",
  "Sweatshirts",
  "Cargos",
  "Jackets",
];
export const sizes = ["S", "M", "L", "XL", "XXL"];

