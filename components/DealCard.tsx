import React from 'react';
import { Deal, Stage } from '../types';
import { GripVertical, Clock, User, ArrowRightCircle } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onClick, onDragStart }) => {
  const getProbabilityColor = (prob: number) => {
    if (prob < 30) return 'bg-red-100 text-red-700';
    if (prob < 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const isClosed = deal.stage === Stage.WON || deal.stage === Stage.LOST;

  return (
    <div
      draggable={!isClosed}
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={() => onClick(deal)}
      className={`
        group relative bg-white p-4 rounded-xl border border-gray-200 shadow-sm 
        hover:shadow-md hover:border-blue-300 transition-all cursor-pointer 
        ${isClosed ? 'opacity-80' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
          {deal.serviceType}
        </span>
        {!isClosed && (
            <div className="text-gray-300 group-hover:text-gray-500 cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
            </div>
        )}
      </div>

      <h3 className="font-semibold text-slate-800 text-sm mb-1 leading-tight line-clamp-2">
        {deal.title}
      </h3>
      <p className="text-xs text-slate-500 mb-3">{deal.client}</p>

      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-900 font-bold text-sm">
          {deal.currency} {deal.value.toLocaleString()}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getProbabilityColor(deal.probability)}`}>
          {deal.probability}% Prob.
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <User size={12} />
          <span>{deal.owner}</span>
        </div>
        <div className="flex items-center gap-1" title="Est. Close Date">
            <Clock size={12} />
            <span>{new Date(deal.closeDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
        </div>
      </div>

      {deal.nextStep && (
        <div className="mt-2 text-xs text-slate-500 bg-gray-50 p-2 rounded flex gap-2 items-start">
             <ArrowRightCircle size={12} className="mt-0.5 text-blue-400 shrink-0"/>
             <span className="line-clamp-1">{deal.nextStep}</span>
        </div>
      )}
    </div>
  );
};

export default DealCard;