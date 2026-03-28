'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import {
  Shield, AlertTriangle, CheckCircle, Info, Send, Mic, Camera,
  LayoutDashboard, Database, Map as MapIcon, Settings, Zap,
  Clock, ChevronRight, Radio, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface CrisisResult {
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  domain: string;
  summary: string;
  immediate_actions: string[];
  system_integrations: string[];
  emergency_contacts: string[];
  geo_context: string;
  structured_report: string;
  confidence_score: string;
  risk_flags: string[];
  explanation: string;
}

const urgencyConfig = {
  CRITICAL: {
    border: 'border-emergency/40',
    bg: 'bg-emergency/10',
    text: 'text-emergency',
    glow: 'glow-emergency',
    pulse: 'pulse-critical',
    label: 'CRITICAL THREAT',
    icon: AlertTriangle,
  },
  HIGH: {
    border: 'border-warning/40',
    bg: 'bg-warning/10',
    text: 'text-warning',
    glow: 'glow-warning',
    pulse: 'pulse-high',
    label: 'HIGH PRIORITY',
    icon: AlertCircle,
  },
  MEDIUM: {
    border: 'border-primary/40',
    bg: 'bg-primary/10',
    text: 'text-primary',
    glow: 'glow-primary',
    pulse: '',
    label: 'MEDIUM PRIORITY',
    icon: Info,
  },
  LOW: {
    border: 'border-white/20',
    bg: 'bg-white/5',
    text: 'text-white/60',
    glow: '',
    pulse: '',
    label: 'LOW PRIORITY',
    icon: CheckCircle,
  },
};

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrisisResult | null>(null);
  const [history, setHistory] = useState<CrisisResult[]>([]);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [confidenceWidth, setConfidenceWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Animate progress bar when result arrives
  useEffect(() => {
    if (result) {
      const raw = parseFloat(result.confidence_score.replace('%', ''));
      setConfidenceWidth(0);
      const timer = setTimeout(() => setConfidenceWidth(isNaN(raw) ? 85 : raw), 200);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const analyzeCrisis = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/crisis/analyze`, { input });
      setResult(response.data);
      setHistory((prev) => [response.data, ...prev.slice(0, 19)]);
      setInput('');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Engine offline. Verify backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) analyzeCrisis();
  };

  return (
    <main className="min-h-screen bg-void-black text-white relative">
      <Navbar crisisCount={history.length} />

      <div className="flex h-[calc(100vh-4rem)] relative z-10">
        {/* Left Sidebar */}
        <aside className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-void-deep/80">
          {[
            { id: 'dashboard', Icon: LayoutDashboard },
            { id: 'database',  Icon: Database },
            { id: 'map',       Icon: MapIcon },
          ].map(({ id, Icon }) => (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => setActiveNav(id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeNav === id
                  ? 'bg-primary/15 text-primary border border-primary/30 glow-primary'
                  : 'text-white/30 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
          <button
            id="nav-settings"
            onClick={() => setActiveNav('settings')}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 text-white/30 hover:text-white/70 hover:bg-white/5 mt-auto"
          >
            <Settings className="w-5 h-5" />
          </button>
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col overflow-hidden">
          {/* Metrics Header */}
          <header className="h-20 border-b border-white/5 flex items-center px-8 gap-10 bg-void-deep/60 backdrop-blur-sm shrink-0">
            <MetricCard label="ACTIVE_CRISIS"  value={history.length.toString().padStart(2, '0')} color="text-primary" />
            <div className="w-px h-8 bg-white/5" />
            <MetricCard label="THREAT_LEVEL"   value={result?.urgency ?? 'STANDBY'} color={result ? urgencyConfig[result.urgency].text : 'text-white/40'} />
            <div className="w-px h-8 bg-white/5" />
            <MetricCard label="AI_ENGINE"      value="GEMINI 1.5" color="text-violet" />
            <div className="w-px h-8 bg-white/5" />
            <MetricCard label="UPTIME"         value="99.98%"     color="text-success" />
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Center Panel */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6 custom-scrollbar">
              <div className="max-w-3xl mx-auto w-full space-y-6">

                {/* Input Terminal */}
                <div className="glass rounded-2xl p-6 relative overflow-hidden scanline group">
                  {/* Left accent strip */}
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-primary via-violet to-primary/20 rounded-l-2xl" />

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <h2 className="text-[11px] font-mono text-primary/70 uppercase tracking-[0.25em]">
                      Crisis_Input_Terminal
                    </h2>
                    <span className="ml-auto text-[10px] font-mono text-white/20">Ctrl+Enter to analyze</span>
                  </div>

                  <div className="flex items-end gap-4">
                    <div className="flex-1 relative">
                      <textarea
                        id="crisis-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type or paste unstructured crisis input (e.g. 'Large fire on MG Road, chemicals involved, 20+ trapped')..."
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-primary/40 rounded-xl p-4 pr-16 text-sm text-white/90 placeholder:text-white/20 focus:outline-none transition-colors h-28 resize-none font-mono leading-relaxed"
                      />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <button title="Voice input" className="p-1.5 rounded-lg text-white/20 hover:text-primary hover:bg-primary/10 transition-all">
                          <Mic className="w-4 h-4" />
                        </button>
                        <button title="Image input" className="p-1.5 rounded-lg text-white/20 hover:text-primary hover:bg-primary/10 transition-all">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      id="analyze-btn"
                      onClick={analyzeCrisis}
                      disabled={loading || !input.trim()}
                      className="bg-primary hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed text-void-black font-bold h-28 w-24 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 glow-primary shrink-0"
                    >
                      {loading ? (
                        <div className="waveform">
                          <span /><span /><span /><span /><span />
                        </div>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span className="text-[10px] font-mono tracking-wider">ANALYZE</span>
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <p className="mt-3 text-xs text-emergency/80 font-mono flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> {error}
                    </p>
                  )}
                </div>

                {/* Intelligence Output */}
                <AnimatePresence mode="wait">
                  {result && (
                    <motion.div
                      key={JSON.stringify(result)}
                      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="space-y-4"
                    >
                      {/* Urgency Banner */}
                      <div className={`flex items-center gap-4 p-4 rounded-xl border ${urgencyConfig[result.urgency].bg} ${urgencyConfig[result.urgency].border} ${urgencyConfig[result.urgency].glow} reveal-up reveal-up-1`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${urgencyConfig[result.urgency].bg} border ${urgencyConfig[result.urgency].border}`}>
                          <AlertTriangle className={`w-5 h-5 ${urgencyConfig[result.urgency].text}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-black uppercase tracking-tighter leading-none ${urgencyConfig[result.urgency].text}`}>
                            {urgencyConfig[result.urgency].label}
                          </h3>
                          <p className="text-xs text-white/50 mt-0.5 font-mono">{result.domain} · Intelligence synthesized</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-mono text-white/30 mb-1">CONFIDENCE</p>
                          <p className={`text-lg font-bold font-mono ${urgencyConfig[result.urgency].text}`}>{result.confidence_score}</p>
                          <div className="progress-bar w-20 mt-1">
                            <div className="progress-bar-fill" style={{ width: `${confidenceWidth}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Summary + Actions / Contacts + Integrations */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Left: Summary & Actions */}
                        <div className="glass rounded-xl p-5 space-y-4 reveal-up reveal-up-2">
                          <div>
                            <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                              <Info className="w-3 h-3" /> Synthesis_Summary
                            </h4>
                            <p className="text-sm leading-relaxed text-white/80">{result.summary}</p>
                          </div>

                          <div className="pt-4 border-t border-white/5 space-y-2">
                            <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Zap className="w-3 h-3 text-warning" /> Immediate_Actions
                            </h4>
                            {result.immediate_actions.map((action, i) => (
                              <div key={i} className="flex gap-3 items-start group">
                                <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-mono text-primary border border-primary/20 shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <p className="text-xs text-white/70 group-hover:text-white transition-colors leading-relaxed">{action}</p>
                              </div>
                            ))}
                          </div>

                          {result.risk_flags.length > 0 && (
                            <div className="pt-4 border-t border-white/5">
                              <h4 className="text-[10px] font-mono text-emergency/60 uppercase tracking-[0.2em] mb-2">Risk_Flags</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {result.risk_flags.map((flag, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-emergency/10 border border-emergency/20 text-[10px] font-mono text-emergency">
                                    ⚠ {flag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: Contacts + Integrations */}
                        <div className="glass rounded-xl p-5 space-y-5 reveal-up reveal-up-3">
                          <div>
                            <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                              <Radio className="w-3 h-3 text-emergency" /> Emergency_Contacts
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {result.emergency_contacts.map((contact, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-emergency/10 text-emergency border border-emergency/25 text-xs font-bold font-mono">
                                  📞 {contact}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">System_Integrations</h4>
                            <div className="space-y-2">
                              {result.system_integrations.map((sys, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-success/80 font-mono">
                                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                  {sys}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">Geo_Context</h4>
                            <p className="text-xs text-white/60 font-mono leading-relaxed">{result.geo_context}</p>
                          </div>
                        </div>
                      </div>

                      {/* Explanation Card */}
                      <div className="glass rounded-xl p-5 reveal-up reveal-up-4">
                        <h4 className="text-[10px] font-mono text-violet/60 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                          <Shield className="w-3 h-3" /> AI_Explanation
                        </h4>
                        <p className="text-xs text-white/60 leading-relaxed">{result.explanation}</p>
                      </div>

                    </motion.div>
                  )}

                  {!result && !loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-2xl glass-primary flex items-center justify-center glow-primary">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-display font-semibold text-white/60">System Ready</h3>
                      <p className="text-sm text-white/30 max-w-sm">
                        Enter any unstructured crisis input above. The intelligence engine will classify, triage, and return a structured life-saving report.
                      </p>
                      <div className="flex items-center gap-6 mt-4">
                        {['Medical', 'Disaster', 'Security', 'Infrastructure'].map((d) => (
                          <span key={d} className="text-[10px] font-mono text-white/20 border border-white/10 px-2 py-1 rounded">{d}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Sidebar — Intelligence Log */}
            <aside className="w-72 border-l border-white/5 bg-void-deep/80 flex flex-col shrink-0">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Intelligence_Log</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-mono">
                  {history.length.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {history.length === 0 && (
                  <p className="text-[11px] text-white/20 font-mono text-center py-8">No incidents yet</p>
                )}
                {history.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i === 0 ? 0 : 0 }}
                    onClick={() => setResult(log)}
                    className="p-3 rounded-xl border border-white/5 hover:border-white/15 transition-all cursor-pointer group bg-white/[0.02] hover:bg-white/[0.04]"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[10px] font-bold uppercase font-mono ${urgencyConfig[log.urgency].text}`}>
                        {log.urgency}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-white/20" />
                        <span className="text-[9px] text-white/20 font-mono">LIVE</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-white/50 line-clamp-2 group-hover:text-white/80 transition-colors leading-relaxed">{log.summary}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-white/20 group-hover:text-primary/60 transition-colors">
                      <span className="text-[9px] font-mono">{log.domain}</span>
                      <ChevronRight className="w-2.5 h-2.5 ml-auto" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-mono text-white/30 tracking-[0.2em] mb-1">{label}</span>
      <span className={`text-base font-bold tracking-tight font-mono ${color}`}>{value}</span>
    </div>
  );
}
