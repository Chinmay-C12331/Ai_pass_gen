import React from 'react';
import { Clock, Lock, Server, Cpu, AlertCircle } from 'lucide-react';
import { AttackerScenario } from '../model/timeToCrack';

interface TimeToCrackTableProps {
  scenarios: AttackerScenario[];
}

export const TimeToCrackTable: React.FC<TimeToCrackTableProps> = ({ scenarios }) => {
  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'online-throttled':
        return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'online-unthrottled':
        return <Server className="w-4 h-4 text-amber-400" />;
      case 'offline-fast':
        return <Cpu className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-teal-400" />;
    }
  };

  const getRiskBadge = (level: AttackerScenario['riskLevel']) => {
    switch (level) {
      case 'instant':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">Instant</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">Vulnerable</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Moderate</span>;
      case 'safe':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Resilient</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Estimated Time-to-Crack (3 Threat Models)
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          50% search space average
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-2.5 font-medium">Attacker Threat Model</th>
              <th className="pb-2.5 font-medium">Attack Speed</th>
              <th className="pb-2.5 font-medium">Estimated Time</th>
              <th className="pb-2.5 font-medium text-right">Exposure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {scenarios.map((sc) => (
              <tr key={sc.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    {getScenarioIcon(sc.id)}
                    <span>{sc.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
                    {sc.explanation}
                  </div>
                </td>
                <td className="py-3 pr-3 text-slate-400 font-mono text-[11px]">
                  {sc.rateDescription.split('(')[0].trim()}
                </td>
                <td className="py-3 pr-3 font-mono text-sm font-bold text-teal-300">
                  {sc.timeDisplay}
                </td>
                <td className="py-3 text-right">
                  {getRiskBadge(sc.riskLevel)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>
          Time estimations assume an attacker testing keyspace combinations from most probable n-grams to uniform random distribution.
        </span>
      </div>
    </div>
  );
};
