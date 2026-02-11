
import React, { useState, useEffect } from 'react';
import { PurchaseMethod } from './types';
import { MOCK_METHODS } from './constants';
import PurchaseMethodsTable from './components/PurchaseMethodsTable';
import MethodFormModal from './components/MethodFormModal';
import UnitListModal from './components/UnitListModal';
import { 
  Home, 
  Copy, 
  TrendingUp, 
  PieChart, 
  Percent, 
  GraduationCap, 
  ChevronUp, 
  ChevronDown,
  LogOut,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  badge, 
  isSubItem = false,
  hasArrow = false,
  isOpen = false
}: { 
  icon?: any, 
  label: string, 
  active?: boolean, 
  badge?: string, 
  isSubItem?: boolean,
  hasArrow?: boolean,
  isOpen?: boolean
}) => (
  <div className={`
    flex items-center gap-4 px-6 py-3 cursor-pointer transition-all
    ${active ? 'bg-[#DCDCDC]' : 'hover:bg-gray-200'}
    ${isSubItem ? 'pl-16 py-2' : ''}
  `}>
    {!isSubItem && Icon && <Icon size={20} className="text-[#69C]" strokeWidth={1.5} />}
    <div className="flex-1 flex items-center justify-between">
      <span className={`text-sm ${isSubItem ? 'font-normal text-gray-700' : 'font-bold text-black'}`}>
        {label}
        {badge && <span className="ml-2 text-[10px] font-normal text-gray-400 italic">{badge}</span>}
      </span>
      {hasArrow && (
        isOpen ? <ChevronUp size={16} className="text-black" /> : <ChevronDown size={16} className="text-black" />
      )}
    </div>
  </div>
);

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

