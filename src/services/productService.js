const PRODUCTS_KEY = "mock_products";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 15999,
    category: "Electronics",
    description: "Noise cancelling, 40h battery life, premium sound quality.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 12999,
    category: "Furniture",
    description: "Designed for comfort and productivity with lumbar support.",
    image:
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 4999,
    category: "Electronics",
    description: "Track your health, workouts, and sleep with precision.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Designer Sunglasses",
    price: 8500,
    category: "Fashion",
    description: "UV protection with a sleek, modern frame design.",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    price: 7499,
    category: "Electronics",
    description: "RGB backlit, cherry mx red switches for gaming.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b91a603?q=80&w=1000&auto=format&fit=crop",
  },
];

if (!localStorage.getItem(PRODUCTS_KEY)) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  },

  async getById(id) {
    await delay(300);
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    return products.find((p) => p.id === Number(id));
  },

  async create(product) {
    await delay(500);
    const newProduct = { ...product, id: Date.now() };

    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  async update(product) {
    await delay(500);

    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
    const index = products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      return product;
    }
    throw new Error("Product not found");
  },

  async delete(id) {
    await delay(500);
    let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    products = products.filter((p) => p.id !== Number(id));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return id;
  },
};
