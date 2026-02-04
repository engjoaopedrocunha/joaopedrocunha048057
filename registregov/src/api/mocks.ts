import type { Pet, Tutor, PaginatedResponse } from '../types';
//Dados de teste pra gente não ficar no escuro quando o servidor da SEPLAG cair.
//Dados dos tutores
export const MOCK_TUTORES: Tutor[] = [
  { id: 1, nome: "Isabela Oliveira", telefone: "(65) 981143655", email: "isa@email.com", endereco: "Bairro CPA, 123" },
  { id: 2, nome: "Matheus Santos", telefone: "(65) 981502006", email: "math@email.com", endereco: "Av. Antártica, 1000" },
  { id: 3, nome: "Carla Lima", telefone: "(65) 98166-5555", email: "carla@email.com", endereco: "Rua Amazonas, 45" }
];
// Informações sobre os animais
export const MOCK_PETS: Pet[] = [
  { id: 1, nome: "Caramelo", especie: "Cachorro", idade: 3, tutorId: 1, foto: "https://www.pedigree.com.br/sites/g/files/fnmzdf2401/files/2024-12/vira-lata-caramelo.jpg" },
  { id: 2, nome: "Frajola", especie: "Gato", idade: 2, tutorId: 1, foto: "https://panoramapetvet.com.br/wp-content/uploads/2023/11/gato-frajola.webp" },
  { id: 3, nome: "Thor", especie: "Cachorro", idade: 5, tutorId: 2, foto: "https://m.media-amazon.com/images/I/51FgoZ9U6EL._AC_UF1000,1000_QL80_.jpg" },
  { id: 4, nome: "Pikachu", especie: "Gato", idade: 1, tutorId: 3, foto: "https://i.redd.it/32w58b54yd651.jpg" },
  { id: 5, nome: "Bidu", especie: "Cachorro", idade: 4, tutorId: 2, foto: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500" }
];

export const getPaginatedMock = <T>(data: T[], page: number, limit: number): PaginatedResponse<T> => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const content = data.slice(start, end);
  
  return {
    content,
    totalElements: data.length,
    totalPages: Math.ceil(data.length / limit),
    size: limit,
    number: page
  };
};
