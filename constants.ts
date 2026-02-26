
import { PurchaseMethod, PurchaseMethodType, PriceImpactUnit, PriceImpactBase, PriceImpactDirection, PriceImpactCalculationSource, TargetMode } from './types';

export const MOCK_METHODS: PurchaseMethod[] = [
  {
    id: '1',
    name: 'Базовая рассрочка 50/50',
    type: PurchaseMethodType.INSTALLMENT,
    isActive: true,
    description: 'Рассрочка с первоначальным взносом 50%',
    createdAt: '12.05.2024',
    hasPriceImpact: true,
    priceImpact: {
      amount: 5,
      unit: PriceImpactUnit.PERCENT,
      base: PriceImpactBase.TOTAL,
      direction: PriceImpactDirection.INCREASE,
      calculationSource: PriceImpactCalculationSource.BASE
    },
    targetMode: TargetMode.FILTERS,
    selectedUnits: ['Секция 1-10-1', 'Секция 1-10-2', 'Секция 2-5-3']
  },
  {
    id: '3',
    name: 'Выгода при 100% оплате',
    type: PurchaseMethodType.FULL_PAYMENT,
    isActive: true,
    description: 'Максимальная скидка',
    createdAt: '01.06.2024',
    hasPriceImpact: true,
    priceImpact: {
      amount: 10,
      unit: PriceImpactUnit.PERCENT,
      base: PriceImpactBase.TOTAL,
      direction: PriceImpactDirection.DECREASE,
      calculationSource: PriceImpactCalculationSource.BASE
    },
    targetMode: TargetMode.FILTERS,
    selectedUnits: ['Секция 1-1-1', 'Секция 1-1-2', 'Секция 1-1-3', 'Секция 1-1-4', 'Секция 2-10-5']
  }
];

export const PROJECTS = ['ЖК Лазурный', 'ЖК Кристалл', 'ЖК Панорама'];
export const ROOMS = ['Студия', '1-к', '2-к', '3-к', '4к+'];
export const BANKS = ['Сбербанк', 'ВТБ', 'Альфа-Банк', 'Газпромбанк'];
export const MORTGAGE_PROGRAMS = ['Семейная ипотека', 'Господдержка 2020', 'ИТ-ипотека', 'Стандартная'];
export const TAGS = ['Акция', 'Скидка', 'Подарок', 'Срочно', 'ВИП', 'Эконом'];
