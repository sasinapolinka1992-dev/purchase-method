
import React from 'react';
import { X, Building2, Layers, Home, Info, Trash2 } from 'lucide-react';
import { Button } from './UI';
import { PROJECTS } from '../constants';

interface UnitListModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitIds: string[];
  methodName: string;
  onDeleteUnit?: (unitId: string) => void;
}

const UnitListModal: React.FC<UnitListModalProps> = ({ isOpen, onClose, unitIds, methodName, onDeleteUnit }) => {
  if (!isOpen) return null;

  // Helper to parse unit ID: "Секция 1-10-1" -> { section: "Секция 1", floor: "10", number: "1" }
  const parseUnitId = (id: string) => {
    const parts = id.split('-');
    const section = parts[0] || '—';
    const floor = parts[1] || '—';
    const number = parts[2] || '—';
    
    // Deterministic room count for display purposes
    const roomIndex = (parseInt(number) || 0) % 5;
    const rooms = ['Студия', '1-к', '2-к', '3-к', '4-к'][roomIndex];
    
    return {
      project: PROJECTS[0], // Defaulting to the first project for this mockup
      section,
      floor,
      number,
      rooms
    };
  };

  const units = unitIds.map(id => ({
    ...parseUnitId(id),
    id
  }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl flex flex-col shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Список помещений</h2>
            <p className="text-xs text-gray-400 mt-1">Для способа: <span className="text-blue-500 font-bold">{methodName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0">
          {units.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b border-gray-100">
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400">Проект</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Секция</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Комнатность</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Этаж</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">№ помещения</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {units.map((unit, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-4 text-sm font-medium text-gray-900">{unit.project}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{unit.section}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-500">
                        {unit.rooms}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{unit.floor}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">№ {unit.number}</td>
                    <td className="px-8 py-4 text-right">
                      <button 
                        onClick={() => onDeleteUnit?.(unit.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Удалить помещение из списка"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-4">
                <Info size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Список пуст</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs">
                К данному способу покупки пока не привязано ни одно конкретное помещение.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500">Всего выбрано: {unitIds.length}</span>
          <Button variant="secondary" onClick={onClose}>Закрыть</Button>
        </div>
      </div>
    </div>
  );
};

export default UnitListModal;