function App() {
  const [methods, setMethods] = useState<PurchaseMethod[]>(MOCK_METHODS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PurchaseMethod | null>(null);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [isUnitListOpen, setIsUnitListOpen] = useState(false);
  const [viewingUnitsForMethod, setViewingUnitsForMethod] = useState<PurchaseMethod | null>(null);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleEdit = (method: PurchaseMethod) => {
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleCopy = (method: PurchaseMethod) => {
    const copy = { 
      ...method, 
      id: Math.random().toString(36).substr(2, 9), 
      name: `${method.name} - Копия`,
      createdAt: new Date().toLocaleDateString('ru-RU')
    };
    setMethods([...methods, copy]);
    addToast(`Способ "${method.name}" успешно скопирован`);
  };

  const handleCreate = () => {
    setEditingMethod(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const method = methods.find(m => m.id === id);
    if (confirm('Вы уверены, что хотите удалить этот способ покупки?')) {
      setMethods(methods.filter(m => m.id !== id));
      addToast(`Способ "${method?.name}" удален`, 'info');
    }
  };

  const handleToggle = (id: string) => {
    const method = methods.find(m => m.id === id);
    const newStatus = !method?.isActive;
    setMethods(methods.map(m => m.id === id ? { ...m, isActive: newStatus } : m));
    addToast(`Статус способа "${method?.name}" изменен`);
  };

  const handleBulkAction = (ids: string[], action: 'activate' | 'deactivate' | 'delete') => {
    if (action === 'delete') {
      if (confirm(`Вы уверены, что хотите удалить выбранные элементы (${ids.length})?`)) {
        setMethods(methods.filter(m => !ids.includes(m.id)));
        addToast(`Выбранные элементы (${ids.length}) удалены`, 'info');
      }
    } else {
      setMethods(methods.map(m => ids.includes(m.id) ? { ...m, isActive: action === 'activate' } : m));
      addToast(`Статус для ${ids.length} элементов обновлен`);
    }
  };

  const handleSave = (method: PurchaseMethod) => {
    const exists = methods.some(m => m.id === method.id);
    if (exists) {
      setMethods(methods.map(m => m.id === method.id ? method : m));
      addToast(`Способ "${method.name}" успешно обновлен`);
    } else {
      setMethods([...methods, method]);
      addToast(`Способ "${method.name}" сохранен`);
    }
    setIsModalOpen(false);
  };

  const handleViewUnits = (method: PurchaseMethod) => {
    setViewingUnitsForMethod(method);
    setIsUnitListOpen(true);
  };

  const handleRemoveUnitFromMethod = (unitId: string) => {
    if (!viewingUnitsForMethod) return;
    
    const methodId = viewingUnitsForMethod.id;
    setMethods(prev => prev.map(m => {
      if (m.id === methodId) {
        const updatedUnits = m.selectedUnits?.filter(id => id !== unitId) || [];
        return { ...m, selectedUnits: updatedUnits };
      }
      return m;
    }));

    setViewingUnitsForMethod(prev => prev ? {
      ...prev,
      selectedUnits: prev.selectedUnits?.filter(id => id !== unitId) || []
    } : null);

    addToast(`Помещение удалено из списка`);
  };

  return (
    <div className="min-h-screen flex font-['Roboto'] bg-[#F8FAFC]">
      {/* Toast Container - Moved to Top Right as requested */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border min-w-[320px] animate-in slide-in-from-right-10
              ${toast.type === 'success' ? 'bg-white border-green-100' : ''}
              ${toast.type === 'info' ? 'bg-white border-blue-100' : ''}
              ${toast.type === 'error' ? 'bg-white border-red-100' : ''}
            `}
          >
            {toast.type === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
            {toast.type === 'info' && <CheckCircle2 size={20} className="text-blue-500" />}
            {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
            <span className="text-sm font-bold text-gray-800 flex-1">{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-gray-300 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-[#F2F2F2] border-r border-gray-200 flex flex-col hidden lg:flex shrink-0">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#69C] rounded-[4px] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              7
            </div>
            <span className="text-2xl font-black text-[#333] tracking-tight">Plan7</span>
          </div>
        </div>
        <nav className="flex-1">
          <SidebarItem icon={Home} label="Мои Каталоги" />
          <SidebarItem icon={Copy} label="Интеграция с CRM" />
          <SidebarItem icon={TrendingUp} label="Статистика" />
          <SidebarItem icon={PieChart} label="Аналитика" badge="beta" />
          <SidebarItem icon={Percent} label="Ипотечный калькулятор и способы покупки" active />
          <div onClick={() => setIsKnowledgeBaseOpen(!isKnowledgeBaseOpen)}>
            <SidebarItem icon={GraduationCap} label="База знаний" hasArrow isOpen={isKnowledgeBaseOpen} />
          </div>
          {isKnowledgeBaseOpen && (
            <div className="animate-in slide-in-from-top-1">
              <SidebarItem label="Каталог Plan7" isSubItem />
              <SidebarItem label="Битрикс для застройщиков" isSubItem />
            </div>
          )}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-red-500 cursor-pointer transition-colors group">
            <LogOut size={18} className="group-hover:text-red-500" />
            <span className="text-sm font-bold text-gray-700">Выход</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-10 py-8 overflow-y-auto h-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-[#1E293B]">Настройки способов покупки</h1>
              <p className="text-sm font-medium text-gray-400 mt-1">Управление программами и способами оплаты объектов недвижимости</p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                 onClick={handleCreate}
                 className="bg-[#69C] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group"
               >
                 Добавить способ покупки
               </button>
            </div>
          </div>

          <PurchaseMethodsTable 
            methods={methods}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onToggle={handleToggle}
            onCreate={handleCreate}
            onBulkAction={handleBulkAction}
            onViewUnits={handleViewUnits}
          />
        </header>
      </main>

      {/* Modals */}
      <MethodFormModal 
        isOpen={isModalOpen}
        method={editingMethod}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onError={(msg) => addToast(msg, 'error')}
      />

      <UnitListModal 
        isOpen={isUnitListOpen}
        onClose={() => setIsUnitListOpen(false)}
        unitIds={viewingUnitsForMethod?.selectedUnits || []}
        methodName={viewingUnitsForMethod?.name || ''}
        onDeleteUnit={handleRemoveUnitFromMethod}
      />
    </div>
  );
}

export default App;
