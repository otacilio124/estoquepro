export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const isValidCPF = (value: string): boolean => {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calcDigit = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i += 1) {
      total += Number(base[i]) * (factor - i);
    }
    const mod = (total * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const digit1 = calcDigit(cpf.substring(0, 9), 10);
  const digit2 = calcDigit(cpf.substring(0, 10), 11);

  return cpf.endsWith(`${digit1}${digit2}`);
};

export const isValidCEP = (value: string): boolean => {
  const cep = onlyDigits(value);
  return cep.length === 8;
};
