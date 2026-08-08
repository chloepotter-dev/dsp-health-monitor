import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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

  const filteredLogs = logs.filter((log) => {
    const detailsText = log.details || log.message || '';
    const matchesSearch = detailsText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLogs = logs.length;
  const successCount = logs.filter((l) => l.status === 'OK' || l.status === 'SUCCESS').length;
  const errorCount = logs.filter((l) => l.status === 'ERROR' || l.status === 'FAILED').length;

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Checks</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalLogs}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Reconciled (OK)</p>
          <p className="text-3xl font-extrabold text-emerald-700 mt-1">{successCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">Errors Detected</p>
          <p className="text-3xl font-extrabold text-rose-700 mt-1">{errorCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Reconciliation Logs</h2>
            <p className="text-xs text-gray-500">Live feed of automated DSP link health checks</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="OK">OK</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                    Fetching real-time updates...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                    No matching logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isOk = log.status === 'OK' || log.status === 'SUCCESS';
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                            isOk
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
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
  );
}
