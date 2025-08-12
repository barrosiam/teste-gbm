import * as React from "react";
import { TextField } from "@radix-ui/themes";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "inline-flex items-center rounded-full px-3 py-1.5 text-sm border transition",
        active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
        "focus:outline-none focus:ring-2 focus:ring-blue-600/40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export type FiltersBarProps = {
  terminals: string[];                
  selectedTerminals: Set<string>;      
  onToggleTerminal: (t: string) => void;
  onClearTerminals: () => void;
  search: string;
  onSearchChange: (q: string) => void;
};

export function FiltersBar({
  terminals, selectedTerminals, onToggleTerminal, onClearTerminals, search, onSearchChange,
}: FiltersBarProps) {
  const selectedCount = selectedTerminals.size;

  return (
    <div className="mb-3 space-y-2 ">
      <div className="flex items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={selectedCount === 0} onClick={onClearTerminals}>Todos</Chip>
        {terminals.map((t) => (
          <Chip key={t} active={selectedTerminals.has(t)} onClick={() => onToggleTerminal(t)}>
            {t}
          </Chip>
        ))}
      </div>


      <div className="flex items-center gap-2">
     <TextField.Root size="2" radius="large" className="w-full md:w-96"
            placeholder="Buscar por tipo ou status…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}>
          
        </TextField.Root>

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onClearTerminals}
            className="text-sm text-blue-700 hover:underline"
            title="Limpar filtros"
          >
            Limpar filtros
          </button>
        )}

           
      </div>
    </div>
  );
}
