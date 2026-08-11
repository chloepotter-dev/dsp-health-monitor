import React, { useState } from 'react';
import Dashboard from './Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-start text-center font-sans antialiased relative selection:bg-indigo-500 selection:text-white w-full">
      
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Utility Bar */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 text-[11px] font-mono text-slate-600 py-2 px-4 flex justify-center items-center gap-4 relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-800 font-semibold">US-EAST-1</span> (Primary)
        </span>
        <span className="text-slate-300">|</span>
        <span>Latency: <span className="text-slate-800 font-semibold">24ms</span></span>
        <span className="text-slate-300">|</span>
        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold uppercase tracking-wider text-[10px]">
          PROD v1.2.4
        </span>
      </div>

      {/* Navigation Header */}
      <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex flex-col sm:flex-row items-center justify-center gap-4 py-2 sm:py-0">
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
              ⚡
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">DSP Link Console</span>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner mx-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-600 shadow-md border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Monitor Console
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'endpoints'
                  ? 'bg-white text-indigo-600 shadow-md border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              DSP Webhooks
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-white text-indigo-600 shadow-md border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              API Reference
            </button>
          </nav>

        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6 flex flex-col items-center justify-center text-center relative z-10">
        
        {activeTab === 'dashboard' && (
          <div className="w-full flex flex-col items-center text-center space-y-6">
            
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 w-full text-center">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-widest inline-block mb-3">
                Operations Overview
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                System Operations & Health Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                Real-time DSP link reconciliation engine and automated incident reporting dashboard.
              </p>
            </div>

            <div className="w-full">
              <Dashboard />
            </div>
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 w-full flex flex-col items-center text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Monitored Digital Service Providers</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Configured webhook listeners and real-time sync status across streaming platforms.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 w-full">
              {[
                { name: 'Spotify Web API', status: '200 OK', latency: '18ms', desc: 'Catalog & metadata matching' },
                { name: 'Apple Music API', status: '200 OK', latency: '32ms', desc: 'ISRC validation hook' },
                { name: 'YouTube Music API', status: '200 OK', latency: '27ms', desc: 'Content ID verification' },
                { name: 'Amazon Music API', status: '200 OK', latency: '41ms', desc: 'UPC link resolver' },
                { name: 'Tidal Connect API', status: '200 OK', latency: '22ms', desc: 'Lossless payload stream' }
              ].map((dsp) => (
                <div key={dsp.name} className="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-400 transition-all">
                  <span className="text-xs font-bold text-slate-900">{dsp.name}</span>
                  <span className="text-[11px] text-slate-500">{dsp.desc}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-mono">Ping: {dsp.latency}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                      {dsp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 w-full flex flex-col items-center text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">n8n & Supabase Webhook Endpoint</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                POST payloads directly into your live logging table using standard REST authentication headers.
              </p>
            </div>

            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner text-left text-indigo-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">POST /rest/v1/dsp_logs</span>
                <span className="text-[10px] font-mono text-slate-400">JSON</span>
              </div>
              <pre className="font-mono text-xs overflow-x-auto leading-relaxed">
{`Headers:
  apikey: <SUPABASE_ANON_KEY>
  Authorization: Bearer <SUPABASE_ANON_KEY>
  Content-Type: application/json

Body:
{
  "status": "OK",
  "details": "Automated n8n reconciliation check completed."
}`}
              </pre>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 mt-12 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <div className="flex items-center justify-center gap-2 font-mono text-[11px]">
            <span className="font-semibold text-slate-700">DSP Health Engine</span>
            <span>•</span>
            <span>Built with React + Tailwind v4 + Supabase</span>
          </div>
        </div>
      </footer>

    </div>
  );
}