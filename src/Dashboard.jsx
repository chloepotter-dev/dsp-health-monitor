import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchTracks();

    // Subscribe to real-time inserts from n8n / Supabase
    const channel = supabase
      .channel('public:reconciled_tracks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reconciled_tracks' }, (payload) => {
        setTracks((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchTracks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('reconciled_tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reconciled tracks:', error);
    } else {
      setTracks(data || []);
    }
    setLoading(false);
  }

  // Triggers n8n workflow pipeline via Webhook
  async function triggerN8nWorkflow() {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      alert('Missing VITE_N8N_WEBHOOK_URL in your .env.local file.');
      return;
    }

    setTriggering(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'DSP Health Dashboard',
          requested_at: new Date().toISOString(),
          trigger_type: 'MANUAL_RECONCILIATION_RUN',
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned status ${response.status}`);
      }

      alert('Reconciliation pipeline successfully triggered in n8n!');
    } catch (err) {
      console.error('Error triggering n8n webhook:', err);
      alert('Failed to reach n8n webhook endpoint. Check your workflow status.');
    } finally {
      setTriggering(false);
    }
  }

  const filteredTracks = tracks.filter((track) => {
    const searchText = `${track.artist || ''} ${track.track_title || ''} ${track.isrc || ''}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || track.status_label === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTracks = tracks.length;
  const matchedCount = tracks.filter((t) => t.status_label === 'MATCHED').length;
  const mismatchCount = tracks.filter((t) => t.status_label === 'FLAGGED_MISMATCH' || t.status_label === 'NO_MATCH_FOUND').length;
  const matchRate = totalTracks > 0 ? ((matchedCount / totalTracks) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-10 font-sans flex flex-col items-center text-center w-full max-w-6xl mx-auto px-4 py-4">
      
      {/* Action Header Control Card */}
      <div className="ui-card ui-card-indigo p-8 sm:p-10 rounded-3xl w-full text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Automated Pipeline Control</h2>
          <p className="text-sm text-slate-500 mt-1">Dispatches a live HTTP payload directly to your n8n workflow engine</p>
        </div>

        <button
          onClick={triggerN8nWorkflow}
          disabled={triggering}
          className="px-8 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-2xl shadow-lg border border-indigo-500 transition-all cursor-pointer flex items-center justify-center gap-3 shrink-0 transform hover:scale-105"
        >
          {triggering ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Executing n8n Workflow...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run Catalog Reconciliation
            </>
          )}
        </button>
      </div>

      {/* Extra-Large Metric Grid with Hover Lift */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        
        {/* Total Reconciled */}
        <div className="ui-card ui-card-slate p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-400/10 hover:border-slate-300 cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-5 py-2 rounded-full border border-slate-200">
            Total Reconciled
          </span>
          <p className="text-6xl font-black text-slate-900 mt-6 font-mono">{totalTracks}</p>
          <p className="text-sm text-slate-500 mt-4 font-medium">Tracks processed through pipeline</p>
        </div>

        {/* Matched (OK) */}
        <div className="ui-card ui-card-emerald p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-200">
            Matched (OK)
          </span>
          <p className="text-6xl font-black text-emerald-600 mt-6 font-mono">{matchedCount}</p>
          <p className="text-sm text-emerald-700/80 mt-4 font-medium">Verified DSP link matches</p>
        </div>

        {/* Mismatches Flagged */}
        <div className="ui-card ui-card-rose p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-300 cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-5 py-2 rounded-full border border-rose-200">
            Mismatches Flagged
          </span>
          <p className="text-6xl font-black text-rose-600 mt-6 font-mono">{mismatchCount}</p>
          <p className="text-sm text-rose-700/80 mt-4 font-medium">Metadata discrepancies detected</p>
        </div>

        {/* Match Rate Card */}
        <div className="ui-card ui-card-indigo p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-5 py-2 rounded-full border border-indigo-200">
            Match Rate (Health)
          </span>
          
          <p className="text-6xl font-black text-indigo-600 mt-5 font-mono">{matchRate}%</p>
          
          <div className="w-full max-w-[320px] mx-auto mt-5 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${matchRate}%` }}
              />
            </div>
            <p className="text-xs text-indigo-700/90 font-semibold tracking-wide">
              Overall Endpoint Reliability Rate
            </p>
          </div>
        </div>

      </div>

      {/* Audit Stream Table Card */}
      <div className="ui-card ui-card-slate rounded-3xl overflow-hidden w-full shadow-sm transition-all duration-300 ease-out hover:shadow-lg">
        
        {/* Table Header Controls */}
        <div className="p-8 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-6 items-center">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">Reconciled Catalog Stream</h2>
            <p className="text-xs text-slate-500 mt-1">Filtering {filteredTracks.length} of {totalTracks} total entries</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Search artist, title, ISRC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 text-xs text-center sm:text-left bg-white border border-slate-300 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 min-w-[240px]"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 text-xs bg-white border border-slate-300 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="MATCHED">Matched Only</option>
              <option value="FLAGGED_MISMATCH">Mismatches Only</option>
              <option value="NO_MATCH_FOUND">No Match Found</option>
            </select>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-center border-collapse">
            <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 z-10">
              <tr className="text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-center">Timestamp</th>
                <th className="px-6 py-3.5 text-center">Track Info</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs bg-white">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-mono">
                    Connecting to Supabase stream...
                  </td>
                </tr>
              ) : filteredTracks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    No matching catalog records found.
                  </td>
                </tr>
              ) : (
                filteredTracks.map((track) => {
                  const isMatched = track.status_label === 'MATCHED';
                  return (
                    <tr key={track.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px] text-center">
                        {new Date(track.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-medium text-center">
                        <div className="font-bold text-slate-900">{track.track_title || 'Unknown Title'}</div>
                        <div className="text-[11px] text-slate-500">{track.artist || 'Unknown Artist'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isMatched ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {track.status_label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono text-[11px] text-center">
                        {track.match_confidence ? `${(track.match_confidence * 100).toFixed(0)}%` : 'N/A'}
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
  );
}