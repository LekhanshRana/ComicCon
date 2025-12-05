import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PlayerScore } from '../types';
import { getLeaderboardData } from '../services/leaderboardService';
import { ArrowLeft, Loader2, Trophy } from 'lucide-react';

interface LeaderboardProps {
  currentScore: PlayerScore | null;
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore, onBack }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [allScores, setAllScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboardData();
        // Sort by time (asc)
        const sorted = data.sort((a, b) => a.timeSeconds - b.timeSeconds);
        setAllScores(sorted);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || loading || allScores.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    // Take top 20 for the chart to keep it readable
    const chartData = allScores.slice(0, 15);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis: Rank
    const x = d3.scaleBand()
      .range([0, width])
      .domain(chartData.map((d, i) => `${i + 1}`))
      .padding(0.2);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("fill", "#94a3b8");

    // Y Axis: Time (seconds)
    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.timeSeconds) || 300])
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .select(".domain").attr("stroke", "#475569");
    
    svg.selectAll("tick line").attr("stroke", "#334155");
    svg.selectAll("text").attr("fill", "#94a3b8");

    // Bars
    svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => x(`${i + 1}`) || 0)
      .attr("y", d => y(d.timeSeconds))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.timeSeconds))
      .attr("fill", d => {
        // Highlight current user if they match name/time
        if (currentScore && d.name === currentScore.name && d.timeSeconds === currentScore.timeSeconds) {
            return "#f59e0b";
        }
        return "#475569";
      })
      .attr("rx", 4);

  }, [allScores, currentScore, loading]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-200">
      <div className="max-w-2xl mx-auto space-y-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Start
        </button>

        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-50 mb-2">Hall of Fame</h1>
          <p className="text-slate-400">Fastest times to assemble the teams.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
            <Loader2 size={40} className="animate-spin text-amber-500" />
            <p>Summoning records from the archives...</p>
          </div>
        ) : (
          <>
            {/* D3 Chart Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Time Distribution (Top 15)</h3>
              <svg ref={svgRef} className="w-full h-[200px]" />
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="p-4 text-slate-500 font-medium text-sm">Rank</th>
                    <th className="p-4 text-slate-500 font-medium text-sm">Volunteer</th>
                    <th className="p-4 text-slate-500 font-medium text-sm text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {allScores.length === 0 ? (
                      <tr>
                          <td colSpan={3} className="p-8 text-center text-slate-500 italic">No records found yet.</td>
                      </tr>
                  ) : (
                    allScores.map((score, idx) => {
                        const isCurrentUser = currentScore && score.name === currentScore.name && score.timeSeconds === currentScore.timeSeconds;
                        return (
                        <tr key={idx} className={isCurrentUser ? "bg-amber-500/10" : "hover:bg-slate-800/50"}>
                            <td className="p-4 font-mono text-slate-400 w-16">
                                {idx === 0 && <Trophy size={16} className="text-amber-400 inline mr-1" />}
                                #{idx + 1}
                            </td>
                            <td className="p-4 font-medium text-slate-200">
                            {score.name}
                            {isCurrentUser && <span className="ml-2 text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">YOU</span>}
                            </td>
                            <td className="p-4 text-right font-mono text-emerald-400">{formatTime(score.timeSeconds)}</td>
                        </tr>
                        );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
