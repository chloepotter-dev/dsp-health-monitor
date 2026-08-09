import React, { useState } from 'react';
import Dashboard from './Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Global Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
              D
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">DSP Health Engine</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 block -mt-1">
                Enterprise Ops
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Monitor Console
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'endpoints'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              DSP Endpoints
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'docs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              API & Webhooks
            </button>
          </nav>

          {/* User Profile / Status */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-xs text-indigo-300">
              CP
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {activeTab === 'dashboard' && (
          <div>
            {/* Hero Sub-header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 sm:p-8 rounded-2xl border border-indigo-500/10 shadow-2xl relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  Automated Reconciliation Suite
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
                  DSP Link Integrity & Incident Control
                </h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Continuous multi-platform reconciliation monitoring for Spotify, Apple Music, YouTube Music, and Amazon Music webhooks.
                </p>
              </div>
            </div>

            {/* Live Dashboard Component */}
            <Dashboard />
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">Monitored Digital Service Providers</h2>
            <p className="text-sm text-slate-400">Configured webhook listeners and API sync status.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {['Spotify Web API', 'Apple Music API', 'YouTube Music Data API', 'Amazon Music API', 'Tidal Connect'].map((dsp) => (
                <div key={dsp} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-200">{dsp}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">200 OK</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">n8n & Supabase Webhook Integration</h2>
            <p className="text-sm text-slate-400">POST payloads directly into your live logging engine.</p>
            <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800">
{`POST https://urnkeiigxdrovpwukrew.supabase.co/rest/v1/dsp_logs
Headers:
  apikey: <SUPABASE_ANON_KEY>
  Authorization: Bearer <SUPABASE_ANON_KEY>
  Content-Type: application/json

Body:
{
  "status": "OK",
  "details": "Automated n8n reconciliation run complete."
}`}
            </pre>
          </div>
        )}

      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">DSP Health Monitor</span>
            <span>•</span>
            <span>v1.2.0</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">System Docs</a>
            <a href="#status" className="hover:text-slate-300 transition-colors">Supabase Status</a>
            <a href="#support" className="hover:text-slate-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
