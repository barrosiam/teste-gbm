export interface Operation {
  id: string;
  name: string;
  description: string;
  type: "Embarque" | "Desembarque";
  terminal: "Terminal Sul" | "Terminal Norte" | "Terminal Oeste" | "Terminal Leste";
  status: "Criada" | "Processando" | "Finalizada";
}