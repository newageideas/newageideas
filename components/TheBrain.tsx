import React, { useMemo, useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { HistoryItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { Database, TrendingUp, Clock, Music } from 'lucide-react';

interface TheBrainProps {
  history: HistoryItem[];
}

export const TheBrain: React.FC<TheBrainProps> = ({ history }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data processing for UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Analytics Logic
  const topAesthetic = useMemo(() => {
    if (history.length === 0) return "N/A";
    const counts: Record<string, { count: number; scoreSum: number }> = {};
    history.forEach(item => {
      if (!counts[item.mainAesthetic]) counts[item.mainAesthetic] = { count: 0, scoreSum: 0 };
      counts[item.mainAesthetic].count++;
      counts[item.mainAesthetic].scoreSum += item.viralScore;
    });

    let best = "N/A";
    let highestAvg = 0;

    Object.entries(counts).forEach(([aesthetic, data]) => {
      const avg = data.scoreSum / data.count;
      if (avg > highestAvg) {
        highestAvg = avg;
        best = aesthetic;
      }
    });
    return best;
  }, [history]);

  const recentPerformanceData = useMemo(() => {
     return history.slice(-7).map(h => ({
        date: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: h.viralScore,
        platform: h.platform
     }));
  }, [history]);

  const aestheticData = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(item => {
       counts[item.mainAesthetic] = (counts[item.mainAesthetic] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  const CustomTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
        return (
           <div className="bg-black/90 border border-gray-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
              <p className="text-gray-400 text-xs mb-1 font-mono">{label}</p>
              <p className="text-white font-bold text-sm">
                 {payload[0].name === 'score' ? 'Viral Score: ' : 'Count: '}
                 <span className="text-neon-cyan">{payload[0].value}</span>
              </p>
           </div>
        );
     }
     return null;
  };

  const SkeletonChart = () => (
    <div className="w-full h-full flex items-end gap-2 p-4 animate-pulse">
       {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-gray-800 rounded-t" style={{ width: '14%', height: `${Math.random() * 60 + 20}%`}}></div>
       ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
        <Database className="text-neon-blue" /> THE BRAIN 
        <span className="text-[10px] text-gray-500 font-mono font-normal mt-1 ml-2 border border-gray-800 px-2 rounded-full">LOCAL_NODE</span>
      </h2>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={64} /></div>
          <div className="p-3 bg-neon-purple/20 rounded-full text-neon-purple z-10">
            <TrendingUp size={24} />
          </div>
          <div className="z-10">
             <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Top Aesthetic</p>
             {isLoading ? <div className="h-6 w-24 bg-gray-800 rounded animate-pulse mt-1"></div> : <p className="text-xl font-bold text-white truncate max-w-[150px]">{topAesthetic}</p>}
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 bg-gradient-to-br from-gray-900 to-black">
           <div className="p-3 bg-neon-green/20 rounded-full text-neon-green">
            <Clock size={24} />
          </div>
          <div>
             <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Peak Hours</p>
             <p className="text-xl font-bold text-white">18:00 - 20:00</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 bg-gradient-to-br from-gray-900 to-black">
           <div className="p-3 bg-neon-blue/20 rounded-full text-neon-blue">
            <Music size={24} />
          </div>
          <div>
             <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Generations</p>
             <p className="text-xl font-bold text-white">{history.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card title="RECENT PERFORMANCE" className="h-[350px]">
           {isLoading ? <SkeletonChart /> : (
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentPerformanceData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                   <XAxis dataKey="date" stroke="#666" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
                   <YAxis stroke="#666" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
                   <Tooltip content={<CustomTooltip />} cursor={{stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4'}} />
                   <Line type="monotone" dataKey="score" stroke="#A855F7" strokeWidth={3} dot={{fill: '#000', stroke: '#A855F7', strokeWidth: 2, r: 4}} activeDot={{r: 6, fill: '#fff'}} />
                </LineChart>
             </ResponsiveContainer>
           )}
        </Card>

        {/* Aesthetic Breakdown */}
        <Card title="NICHE DOMINANCE" className="h-[350px]">
            {isLoading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aestheticData} layout="vertical" margin={{ left: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                   <XAxis type="number" stroke="#666" hide />
                   <YAxis dataKey="name" type="category" stroke="#fff" width={100} tick={{fontSize: 10, fill: '#999'}} axisLine={false} tickLine={false} />
                   <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                   <Bar dataKey="count" fill="#3B82F6" barSize={15} radius={[0, 4, 4, 0]}>
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
            )}
        </Card>
      </div>

      {/* Raw Data Table */}
      <Card title="NEURAL_LOGS" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono text-gray-400">
            <thead className="bg-gray-900/50 text-gray-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Viral Score</th>
                <th className="p-4">Aesthetic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.slice().reverse().map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-xs">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${row.platform === 'TikTok' ? 'bg-purple-500/10 text-purple-400' : 'bg-pink-500/10 text-pink-400'}`}>
                        {row.platform}
                     </span>
                  </td>
                  <td className="p-4">
                     <span className={`font-bold ${row.viralScore > 80 ? 'text-neon-green' : row.viralScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {row.viralScore}
                     </span>
                  </td>
                  <td className="p-4 text-white group-hover:text-neon-cyan transition-colors">{row.mainAesthetic}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                   <td colSpan={4} className="p-8 text-center text-gray-600 italic">No neural data recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};