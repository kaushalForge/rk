export interface Medicine {
  name: string;
  taken: boolean;
}

export interface Pregnancy {
  lastBirthDate?: string;
  nextExpectedBirth?: string;
}

export interface Cow {
  _id?: string;
  cowId: string;
  name: string;
  age: number;
  weight: number;
  milkProduction: number;
  images: {
    primary: string;
    secondary?: string;
  };
  medicines: Medicine[];
  pregnancy: Pregnancy;
  calves?: Cow[];
}
