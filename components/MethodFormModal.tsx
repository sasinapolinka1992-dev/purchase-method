
import React, { useState, useEffect } from 'react';
import { 
  PurchaseMethod, 
  PurchaseMethodType, 
  PriceImpactUnit, 
  PriceImpactBase, 
  PriceImpactDirection, 
  PriceImpactCalculationSource,
  TargetMode,
  InstallmentTermType
} from '../types';
import { Button, Input, Select, Toggle } from './UI';
import { PROJECTS, ROOMS, TAGS, BANKS, MORTGAGE_PROGRAMS } from '../constants';
import Chessboard from './Chessboard';
import { 
  X, Info, Wallet, Percent as PercentIcon, TrendingUp, TrendingDown, 
  Calendar, CalendarDays 
} from 'lucide-react';

interface MethodFormModalProps {
  method?: PurchaseMethod | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: PurchaseMethod) => void;
  onError?: (message: string) => void;
}

const MethodFormModal: React.FC<MethodFormModalProps> = ({ method, isOpen, onClose, onSave, onError }) => {
  const [showChessboardModal, setShowChessboardModal] = useState(false);
  const [formData, setFormData] = useState<Partial<PurchaseMethod>>({
    name: '',
    type: PurchaseMethodType.INSTALLMENT,
    isActive: true,
    description: '',
    startDate: '',
    endDate: '',
    hasPriceImpact: false,
    priceImpact: {
      amount: 0,
      unit: PriceImpactUnit.PERCENT,
      base: PriceImpactBase.TOTAL,
      direction: PriceImpactDirection.DECREASE,
      calculationSource: PriceImpactCalculationSource.BASE
    },
    targetMode: TargetMode.CHESSBOARD,
    selectedUnits: [],
    installmentDetails: {
      downPayment: 10,
      downPaymentUnit: PriceImpactUnit.PERCENT,
      monthlyPayment: 0,
      termType: InstallmentTermType.MONTHS,
      termValue: 12,
      frequency: 'ежемесячно',
      interestRate: 0
    }
  });

  useEffect(() => {
    if (method) {
      setFormData(method);
    } else {
      setFormData({
        name: '',
        type: PurchaseMethodType.INSTALLMENT,
        isActive: true,
        description: '',
        startDate: '',
        endDate: '',
        createdAt: new Date().toLocaleDateString('ru-RU'),
        hasPriceImpact: false,
        priceImpact: {
          amount: 0,
          unit: PriceImpactUnit.PERCENT,
          base: PriceImpactBase.TOTAL,
          direction: PriceImpactDirection.DECREASE,
          calculationSource: PriceImpactCalculationSource.BASE
        },
        targetMode: TargetMode.CHESSBOARD,
        selectedUnits: [],
        installmentDetails: {
          downPayment: 10,
          downPaymentUnit: PriceImpactUnit.PERCENT,
          monthlyPayment: 0,
          termType: InstallmentTermType.MONTHS,
          termValue: 12,
          frequency: 'ежемесячно',
          interestRate: 0
        }
      });
    }
  }, [method, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name || !formData.type) {
      if (onError) onError('Пожалуйста, заполните обязательные поля');
      return;
    }
    onSave({
      ...formData,
      id: method?.id || Math.random().toString(36).substr(2, 9),
      createdAt: formData.createdAt || new Date().toLocaleDateString('ru-RU')
    } as PurchaseMethod);
  };

  const updateInstallment = (updates: Partial<NonNullable<PurchaseMethod['installmentDetails']>>) => {
    setFormData(prev => ({
      ...prev,
      installmentDetails: {
        ...(prev.installmentDetails as any),
        ...updates
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl flex flex-col shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {method ? `Редактирование: ${method.name}` : 'Создание способа покупки'}
            </h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Настройка условий и области действия</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-2xl transition-all group">
            <X size={24} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">Тип программы*</label>
                <Select 
                  value={formData.type} 
                  onChange={e => setFormData({ ...formData, type: e.target.value as PurchaseMethodType })}
                >
                  <option value={PurchaseMethodType.INSTALLMENT}>Рассрочка</option>
                  <option value={PurchaseMethodType.FULL_PAYMENT}>100% оплата</option>
                  <option value={PurchaseMethodType.TRADE_IN}>Трейд-ин</option>
                  <option value={PurchaseMethodType.CUSTOM}>Свой вариант</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">Название способа*</label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Спец-рассрочка 'Семейная'"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <div className="flex-1 space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">Дата начала</label>
                  <div className="relative">
                    <Input type="date" className="pl-10 text-sm text-gray-600" value={formData.startDate || ''} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                    <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">Дата окончания</label>
                  <div className="relative">
                    <Input type="date" className="pl-10 text-sm text-gray-600" value={formData.endDate || ''} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                    <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">Описание</label>
              <textarea 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none bg-gray-50/30"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание условий для менеджеров отдела продаж..."
              />
            </div>
          </div>

          {/* Installment Section (Also used for CUSTOM type) */}
          {(formData.type === PurchaseMethodType.INSTALLMENT || formData.type === PurchaseMethodType.CUSTOM) && formData.installmentDetails && (
            <div className="p-8 bg-orange-50/40 rounded-[32px] border border-orange-100 space-y-8 animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                  <Wallet size={20} />
                </div>
                <h3 className="font-black text-orange-900 uppercase tracking-wide text-sm">
                  {formData.type === PurchaseMethodType.CUSTOM ? 'Параметры программы' : 'Параметры рассрочки'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* PV */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-orange-400 tracking-wider">Размер ПВ</label>
                  <div className="flex gap-2">
                    <Input 
                      type="number"
                      className="flex-1"
                      value={formData.installmentDetails.downPayment}
                      onChange={e => updateInstallment({ downPayment: Number(e.target.value) })}
                    />
                    <Select
                      className="w-24"
                      value={formData.installmentDetails.downPaymentUnit}
                      onChange={e => updateInstallment({ downPaymentUnit: e.target.value as PriceImpactUnit })}
                    >
                      <option value={PriceImpactUnit.PERCENT}>%</option>
                      <option value={PriceImpactUnit.RUB}>RUB</option>
                    </Select>
                  </div>
                </div>

                {/* Monthly Payment */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-orange-400 tracking-wider">Ежемесячный платеж (RUB)</label>
                  <Input 
                    type="number"
                    value={formData.installmentDetails.monthlyPayment}
                    onChange={e => updateInstallment({ monthlyPayment: Number(e.target.value) })}
                  />
                </div>

                {/* Interest */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-orange-400 tracking-wider">Ставка (%)</label>
                  <Input 
                    type="number"
                    value={formData.installmentDetails.interestRate}
                    onChange={e => updateInstallment({ interestRate: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Term Type Selection */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase text-orange-400 tracking-wider">Максимальный срок</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1.5 bg-white/60 rounded-2xl border border-orange-100/50">
                  <button 
                    type="button"
                    onClick={() => updateInstallment({ termType: InstallmentTermType.MONTHS })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${formData.installmentDetails.termType === InstallmentTermType.MONTHS ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-orange-900/40 hover:bg-orange-100/50'}`}
                  >
                    Кол-во месяцев
                  </button>
                  <button 
                    type="button"
                    onClick={() => updateInstallment({ termType: InstallmentTermType.DATE })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${formData.installmentDetails.termType === InstallmentTermType.DATE ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-orange-900/40 hover:bg-orange-100/50'}`}
                  >
                    Конкретная дата
                  </button>
                  <button 
                    type="button"
                    onClick={() => updateInstallment({ termType: InstallmentTermType.BEFORE_COMMISSION })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${formData.installmentDetails.termType === InstallmentTermType.BEFORE_COMMISSION ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-orange-900/40 hover:bg-orange-100/50'}`}
                  >
                    До ввода (мес.)
                  </button>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-bold text-orange-900/40 uppercase">Значение срока</label>
                    <div className="relative">
                      <Input 
                        placeholder={formData.installmentDetails.termType === InstallmentTermType.DATE ? 'ДД.ММ.ГГ' : 'Введите значение...'}
                        value={formData.installmentDetails.termValue}
                        onChange={e => updateInstallment({ termValue: e.target.value })}
                      />
                      {formData.installmentDetails.termType === InstallmentTermType.DATE && <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-300" />}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-bold text-orange-900/40 uppercase">Частота платежей</label>
                    <Select
                      value={formData.installmentDetails.frequency}
                      onChange={e => updateInstallment({ frequency: e.target.value as any })}
                    >
                      <option value="ежемесячно">Ежемесячно</option>
                      <option value="ежеквартально">Ежеквартально</option>
                      <option value="раз в полгода">Раз в полгода</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price Impact */}
          <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 border border-gray-50">
                  <PercentIcon size={20} />
                </div>
                <h3 className="font-black text-gray-800 uppercase tracking-wide text-sm">Влияние на стоимость</h3>
              </div>
              <Toggle 
                checked={formData.hasPriceImpact || false} 
                onChange={() => setFormData({ ...formData, hasPriceImpact: !formData.hasPriceImpact })} 
              />
            </div>
            
            {formData.hasPriceImpact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-black uppercase text-gray-400">Сумма</label>
                    <Input 
                      type="number" 
                      value={formData.priceImpact?.amount} 
                      onChange={e => setFormData({
                        ...formData,
                        priceImpact: { ...formData.priceImpact!, amount: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="w-28 space-y-2">
                    <label className="block text-[10px] font-black uppercase text-gray-400">Единица</label>
                    <Select
                      value={formData.priceImpact?.unit}
                      onChange={e => setFormData({
                        ...formData,
                        priceImpact: { ...formData.priceImpact!, unit: e.target.value as PriceImpactUnit }
                      })}
                    >
                      <option value={PriceImpactUnit.RUB}>RUB</option>
                      <option value={PriceImpactUnit.PERCENT}>%</option>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-gray-400">База расчета</label>
                  <Select
                    value={formData.priceImpact?.base}
                    onChange={e => setFormData({
                      ...formData,
                      priceImpact: { ...formData.priceImpact!, base: e.target.value as PriceImpactBase }
                    })}
                  >
                    <option value={PriceImpactBase.TOTAL}>От общей стоимости</option>
                    <option value={PriceImpactBase.SQM}>От цены за м²</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-gray-400">Расчет от</label>
                  <Select
                    value={formData.priceImpact?.calculationSource}
                    onChange={e => setFormData({
                      ...formData,
                      priceImpact: { ...formData.priceImpact!, calculationSource: e.target.value as PriceImpactCalculationSource }
                    })}
                  >
                    <option value={PriceImpactCalculationSource.BASE}>Базовой стоимости</option>
                    <option value={PriceImpactCalculationSource.PROMO}>Стоимости по акции</option>
                  </Select>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      priceImpact: { ...formData.priceImpact!, direction: PriceImpactDirection.DECREASE }
                    })}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.priceImpact?.direction === PriceImpactDirection.DECREASE ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200'}`}
                  >
                    <TrendingDown size={18} />
                    Снизить стоимость (скидка)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      priceImpact: { ...formData.priceImpact!, direction: PriceImpactDirection.INCREASE }
                    })}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.priceImpact?.direction === PriceImpactDirection.INCREASE ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'}`}
                  >
                    <TrendingUp size={18} />
                    Повысить стоимость (наценка)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <button 
                type="button"
                onClick={() => setShowChessboardModal(true)}
                className="w-full py-5 bg-[#69C] hover:bg-[#5a8bb0] text-white font-black uppercase text-sm rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-[0.99]"
              >
                Выбрать проекты и помещения
              </button>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider italic">
                  {formData.selectedUnits && formData.selectedUnits.length > 0 
                    ? `Выбрано: ${formData.selectedUnits.length} помещений`
                    : 'По умолчанию действует на все проекты и помещения'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-4">
            <Toggle checked={formData.isActive || false} onChange={() => setFormData({...formData, isActive: !formData.isActive})} />
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Отображать в каталоге</span>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" className="px-6 py-3 uppercase tracking-widest text-[11px] font-black" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSave} className="px-10 py-3 uppercase tracking-widest text-[11px] font-black shadow-xl shadow-blue-500/20">
              {method ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </div>
      </div>

      {/* Chessboard Fullscreen Component */}
      {showChessboardModal && (
        <Chessboard 
          selectedUnits={formData.selectedUnits || []} 
          onChange={units => setFormData({ ...formData, selectedUnits: units })} 
          onClose={() => setShowChessboardModal(false)}
        />
      )}
    </div>
  );
};

export default MethodFormModal;
