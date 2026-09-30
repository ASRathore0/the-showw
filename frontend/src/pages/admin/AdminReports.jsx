import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Download, Calendar, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [dateFilter, setDateFilter] = useState('30 days');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    apiClient.get('/admin/reports')
      .then(res => {
        if (res.data.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dateFilter]);

  const handleExportCSV = () => {
    if (!data?.sales_by_city) return;
    
    let csvContent = "data:text/csv;charset=utf-8,City,Total Revenue (INR),Total Tickets Sold\n";
    data.sales_by_city.forEach(row => {
      csvContent += `${row.city},${row.total_revenue},${row.total_tickets}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jp_yadav_show_report_${dateFilter.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Reports &amp; Financial Analytics" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          
          {/* Header Controls */}
          <div className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading uppercase">TICKET &amp; AUDITION AUDIT REPORTS</h2>
              <p className="text-xs text-gray-400">Generate city performance metrics, ticket revenue breakdown, and export CSV logs.</p>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={dateFilter} 
                onChange={e => setDateFilter(e.target.value)}
                className="bg-[#161C2A] border border-[#263148] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Today">Today</option>
                <option value="7 days">Last 7 Days</option>
                <option value="30 days">Last 30 Days</option>
                <option value="3 months">Last 3 Months</option>
              </select>

              <button 
                onClick={handleExportCSV} 
                className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> EXPORT CSV REPORT
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading analytics reports...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Sales by City Bar Chart */}
              <div className="admin-card p-6 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                <h3 className="text-base font-bold text-white font-heading uppercase mb-2">TICKET REVENUE BY TOUR CITY</h3>
                <p className="text-xs text-gray-400 mb-6">Total earnings breakdown across venues</p>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.sales_by_city}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                      <XAxis dataKey="city" stroke="#666" fontSize={11} />
                      <YAxis stroke="#666" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F131C', borderColor: '#1E2638', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="total_revenue" fill="#B51D2A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Auditions Applications Breakdown */}
              <div className="admin-card p-6 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                <h3 className="text-base font-bold text-white font-heading uppercase mb-2">AUDITION ENTRIES BY TALENT CATEGORY</h3>
                <p className="text-xs text-gray-400 mb-6">Applications received per genre</p>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.applications_by_category}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                      <XAxis dataKey="category" stroke="#666" fontSize={11} />
                      <YAxis stroke="#666" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F131C', borderColor: '#1E2638', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="total" fill="#D6A84F" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminReports;
