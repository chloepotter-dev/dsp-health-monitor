import React, { useState } from 'react';
import Dashboard from './Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Utility Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 text-[11px] font-mono text-slate-400 py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">US-EAST-1</span> (Primary)
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Latency: <span className="text-slate-200">24ms</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-wider text-[10px]">
            PROD v1.2.4
          </span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-900 border border-indigo-400/30 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/10">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-100">DSP Link Console</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide block -mt-0.5">
                Automated Reconciliation & Health Stream
              </span>
            </div>
          </div>

          {/* Segmented Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Monitor Console
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'endpoints'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              DSP Webhooks
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              API Reference
            </button>
          </nav>

          {/* Operator Status Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-300 text-[11px] font-medium hidden sm:inline">Engine Active</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        
        {activeTab === 'dashboard' && (
          <div>
            {/* Header Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60 mb-6">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">System Operations & Health Monitoring</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time DSP link reconciliation engine and automated incident reporting dashboard.
                </p>
              </div>
            </div>

            {/* Live Dashboard Component */}
            <Dashboard />
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 space-y-4">
            <h2 className="text-base font-bold text-white">Monitored Digital Service Providers</h2>
            <p className="text-xs text-slate-400">Configured webhook listeners and API sync status across streaming platforms.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { name: 'Spotify Web API', status: '200 OK', latency: '18ms' },
                { name: 'Apple Music API', status: '200 OK', latency: '32ms' },
                { name: 'YouTube Music Data API', status: '200 OK', latency: '27ms' },
                { name: 'Amazon Music API', status: '200 OK', latency: '41ms' },
                { name: 'Tidal Connect API', status: '200 OK', latency: '22ms' }
              ].map((dsp) => (
                <div key={dsp.name} className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{dsp.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Ping: {dsp.latency}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                    {dsp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 space-y-4">
            <h2 className="text-base font-bold text-white">n8n & Supabase Webhook Endpoint</h2>
            <p className="text-xs text-slate-400">POST payloads directly into your live logging table using standard REST authentication headers.</p>
            <pre className="p-4 rounded-lg bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800/80 leading-relaxed">
{`POST https://urnkeiigxdrovpwukrew.supabase.co/rest/v1/dsp_logs
Headers:
  apikey: <SUPABASE_ANON_KEY>
  Authorization: Bearer <SUPABASE_ANON_KEY>
  Content-Type: application/json

Body:
{
  "status": "OK",
  "details": "Automated n8n reconciliation check completed for release UPC 123456789."
}`}
            </pre>
          </div>
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="font-semibold text-slate-400">DSP Health Engine</span>
            <span>•</span>
            <span>Built with React + Tailwind v4 + Supabase</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <a href="#docs" className="hover:text-slate-300 transition-colors">Documentation</a>
            <a href="#status" className="hover:text-slate-300 transition-colors">Supabase Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
