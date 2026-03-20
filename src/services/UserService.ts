import bcrypt from "bcryptjs";

import { UserRepository } from "@/repositories/UserRepository";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  cpf: string;
  cep: string;
  street: string;
  number?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string | null;
};

export const UserService = {
  async registerUser(input: RegisterInput) {
    const email = input.email.toLowerCase().trim();
    if (UserRepository.getByEmail(email)) {
      throw new Error("Email ja cadastrado.");
    }

    if (UserRepository.existsByCpf(input.cpf)) {
      throw new Error("CPF ja cadastrado.");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    return UserRepository.create({
      name: input.name,
      email,
      passwordHash,
      cpf: input.cpf,
      cep: input.cep,
      street: input.street,
      number: input.number ?? null,
      neighborhood: input.neighborhood,
      city: input.city,
      state: input.state,
      complement: input.complement ?? null,
      role: "user",
    });
  },
};
