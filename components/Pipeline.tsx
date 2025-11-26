import React from 'react';
import { Deal, Stage } from '../types';
import { STAGE_ORDER } from '../constants';
import DealCard from './DealCard';

interface PipelineProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onDealMove: (id: string, newStage: Stage) => void;
}

const Pipeline: React.FC<PipelineProps> = ({ deals, onDealClick, onDealMove }) => {
  
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('dealId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      onDealMove(dealId, stage);
    }
  };

  const getStageColor = (stage: Stage) => {
      switch(stage) {
          case Stage.WON: return 'border-t-4 border-t-emerald-500 bg-emerald-50/30';
          case Stage.LOST: return 'border-t-4 border-t-red-500 bg-red-50/30';
          default: return 'border-t-4 border-t-blue-500 bg-gray-50';
      }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden h-full">
      <div className="flex h-full min-w-[1200px] gap-4 p-4 pb-8">
        {STAGE_ORDER.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const stageValue = stageDeals.reduce((acc, curr) => acc + curr.value, 0);

          return (
            <div
              key={stage}
              className={`flex-1 min-w-[280px] rounded-xl flex flex-col max-h-full ${getStageColor(stage)}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="p-3 bg-white/50 backdrop-blur-sm rounded-t-lg border-b border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-slate-700 text-sm truncate" title={stage}>{stage}</h3>
                  <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Total: ${stageValue.toLocaleString()}
                </div>
              </div>

              {/* Deals Container */}
              <div className="flex-1 overflow-y-auto p-2 space-y-3 no-scrollbar">
                {stageDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onClick={onDealClick}
                    onDragStart={handleDragStart}
                  />
                ))}
                {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs italic">
                        Arrastrar aquí
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;