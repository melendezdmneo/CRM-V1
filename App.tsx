import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Plus, 
  Search, 
  Filter, 
  Download,
  BrainCircuit,
  Database
} from 'lucide-react';

import { Deal, Stage, ServiceType, PipelineStats } from './types';
import { INITIAL_DEALS, OWNERS } from './constants';
import Pipeline from './components/Pipeline';
import Dashboard from './components/Dashboard';
import DealModal from './components/DealModal';
import { generatePipelineReport } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [deals, setDeals] = useState<Deal[]>(() => {
      const saved = localStorage.getItem('dataflow_deals');
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });
  
  const [view, setView] = useState<'pipeline' | 'dashboard'>('pipeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [filterOwner, setFilterOwner] = useState<string>('All');
  const [filterService, setFilterService] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('dataflow_deals', JSON.stringify(deals));
  }, [deals]);

  // --- Computed ---
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesOwner = filterOwner === 'All' || deal.owner === filterOwner;
      const matchesService = filterService === 'All' || deal.serviceType === filterService;
      const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            deal.client.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOwner && matchesService && matchesSearch;
    });
  }, [deals, filterOwner, filterService, searchQuery]);

  const stats: PipelineStats = useMemo(() => {
    const activeDeals = deals.filter(d => d.stage !== Stage.WON && d.stage !== Stage.LOST);
    const wonDeals = deals.filter(d => d.stage === Stage.WON);
    const lostDeals = deals.filter(d => d.stage === Stage.LOST);
    
    const totalValue = activeDeals.reduce((acc, d) => acc + d.value, 0);
    const winRate = (wonDeals.length / (wonDeals.length + lostDeals.length || 1)) * 100;
    const avgDealValue = totalValue / (activeDeals.length || 1);

    return { totalValue, winRate, avgDealValue, totalDeals: deals.length };
  }, [deals]);

  // --- Handlers ---
  const handleSaveDeal = (deal: Deal) => {
    setDeals(prev => {
      const exists = prev.find(d => d.id === deal.id);
      if (exists) {
        return prev.map(d => d.id === deal.id ? deal : d);
      }
      return [...prev, deal];
    });
  };

  const handleMoveDeal = (id: string, newStage: Stage) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, stage: newStage, lastUpdated: new Date().toISOString() } : d));
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Client', 'Value', 'Stage', 'Owner', 'Probability', 'Next Step'];
    const rows = filteredDeals.map(d => [d.id, d.title, d.client, d.value, d.stage, d.owner, d.probability, d.nextStep]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pipeline_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = async () => {
      setIsGeneratingReport(true);
      const report = await generatePipelineReport(deals);
      alert(report); // Using native alert for simplicity in this demo, ideally a modal
      setIsGeneratingReport(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <Database className="text-blue-400 w-8 h-8" />
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight">DataFlow CRM</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('pipeline')}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === 'pipeline' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <KanbanSquare size={20} />
            <span className="hidden lg:block ml-3 font-medium">Pipeline</span>
          </button>
          
          <button 
             onClick={() => setView('dashboard')}
             className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="hidden lg:block ml-3 font-medium">Dashboard</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
             <button 
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="w-full flex items-center justify-center lg:justify-start p-3 rounded-lg bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900 hover:text-white transition-all"
             >
                <BrainCircuit size={20} className={isGeneratingReport ? "animate-pulse" : ""} />
                <span className="hidden lg:block ml-3 font-medium text-sm">
                    {isGeneratingReport ? 'Analyzing...' : 'AI Weekly Report'}
                </span>
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar deals..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             {/* Filters */}
             <div className="flex items-center gap-2">
                 <Filter size={16} className="text-gray-400" />
                 <select 
                    value={filterOwner}
                    onChange={(e) => setFilterOwner(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer"
                 >
                     <option value="All">Todos los Dueños</option>
                     {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
                 </select>
                 <span className="text-gray-300">|</span>
                 <select 
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer"
                 >
                     <option value="All">Todos los Servicios</option>
                     {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={handleExportCSV}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                title="Exportar a CSV"
            >
                <Download size={20} />
            </button>
            <button 
                onClick={() => { setSelectedDeal(null); setIsModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
            >
                <Plus size={18} />
                <span className="hidden sm:inline">Nuevo Deal</span>
            </button>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-hidden relative">
            {view === 'pipeline' ? (
                <Pipeline 
                    deals={filteredDeals} 
                    onDealClick={(d) => { setSelectedDeal(d); setIsModalOpen(true); }}
                    onDealMove={handleMoveDeal}
                />
            ) : (
                <Dashboard deals={filteredDeals} stats={stats} />
            )}
        </div>

      </main>

      <DealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeal}
        deal={selectedDeal}
      />
    </div>
  );
};

export default App;