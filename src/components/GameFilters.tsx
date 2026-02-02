import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Filter, X, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GameFiltersState {
  skillLevel: string;
  gameType: string;
  date: Date | undefined;
  timeSlot: string;
}

interface GameFiltersProps {
  filters: GameFiltersState;
  onFiltersChange: (filters: GameFiltersState) => void;
}

export const GameFilters = ({ filters, onFiltersChange }: GameFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = 
    filters.skillLevel !== "all" || 
    filters.gameType !== "all" || 
    filters.date !== undefined ||
    filters.timeSlot !== "all";

  const activeFilterCount = [
    filters.skillLevel !== "all",
    filters.gameType !== "all",
    filters.date !== undefined,
    filters.timeSlot !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      skillLevel: "all",
      gameType: "all",
      date: undefined,
      timeSlot: "all",
    });
  };

  const updateFilter = (key: keyof GameFiltersState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-3">
      {/* Mobile: Collapsible filters */}
      <div className="sm:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </Button>
        
        {isOpen && (
          <div className="mt-3 p-4 bg-card rounded-lg border border-border space-y-4">
            <FilterControls 
              filters={filters} 
              updateFilter={updateFilter}
              isMobile={true}
            />
          </div>
        )}
      </div>

      {/* Desktop: Always visible filters */}
      <div className="hidden sm:flex items-center gap-3 flex-wrap">
        <FilterControls 
          filters={filters} 
          updateFilter={updateFilter}
          isMobile={false}
        />
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
};

interface FilterControlsProps {
  filters: GameFiltersState;
  updateFilter: (key: keyof GameFiltersState, value: any) => void;
  isMobile: boolean;
}

const FilterControls = ({ filters, updateFilter, isMobile }: FilterControlsProps) => {
  const containerClass = isMobile 
    ? "grid grid-cols-2 gap-3" 
    : "flex items-center gap-3 flex-wrap";

  return (
    <div className={containerClass}>
      {/* Skill Level */}
      <Select value={filters.skillLevel} onValueChange={(v) => updateFilter("skillLevel", v)}>
        <SelectTrigger className={cn(isMobile ? "w-full" : "w-[140px]")}>
          <SelectValue placeholder="Classe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas classes</SelectItem>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <SelectItem key={level} value={level.toString()}>
              {level}ª classe
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Game Type */}
      <Select value={filters.gameType} onValueChange={(v) => updateFilter("gameType", v)}>
        <SelectTrigger className={cn(isMobile ? "w-full" : "w-[130px]")}>
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos tipos</SelectItem>
          <SelectItem value="simples">Simples</SelectItem>
          <SelectItem value="duplas">Duplas</SelectItem>
        </SelectContent>
      </Select>

      {/* Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              isMobile ? "w-full" : "w-[160px]",
              "justify-start text-left font-normal",
              !filters.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.date 
              ? format(filters.date, "dd/MM", { locale: ptBR })
              : "Data"
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.date}
            onSelect={(date) => updateFilter("date", date)}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
            className="pointer-events-auto"
            locale={ptBR}
          />
          {filters.date && (
            <div className="p-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => updateFilter("date", undefined)}
              >
                Limpar data
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Time Slot */}
      <Select value={filters.timeSlot} onValueChange={(v) => updateFilter("timeSlot", v)}>
        <SelectTrigger className={cn(isMobile ? "w-full" : "w-[130px]")}>
          <SelectValue placeholder="Horário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Qualquer hora</SelectItem>
          <SelectItem value="morning">Manhã (6h-12h)</SelectItem>
          <SelectItem value="afternoon">Tarde (12h-18h)</SelectItem>
          <SelectItem value="evening">Noite (18h-22h)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
