// Nossas "regras" de dados. Ajuda o VS Code a completar o código e não deixar a gente passar string onde é número.
export interface Tutor {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  foto?: string;
}

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  tutorId?: number;
  foto?: string;
  tutor?: Tutor;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
