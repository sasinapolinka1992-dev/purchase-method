
import React, { useState, useRef, useEffect } from 'react';
import { PurchaseMethod, PurchaseMethodType, PriceImpactDirection, PriceImpactUnit } from '../types';
import { Toggle, Input } from './UI';
import { 
  Edit2, 
  Trash2, 
  Copy, 
  Search, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  X,
  Calendar,
  Download
} from 'lucide-react';

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  hasSearch?: boolean;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({ label, options, selected, onChange, hasSearch = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[160px] px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-all text-gray-700 shadow-sm"
      >
        <span className="truncate max-w-[120px]">
          {selected.length === 0 ? label : `${label}: ${selected.length}`}
        </span>
        <ChevronDown size={14} className={`ml-2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-40 w-64 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-3 animate-in fade-in slide-in-from-top-2">
          {hasSearch && (
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                autoFocus
                type="text"
                placeholder="Поиск..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}
          <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
            {filteredOptions.map(opt => (
              <label key={opt} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                <input 
                  type="checkbox" 
                  checked={selected.includes(opt)}
                  onChange={() => toggleOption(opt)}
                  className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-400"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900">{opt}</span>
              </label>
            ))}
          </div>
          <div className="pt-2 mt-2 border-t border-gray-50 flex justify-between">
            <button onClick={() => onChange([])} className="text-[10px] font-bold text-gray-400 hover:text-red-500">Сбросить</button>
            <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-blue-500 hover:text-blue-700">Готово</button>
          </div>
        </div>
      )}
    </div>
  );
};

interface PurchaseMethodsTableProps {
  methods: PurchaseMethod[];
  onEdit: (method: PurchaseMethod) => void;
  onDelete: (id: string) => void;
  onCopy: (method: PurchaseMethod) => void;
  onToggle: (id: string) => void;
  onCreate: () => void;
  onBulkAction: (ids: string[], action: 'activate' | 'deactivate' | 'delete') => void;
  onViewUnits: (method: PurchaseMethod) => void;
}

const PurchaseMethodsTable: React.FC<PurchaseMethodsTableProps> = ({ 
  methods, onEdit, onDelete, onCopy, onToggle, onCreate, onBulkAction, onViewUnits 
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [nameFilters, setNameFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({start: '', end: ''});

  const filteredMethods = methods.filter(m => {
    const matchesName = nameFilters.length === 0 || nameFilters.includes(m.name);
    const matchesType = typeFilters.length === 0 || typeFilters.includes(m.type);
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(m.isActive ? 'Активен' : 'Неактивен');
    
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const methodDateParts = m.createdAt.split('.');
      const methodDate = new Date(`${methodDateParts[2]}-${methodDateParts[1]}-${methodDateParts[0]}`).getTime();
      
      if (dateRange.start) {
        const start = new Date(dateRange.start).getTime();
        if (methodDate < start) matchesDate = false;
      }
      if (dateRange.end) {
        const end = new Date(dateRange.end).getTime();
        if (methodDate > end) matchesDate = false;
      }
    }

    return matchesName && matchesType && matchesStatus && matchesDate;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMethods.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMethods.map(m => m.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const exportToExcel = () => {
    const headers = ['Название', 'Дата создания', 'Тип', 'Влияние на цену', 'Кол-во помещений', 'Статус'];
    
    const methodsToExport = selectedIds.length > 0 
      ? filteredMethods.filter(m => selectedIds.includes(m.id))
      : filteredMethods;

    const rows = methodsToExport.map(m => {
      let priceImpactStr = '-';
      if (m.hasPriceImpact && m.priceImpact) {
        priceImpactStr = `${m.priceImpact.direction === PriceImpactDirection.INCREASE ? '+' : '-'}${m.priceImpact.amount}${m.priceImpact.unit}`;
      }
      return [
        `"${m.name}"`, 
        `"${m.createdAt}"`, 
        `"${m.type}"`, 
        `"${priceImpactStr}"`, 
        `"${m.selectedUnits?.length || 0}"`, 
        `"${m.isActive ? 'Активен' : 'Неактивен'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "purchase_methods.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="space-y-1.5">
          <MultiSelectFilter 
            label="Способ покупки" 
            options={Array.from(new Set(methods.map(m => m.name)))} 
            selected={nameFilters} 
            onChange={setNameFilters} 
            hasSearch
          />
        </div>
        <div className="space-y-1.5">
          <MultiSelectFilter 
            label="Тип" 
            options={Object.values(PurchaseMethodType)} 
            selected={typeFilters} 
            onChange={setTypeFilters} 
          />
        </div>
        <div className="space-y-1.5">
          <MultiSelectFilter 
            label="Статус" 
            options={['Активен', 'Неактивен']} 
            selected={statusFilters} 
            onChange={setStatusFilters} 
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">Дата создания</label>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm h-[38px]">
            <Calendar size={14} className="text-gray-400" />
            <input 
              type="date" 
              className="bg-transparent border-none outline-none text-xs text-gray-600 focus:ring-0 w-28" 
              value={dateRange.start}
              onChange={e => setDateRange({...dateRange, start: e.target.value})}
            />
            <span className="text-gray-300">—</span>
            <input 
              type="date" 
              className="bg-transparent border-none outline-none text-xs text-gray-600 focus:ring-0 w-28" 
              value={dateRange.end}
              onChange={e => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>

        {(nameFilters.length > 0 || typeFilters.length > 0 || statusFilters.length > 0 || dateRange.start || dateRange.end) && (
          <button 
            onClick={() => { setNameFilters([]); setTypeFilters([]); setStatusFilters([]); setDateRange({start: '', end: ''}); }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all h-[38px]"
          >
            <X size={14} />
            Сбросить
          </button>
        )}
      </div>

      {/* Control Panel (Bulk Actions & Export) */}
      <div className="flex justify-between items-center h-10 mt-2 mb-4">
        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black shadow-sm">
                {selectedIds.length}
              </span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">выбрано</span>
              <button onClick={() => setSelectedIds([])} className="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase transition-colors">
                Сбросить
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 border-r border-gray-200 pr-4 mr-1 animate-in slide-in-from-right-4 fade-in duration-200">
              <button
                onClick={() => { onBulkAction(selectedIds, 'activate'); setSelectedIds([]); }}
                className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
              >
                Включить
              </button>
              <button
                onClick={() => { onBulkAction(selectedIds, 'deactivate'); setSelectedIds([]); }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
              >
                Отключить
              </button>
              <button
                onClick={() => { onBulkAction(selectedIds, 'delete'); setSelectedIds([]); }}
                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Удалить
              </button>
            </div>
          )}
          
          <button 
            onClick={exportToExcel} 
            className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} />
            {selectedIds.length > 0 ? 'Скачать выбранные' : 'Скачать в Excel'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <table className="w-full text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="px-6 py-4 w-12 text-center">
                <input type="checkbox" checked={selectedIds.length === filteredMethods.length && filteredMethods.length > 0} onChange={toggleSelectAll} className="rounded" />
              </th>
              <th className="px-6 py-4">Способ покупки</th>
              <th className="px-6 py-4">Дата создания</th>
              <th className="px-6 py-4">Тип</th>
              <th className="px-6 py-4">Влияние на цену</th>
              <th className="px-6 py-4">Кол-во помещений</th>
              <th className="px-6 py-4 text-center">В каталоге</th>
              <th className="px-6 py-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 normal-case font-normal text-sm text-gray-700">
            {filteredMethods.map(method => (
              <tr key={method.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-5 text-center">
                  <input type="checkbox" checked={selectedIds.includes(method.id)} onChange={() => toggleSelect(method.id)} className="rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-gray-900">{method.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{method.bankName || 'Прямой договор'}</div>
                </td>
                <td className="px-6 py-5 text-gray-500 text-xs tabular-nums">{method.createdAt}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    method.type === PurchaseMethodType.INSTALLMENT ? 'bg-orange-50 text-orange-600' :
                    method.type === PurchaseMethodType.TRADE_IN ? 'bg-purple-50 text-purple-600' :
                    method.type === PurchaseMethodType.CUSTOM ? 'bg-teal-50 text-teal-600' :
                    'bg-green-50 text-green-600'
                  }`}>{method.type}</span>
                </td>
                <td className="px-6 py-5">
                  {method.hasPriceImpact && method.priceImpact ? (
                    <div className={`flex items-center gap-1 font-bold ${method.priceImpact.direction === PriceImpactDirection.INCREASE ? 'text-green-500' : 'text-red-500'}`}>
                      {method.priceImpact.direction === PriceImpactDirection.INCREASE ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {method.priceImpact.direction === PriceImpactDirection.INCREASE ? '+' : '-'}{method.priceImpact.amount}{method.priceImpact.unit}
                    </div>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-6 py-5">
                  <button onClick={() => onViewUnits(method)} className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group/count">
                    <LayoutGrid size={14} className="text-gray-400 group-hover/count:text-blue-500" />
                    <span className="font-bold text-gray-700 group-hover/count:text-blue-600">{method.selectedUnits?.length || 0}</span>
                  </button>
                </td>
                <td className="px-6 py-5 text-center">
                  <Toggle checked={method.isActive} onChange={() => onToggle(method.id)} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end items-center gap-3">
                    <button onClick={() => onCopy(method)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Copy size={16} /></button>
                    <button onClick={() => onEdit(method)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(method.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseMethodsTable;
