import "server-only";

import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "estoque.db");
const globalForDb = globalThis as unknown as { __db?: Database };

const db = globalForDb.__db ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__db = db;
}

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);`);

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    cep TEXT NOT NULL,
    street TEXT NOT NULL,
    number TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    complement TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);`);

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'PAID',
    recipient_name TEXT NOT NULL,
    cpf TEXT NOT NULL,
    cep TEXT NOT NULL,
    street TEXT NOT NULL,
    number TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    complement TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    name_snapshot TEXT NOT NULL,
    price_snapshot REAL NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);`);

db.exec(`
  CREATE TABLE IF NOT EXISTS product_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_product_comments_product_id ON product_comments(product_id);`);

const columns = db
  .prepare("PRAGMA table_info(products)")
  .all() as { name: string }[];

if (!columns.some((column) => column.name === "image_url")) {
  db.exec("ALTER TABLE products ADD COLUMN image_url TEXT");
}

if (!columns.some((column) => column.name === "description")) {
  db.exec("ALTER TABLE products ADD COLUMN description TEXT");
}

const count = db.prepare("SELECT COUNT(*) as count FROM products").get() as {
  count: number;
};

const categoryCount = db
  .prepare("SELECT COUNT(*) as count FROM categories")
  .get() as {
  count: number;
};

const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
  count: number;
};

if (categoryCount.count === 0) {
  const insertCategory = db.prepare(
    `INSERT INTO categories (name) VALUES (@name)`
  );
  const seedCategories = [
    { name: "Eletronicos" },
    { name: "Escritorio" },
    { name: "Moveis" },
    { name: "Audio" },
  ];

  const insertManyCategories = db.transaction((rows: any[]) => {
    rows.forEach((row: any) => insertCategory.run(row));
  });

  insertManyCategories(seedCategories);
}

if (userCount.count === 0) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@estoquepro.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  db.prepare(
    `INSERT INTO users
     (name, email, password_hash, cpf, cep, street, number, neighborhood, city, state, complement, role)
     VALUES (@name, @email, @password_hash, @cpf, @cep, @street, @number, @neighborhood, @city, @state, @complement, @role)`
  ).run({
    name: "Administrador",
    email: adminEmail,
    password_hash: passwordHash,
    cpf: "11144477735",
    cep: "01001000",
    street: "Praca da Se",
    number: "100",
    neighborhood: "Se",
    city: "Sao Paulo",
    state: "SP",
    complement: "Admin Seed",
    role: "admin",
  });
}

if (count.count === 0) {
  const insert = db.prepare(
    `INSERT INTO products (name, sku, category, price, quantity, image_url)
     VALUES (@name, @sku, @category, @price, @quantity, @image_url)`
  );

  const seed = [
    {
      name: "MacBook Pro M2",
      sku: "APP-MBP-2023",
      category: "Eletronicos",
      price: 12499.9,
      quantity: 42,
      image_url: "/placeholder.svg",
    },
    {
      name: "LaserJet Pro",
      sku: "HP-LJP-400",
      category: "Escritorio",
      price: 1899.9,
      quantity: 5,
      image_url: "/placeholder.svg",
    },
    {
      name: "Magic Mouse",
      sku: "APP-MSE-001",
      category: "Eletronicos",
      price: 499.9,
      quantity: 0,
      image_url: "/placeholder.svg",
    },
    {
      name: "Standing Desk",
      sku: "FURN-ST-DK",
      category: "Moveis",
      price: 2150,
      quantity: 18,
      image_url: "/placeholder.svg",
    },
    {
      name: "Headset Studio",
      sku: "AUD-ST-210",
      category: "Audio",
      price: 899.9,
      quantity: 9,
      image_url: "/placeholder.svg",
    },
  ];

  const insertMany = db.transaction((rows: any[]) => {
    rows.forEach((row: any) => insert.run(row));
  });

  insertMany(seed);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS carousel_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    link_text TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const carouselCount = db.prepare("SELECT COUNT(*) as count FROM carousel_slides").get() as {
  count: number;
};

if (carouselCount.count === 0) {
  const insertCarousel = db.prepare(
    `INSERT INTO carousel_slides (title, subtitle, image_url, link_url, link_text, order_index)
     VALUES (@title, @subtitle, @image_url, @link_url, @link_text, @order_index)`
  );

  const seedCarousel = [
    {
      title: "Sua loja completa para tecnologia, escritorio e bem-estar.",
      subtitle: "Produtos selecionados, estoque atualizado e checkout rapido. Compre agora e acompanhe seus pedidos em tempo real.",
      image_url: "/placeholder.svg",
      link_url: "/products",
      link_text: "Ver catalogo",
      order_index: 0,
    }
  ];

  const insertManyCarousel = db.transaction((rows: any[]) => {
    rows.forEach((row: any) => insertCarousel.run(row));
  });

  insertManyCarousel(seedCarousel);
}

export default db;
