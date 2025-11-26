import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Loader2 } from 'lucide-react';
import { Deal, ServiceType, Stage } from '../types';
import { OWNERS } from '../constants';
import { analyzeDealRisks } from '../services/geminiService';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
  deal?: Deal | null;
}

const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, onSave, deal }) => {
  const [formData, setFormData] = useState<Partial<Deal>>({
    currency: 'USD',
    probability: 50,
    stage: Stage.CONTACT,
    serviceType: ServiceType.AD_HOC
  });
  
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    if (deal) {
      setFormData(deal);
      setAiInsight(''); 
    } else {
      setFormData({
        id: crypto.randomUUID(),
        currency: 'USD',
        probability: 50,
        stage: Stage.CONTACT,
        serviceType: ServiceType.AD_HOC,
        owner: OWNERS[0],
        lastUpdated: new Date().toISOString()
      });
      setAiInsight('');
    }
  }, [deal, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' || name === 'probability' || name === 'estimatedHours' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.client) {
      onSave({ ...formData, lastUpdated: new Date().toISOString() } as Deal);
      onClose();
    }
  };

  const handleGetInsight = async () => {
    if (!formData.title) return;
    setIsLoadingAi(true);
    const insight = await analyzeDealRisks(formData as Deal);
    setAiInsight(insight);
    setIsLoadingAi(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">
            {deal ? 'Editar Deal' : 'Nuevo Deal'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <form id="dealForm" onSubmit={handleSubmit} className="contents">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Deal</label>
                <input
                  required
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ej. Migración Data Warehouse"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                <input
                  required
                  name="client"
                  value={formData.client || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value || 0}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Moneda</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="MXN">MXN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Probabilidad (%)</label>
                <input
                  type="range"
                  name="probability"
                  min="0"
                  max="100"
                  value={formData.probability || 0}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-xs text-gray-500 mt-1">{formData.probability}%</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horas Consultoría (Est.)</label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Servicio</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                >
                  {Object.values(ServiceType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Etapa</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                >
                  {Object.values(Stage).map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsable (Owner)</label>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                >
                  {OWNERS.map((owner) => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Siguiente Paso</label>
                <textarea
                  name="nextStep"
                  value={formData.nextStep || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none resize-none"
                  placeholder="Ej. Enviar contrato revisado..."
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Cierre Estimada</label>
                <input
                  type="date"
                  name="closeDate"
                  value={formData.closeDate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>
          </form>

          {/* AI Section - Spans Full Width if present */}
          <div className="md:col-span-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
             <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600"/> 
                    AI Deal Assistant
                </h4>
                {!aiInsight && (
                    <button 
                        type="button"
                        onClick={handleGetInsight}
                        disabled={isLoadingAi || !formData.title}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                        {isLoadingAi ? <Loader2 size={12} className="animate-spin"/> : 'Analizar Deal'}
                    </button>
                )}
             </div>
             {aiInsight ? (
                 <div className="text-sm text-indigo-900 whitespace-pre-line leading-relaxed">
                    {aiInsight}
                 </div>
             ) : (
                <p className="text-xs text-indigo-400 italic">
                    Utiliza Gemini para identificar riesgos y sugerir siguientes pasos basados en los datos del deal.
                </p>
             )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            form="dealForm"
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-200 transition-all font-medium flex items-center gap-2"
          >
            <Save size={18} />
            Guardar Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealModal;