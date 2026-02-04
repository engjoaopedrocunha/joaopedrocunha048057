import api from './api';
import type { Pet, PaginatedResponse } from '../types';
//Endpoints dos pets. Lembrar de conferir se o backend vai mudar a rota de upload de fotos depois.
export const getPets = (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  
  return api.get<PaginatedResponse<Pet> | Pet[]>(`v1/pets?${params.toString()}`);
};

export const getPetById = (id: number) => 
  api.get<Pet>(`v1/pets/${id}`);

export const createPet = (data: Partial<Pet>) => 
  api.post<Pet>(`v1/pets`, data);

export const updatePet = (id: number, data: Partial<Pet>) => 
  api.put<Pet>(`v1/pets/${id}`, data);

export const deletePet = (id: number) =>
  api.delete(`v1/pets/${id}`);

export const uploadPetPhoto = (id: number, file: File) => {
  const formData = new FormData();
  formData.append('foto', file);
  return api.post(`v1/pets/${id}/fotos`, formData);
};
