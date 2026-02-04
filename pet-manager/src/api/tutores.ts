import api from './api';
import type { Tutor, PaginatedResponse } from '../types';
//Tudo que for relacionado aos donos dos bichos fica aqui. Segue o mesmo padrão da api de pets.
export const getTutors = (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);

  return api.get<PaginatedResponse<Tutor> | Tutor[]>(`v1/tutores?${params.toString()}`);
};

export const getTutorById = (id: number) => 
  api.get<Tutor>(`v1/tutores/${id}`);

export const createTutor = (data: Partial<Tutor>) => 
  api.post<Tutor>(`v1/tutores`, data);

export const updateTutor = (id: number, data: Partial<Tutor>) => 
  api.put<Tutor>(`v1/tutores/${id}`, data);

export const deleteTutor = (id: number) =>
  api.delete(`v1/tutores/${id}`);

export const uploadTutorPhoto = (id: number, file: File) => {
  const formData = new FormData();
  formData.append('foto', file);
  return api.post(`v1/tutores/${id}/fotos`, formData);
};
