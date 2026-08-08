import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('public:dsp_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dsp_logs' }, (payload) => {
        setLogs((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('dsp_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  }

  async function sendTestLog() {
    setSending(true);
    const statuses = ['OK', 'ERROR'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const dspNames = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Tidal'];
    const selectedDsp = dspNames[Math.floor(Math.random() * dspNames.length)];
    
    const sampleMessage =
      randomStatus === 'OK'
        ? `Manual Ping: ${selectedDsp} link match verified successfully (${new Date().toLocaleTimeString()}).`
        : `Manual Ping: Metadata mismatch or link failure detected on ${selectedDsp} (${new Date().toLocaleTimeString()}).`;

    const { error } = await supabase.from('dsp_logs').insert([
      {
        status: randomStatus,
        details: sampleMessage,
      },
    ]);

    if (error) {
      console.error('Error sending test log:', error);
      alert('Failed to send test log. Check browser console for RLS policies or details.');
    }
    setSending(false);
  }

  const filteredLogs = logs.filter((log) => {
    const detailsText = log.details || log.message || '';
    const matchesSearch = detailsText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLogs = logs.length;
  const successCount = logs.filter((l) => l.status === 'OK' || l.status === 'SUCCESS').length;
  const errorCount = logs.filter((l) => l.status === 'ERROR' || l.status === 'FAILED').length;
  const successRate = totalLogs > 0 ? ((successCount / totalLogs) * 100).toFixed(1) : '100.0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">DSP Health Monitor</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Engine
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Real-time DSP link reconciliation engine & automated incident stream
            </p>
          </div>

          <button
            onClick={sendTestLog}
            disabled={sending}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-lg shadow-indigo-600/20 border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Send Test Log
              </>
            )}
          </button>
        </div>

        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Checks</p>
            <p className="text-3xl font-extrabold text-white mt-2 font-mono">{totalLogs}</p>
            <p className="text-xs text-slate-500 mt-2">Captured events</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-emerald-500/20 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Reconciled (OK)</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">{successCount}</p>
            <p className="text-xs text-emerald-500/80 mt-2">Verified link matches</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-rose-500/20 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">Errors Detected</p>
            <p className="text-3xl font-extrabold text-rose-400 mt-2 font-mono">{errorCount}</p>
            <p className="text-xs text-rose-500/80 mt-2">Mismatches & timeouts</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-indigo-500/20 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Health Score</p>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2 font-mono">{successRate}%</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Logs Console Container */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between gap-4 items-center bg-slate-900/40">
            <div>
              <h2 className="text-base font-bold text-slate-100">Audit Stream</h2>
              <p className="text-xs text-slate-400">Filtering {filteredLogs.length} of {totalLogs} total entries</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="OK">OK Only</option>
                <option value="ERROR">Errors Only</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500 font-mono">
                      Connecting to database stream...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                      No matching audit records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isOk = log.status === 'OK' || log.status === 'SUCCESS';
                    return (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-xs">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                              isOk
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-200 font-medium group-hover:text-white transition-colors">
                          {log.details || log.message || JSON.stringify(log)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
