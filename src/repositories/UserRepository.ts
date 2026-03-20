import db from "@/lib/db";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
  cep: string;
  street: string;
  number?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string | null;
  role: string;
};

type UserRow = {
  id: number | string;
  name: string;
  email: string;
  password_hash: string;
  cpf: string;
  cep: string;
  street: string;
  number?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string | null;
  role: string;
};

const mapRow = (row: UserRow): UserRecord => ({
  id: String(row.id),
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  cpf: row.cpf,
  cep: row.cep,
  street: row.street,
  number: row.number ?? null,
  neighborhood: row.neighborhood,
  city: row.city,
  state: row.state,
  complement: row.complement ?? null,
  role: row.role,
});

export const UserRepository = {
  getByEmail(email: string): UserRecord | null {
    const row = db
      .prepare(
        `SELECT id, name, email, password_hash, cpf, cep, street, number,
                neighborhood, city, state, complement, role
         FROM users
         WHERE email = ?`
      )
      .get(email) as UserRow | undefined;

    return row ? mapRow(row) : null;
  },

  existsByCpf(cpf: string): boolean {
    const row = db
      .prepare("SELECT 1 FROM users WHERE cpf = ? LIMIT 1")
      .get(cpf);
    return Boolean(row);
  },

  create(user: Omit<UserRecord, "id">): string {
    const info = db
      .prepare(
        `INSERT INTO users
         (name, email, password_hash, cpf, cep, street, number, neighborhood, city, state, complement, role)
         VALUES (@name, @email, @passwordHash, @cpf, @cep, @street, @number, @neighborhood, @city, @state, @complement, @role)`
      )
      .run(user);

    return String(info.lastInsertRowid);
  },

  listAll(): UserRecord[] {
    const rows = db
      .prepare(
        `SELECT id, name, email, password_hash, cpf, cep, street, number,
                neighborhood, city, state, complement, role
         FROM users
         ORDER BY created_at DESC`
      )
      .all() as UserRow[];

    return rows.map(mapRow);
  },
};
