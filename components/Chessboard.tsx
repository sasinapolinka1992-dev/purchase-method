
import React, { useState } from 'react';
import { X, Search, Check, Maximize2, Layers, Building2, Minus, Plus } from 'lucide-react';
import { Button } from './UI';
import { PROJECTS } from '../constants';

type UnitStatus = 'available' | 'reserved' | 'sold' | 'restricted';

interface Unit {
  id: string;
  floor: number;
  stack: number;
  rooms: string;
  area: number;
  status: UnitStatus;
}

interface Section {
  name: string;
  stacks: number[];
  floors: number[];
  units: Unit[];
}

interface ChessboardProps {
  selectedUnits: string[];
  onChange: (units: string[]) => void;
  onClose: () => void;
}

const MOCK_SECTIONS: Section[] = [
  {
    name: 'Секция 2',
    stacks: [2, 3, 4],
    floors: [14, 13, 12, 11, 10, 9, 8, 7],
    units: []
  },
  {
    name: 'Секция 3',
    stacks: [1, 2, 3, 4],
    floors: [10, 9, 8, 7],
    units: []
  },
  {
    name: 'Секция 4',
    stacks: [1, 2, 3, 4],
    floors: [14, 13, 12, 11, 10, 9, 8, 7],
    units: []
  },
  {
    name: 'Секция 5',
    stacks: [1, 2],
    floors: [8, 7],
    units: []
  }
];

