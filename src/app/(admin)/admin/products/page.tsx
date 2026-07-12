import { ProductsView } from "@/views/admin/products";

export const metadata = {
  title: "Products · Admin",
};

export default function AdminProductsPage() {
  return <ProductsView />;
}