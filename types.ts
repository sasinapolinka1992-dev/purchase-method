
export enum PurchaseMethodType {
  INSTALLMENT = 'Рассрочка',
  FULL_PAYMENT = '100% оплата',
  TRADE_IN = 'Трейд-ин',
  CUSTOM = 'Свой вариант'
}

export enum PriceImpactUnit {
  RUB = 'RUB',
  PERCENT = '%'
}

export enum PriceImpactBase {
  TOTAL = 'от стоимости объекта',
  SQM = 'от цены за м²'
}

export enum PriceImpactDirection {
  INCREASE = 'Повысить стоимость',
  DECREASE = 'Снизить стоимость'
}

export enum TargetMode {
  FILTERS = 'Фильтры',
  CHESSBOARD = 'Шахматка'
}

export enum InstallmentTermType {
  MONTHS = 'Количество месяцев',
  DATE = 'Конкретная дата',
  BEFORE_COMMISSION = 'До ввода в эксплуатацию'
}

export interface PurchaseMethod {
  id: string;
  name: string;
  type: PurchaseMethodType;
  isActive: boolean;
  description: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  hasPriceImpact: boolean;
  priceImpact?: {
    amount: number;
    unit: PriceImpactUnit;
    base: PriceImpactBase;
    direction: PriceImpactDirection;
  };
  targetMode: TargetMode;
  targetFilters?: {
    projects: string[];
    sections: string[];
    floors: [number, number];
    rooms: string[];
    tags: string[];
    areaRange: [number, number];
    priceRange: [number, number];
    priceSqmRange: [number, number];
  };
  selectedUnits?: string[];
  mortgageProgram?: string;
  bankName?: string;
  installmentDetails?: {
    downPayment: number;
    downPaymentUnit: PriceImpactUnit;
    monthlyPayment: number;
    termType: InstallmentTermType;
    termValue: string | number;
    frequency: 'ежемесячно' | 'ежеквартально' | 'раз в полгода';
    interestRate: number;
  };
}