// Seed units with mock statuses
MOCK_SECTIONS.forEach(s => {
  s.floors.forEach(f => {
    s.stacks.forEach(st => {
      const statusRoll = Math.random();
      let status: UnitStatus = 'available';
      if (statusRoll > 0.9) status = 'sold';
      else if (statusRoll > 0.8) status = 'reserved';
      else if (statusRoll > 0.75) status = 'restricted';

      s.units.push({
        id: `${s.name}-${f}-${st}`,
        floor: f,
        stack: st,
        rooms: `${(st % 3) + 1}к`,
        area: 40 + (st * 5) + (f * 2),
        status
      });
    });
  });
});

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-4 rounded-md shadow-sm ${color}`} />
    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
  </div>
);

const Chessboard: React.FC<ChessboardProps> = ({ selectedUnits, onChange, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [zoom, setZoom] = useState(80);

  const toggleUnit = (id: string) => {
    if (selectedUnits.includes(id)) {
      onChange(selectedUnits.filter(u => u !== id));
    } else {
      onChange([...selectedUnits, id]);
    }
  };

  const selectStack = (section: Section, stack: number) => {
    const stackUnitIds = section.units.filter(u => u.stack === stack).map(u => u.id);
    const allInStackSelected = stackUnitIds.every(id => selectedUnits.includes(id));
    
    if (allInStackSelected) {
      onChange(selectedUnits.filter(id => !stackUnitIds.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedUnits, ...stackUnitIds]));
      onChange(newSelected);
    }
  };

  const selectFloor = (section: Section, floor: number) => {
    const floorUnitIds = section.units.filter(u => u.floor === floor).map(u => u.id);
    const allInFloorSelected = floorUnitIds.every(id => selectedUnits.includes(id));

    if (allInFloorSelected) {
      onChange(selectedUnits.filter(id => !floorUnitIds.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedUnits, ...floorUnitIds]));
      onChange(newSelected);
    }
  };

  const selectAll = () => {
    const allIds = MOCK_SECTIONS.flatMap(s => s.units.map(u => u.id));
    onChange(allIds);
  };

  const clearAll = () => onChange([]);

  const getStatusColor = (status: UnitStatus, isSelected: boolean) => {
    if (isSelected) return 'bg-[#6699CC] border-[#6699CC] text-white shadow-lg';
    switch (status) {
      case 'available': return 'bg-[#48BB21] border-[#48BB21] text-white';
      case 'reserved': return 'bg-[#EDD04B] border-[#EDD04B] text-white';
      case 'sold': return 'bg-[#D2D2D2] border-[#D2D2D2] text-white';
      case 'restricted': return 'bg-[#969696] border-[#969696] text-white';
      default: return 'bg-white border-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-['Roboto'] animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{selectedProject}</h2>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <button onClick={selectAll} className="px-5 py-2 bg-[#69C] text-white text-[11px] font-black uppercase rounded-[6px] shadow-sm hover:bg-[#5a8bb0] transition-colors">Выбрать все</button>
            <button onClick={clearAll} className="px-5 py-2 bg-white border border-gray-200 text-gray-500 text-[11px] font-black uppercase rounded-[6px] hover:bg-gray-50 transition-colors">Снять все</button>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase">Зум: {zoom}%</span>
            <input 
              type="range" min="40" max="150" step="10" value={zoom} 
              onChange={e => setZoom(parseInt(e.target.value))}
              className="w-32 accent-[#69C]"
            />
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-300" /></button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Projects */}
        <aside className="w-72 border-r border-gray-100 bg-[#F2F2F2] flex flex-col p-6 shrink-0">
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Поиск ЖК..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-[#69C] outline-none" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {PROJECTS.map((p, i) => (
              <div 
                key={p} 
                onClick={() => setSelectedProject(p)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedProject === p ? 'bg-white border-[#69C] shadow-md ring-2 ring-[#69C]/10' : 'hover:bg-gray-200 border-transparent text-gray-600'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedProject === p ? 'bg-[#69C] border-[#69C] text-white' : 'border-gray-300 bg-white'}`}>
                    {selectedProject === p && <Check size={12} strokeWidth={4} />}
                  </div>
                  <div>
                    <div className={`text-sm font-black ${selectedProject === p ? 'text-gray-900' : 'text-gray-500'}`}>{p}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">284 лотов</div>
                  </div>
                </div>
              </div>
            ))}
            {/* Mock extra projects for scroll */}
            {Array.from({length: 8}).map((_, i) => (
               <div key={i} className="p-4 rounded-xl hover:bg-gray-200 border-transparent text-gray-400 cursor-not-allowed opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border border-gray-300 bg-white" />
                  <div>
                    <div className="text-sm font-black">ЖК "Проект {i + 4}"</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold">284 лотов</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chessboard View */}
        <div className="flex-1 bg-[#F9F9F9] overflow-auto flex flex-col custom-scrollbar">
          {/* Legend Strip */}
          <div className="px-10 pt-8 pb-4 flex gap-10 bg-[#F9F9F9] sticky top-0 z-10">
            <LegendItem color="bg-[#48BB21]" label="Свободно" />
            <LegendItem color="bg-[#EDD04B]" label="Бронь" />
            <LegendItem color="bg-[#D2D2D2]" label="Продано" />
            <LegendItem color="bg-[#969696]" label="Резерв" />
            <div className="h-4 w-[1px] bg-gray-200 ml-4 mr-4" />
            <LegendItem color="bg-[#6699CC]" label="Выбрано" />
          </div>

          <div className="flex-1 p-10">
            <div className="flex gap-12 items-end" style={{ transform: `scale(${zoom/100})`, transformOrigin: 'top left' }}>
              {MOCK_SECTIONS.map((section, sIdx) => (
                <div key={sIdx} className="shrink-0 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
                  <div className="text-center mb-8">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">{section.name}</h3>
                  </div>

                  {/* Stacks Header */}
                  <div className="flex ml-10 mb-2">
                    {section.stacks.map(st => (
                      <button 
                        key={st} 
                        onClick={() => selectStack(section, st)}
                        className="w-16 text-[9px] font-black text-gray-400 hover:text-[#69C] transition-colors uppercase tracking-widest text-center"
                      >
                        ст.{st}
                      </button>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="space-y-1">
                    {section.floors.map(floor => (
                      <div key={floor} className="flex items-center">
                        <button 
                          onClick={() => selectFloor(section, floor)}
                          className="w-10 text-[10px] font-black text-gray-400 hover:text-[#69C] transition-colors pr-2 text-right"
                        >
                          {floor}
                        </button>
                        <div className="flex gap-1">
                          {section.stacks.map(stack => {
                            const unit = section.units.find(u => u.floor === floor && u.stack === stack);
                            if (!unit) return <div key={stack} className="w-16 h-16 bg-gray-50/50 rounded-lg border border-gray-50 border-dashed" />;
                            
                            const isSelected = selectedUnits.includes(unit.id);
                            return (
                              <div 
                                key={unit.id}
                                onClick={() => toggleUnit(unit.id)}
                                className={`w-16 h-16 rounded-lg cursor-pointer flex flex-col items-center justify-center transition-all border ${getStatusColor(unit.status, isSelected)}`}
                              >
                                <div className="text-[11px] font-black leading-tight">{unit.floor}{unit.stack}1</div>
                                <div className="text-[9px] font-bold mt-0.5 opacity-80">{unit.rooms} • {unit.area} м²</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-24 border-t border-gray-100 flex items-center justify-end px-12 gap-4 shrink-0 bg-white">
        <div className="mr-auto flex items-center gap-6">
           <span className="text-sm font-black text-gray-900 uppercase">ИТОГО ВЫБРАНО: {selectedUnits.length} ЛОТОВ</span>
        </div>
        <button onClick={onClose} className="px-10 py-3 border border-gray-200 text-gray-500 font-black uppercase text-xs rounded-xl hover:bg-gray-50 transition-colors">Отмена</button>
        <button onClick={onClose} className="px-12 py-4 bg-[#69C] text-white font-black uppercase text-xs rounded-xl shadow-xl shadow-blue-500/20 hover:bg-[#5a8bb0] transition-transform active:scale-95">Подтвердить выбор</button>
      </footer>
    </div>
  );
};

export default Chessboard;
