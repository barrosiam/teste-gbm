export const STATUS_OPTIONS = [
  { value: "Criada",      label: "Criada" },
  { value: "Processando", label: "Processando" },
  { value: "Finalizada",    label: "Finalizada" },
] as const;
export type OpStatus = typeof STATUS_OPTIONS[number]["value"];

export const TYPE_OPTIONS = [
  { value: "Embarque",    label: "Embarque" },
  { value: "Desembarque", label: "Desembarque" },
] as const;
export type OpType = typeof TYPE_OPTIONS[number]["value"];

export const TERMINAL_OPTIONS = [
  { value: "Terminal Sul",   label: "Terminal Sul" },
  { value: "Terminal Norte", label: "Terminal Norte" },
  { value: "Terminal Oeste", label: "Terminal Oeste" },
  { value: "Terminal Leste", label: "Terminal Leste" },
] as const;
export type OpTerminal = typeof TERMINAL_OPTIONS[number]["value"];
