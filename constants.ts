import { Deal, ServiceType, Stage } from './types';

export const INITIAL_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Migración Data Lake',
    client: 'FinTech Corp',
    value: 45000,
    currency: 'USD',
    probability: 60,
    serviceType: ServiceType.DATA_ENGINEERING,
    closeDate: '2024-06-15',
    nextStep: 'Validar arquitectura',
    estimatedHours: 120,
    owner: 'Ana G.',
    stage: Stage.NEGOTIATION,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Chatbot Soporte Interno',
    client: 'Retail Giants',
    value: 28000,
    currency: 'USD',
    probability: 80,
    serviceType: ServiceType.NLP_VISION,
    closeDate: '2024-05-30',
    nextStep: 'Firma de contrato',
    estimatedHours: 85,
    owner: 'Carlos M.',
    stage: Stage.PROPOSAL,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Roadmap IA Gen',
    client: 'Logistica Global',
    value: 15000,
    currency: 'USD',
    probability: 20,
    serviceType: ServiceType.STRATEGY,
    closeDate: '2024-07-01',
    nextStep: 'Reunión inicial',
    estimatedHours: 40,
    owner: 'Ana G.',
    stage: Stage.CONTACT,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Predicción de Demanda',
    client: 'Manuf. Auto',
    value: 65000,
    currency: 'USD',
    probability: 90,
    serviceType: ServiceType.PREDICTIVE_ML,
    closeDate: '2024-05-20',
    nextStep: 'Kick-off meeting',
    estimatedHours: 200,
    owner: 'Carlos M.',
    stage: Stage.WON,
    lastUpdated: new Date().toISOString()
  }
];

export const STAGE_ORDER = [
  Stage.CONTACT,
  Stage.DISCOVERY,
  Stage.PROPOSAL,
  Stage.NEGOTIATION,
  Stage.WON,
  Stage.LOST
];

export const OWNERS = ['Ana G.', 'Carlos M.', 'David L.', 'Elena R.'];