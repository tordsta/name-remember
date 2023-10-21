import { useQuery } from "react-query";

const fetchProducts = async () => {
  const response = await (await fetch("/api/stripe/getProducts")).json();
  return response;
};

const useProducts = () => {
  return useQuery("products", () => fetchProducts()).data;
};

export { useProducts, fetchProducts };
