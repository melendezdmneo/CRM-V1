export enum Stage {
  CONTACT = 'Contacto Inicial',
  DISCOVERY = 'Discovery / Necesidades',
  PROPOSAL = 'Propuesta Enviada',
  NEGOTIATION = 'Negociación Técnica',
  WON = 'Cerrado Ganado',
  LOST = 'Cerrado Perdido'
}

export enum ServiceType {
  STRATEGY = 'Estrategia de Datos',
  PREDICTIVE_ML = 'Modelos Predictivos / ML',
  DATA_ENGINEERING = 'Ingeniería de Datos',
  NLP_VISION = 'NLP / Visión Artificial',
  AD_HOC = 'Consultoría Ad-Hoc'
}

export interface Deal {
  id: string;
  title: string;
  client: string;
  value: number;
  currency: string;
  probability: number;
  serviceType: ServiceType;
  closeDate: string;
  nextStep: string;
  estimatedHours: number;
  owner: string;
  stage: Stage;
  lastUpdated: string;
}

export interface PipelineStats {
  totalValue: number;
  winRate: number;
  avgDealValue: number;
  totalDeals: number;
}