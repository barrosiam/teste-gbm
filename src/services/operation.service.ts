import { api } from "./api";
import type { Operation } from "../types/operations/operation";

export const OperationsService = {
  async getAll(): Promise<Operation[]> {
    const { data } = await api.get<Operation[]>("/operations");
    return data; 
  },

  async getById(id: string): Promise<Operation> {
    const { data } = await api.get<Operation>(`/operations/${id}`);
    return data;
  },

  async create(operation: Omit<Operation, "id">): Promise<Operation> {
    const { data } = await api.post<Operation>("/operations", operation);
    return data;
  },

  async update(id: string, operation: Operation): Promise<Operation> {
    const { data } = await api.put<Operation>(`/operations/${id}`, operation);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/operations/${id}`);
  },
};

