import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  Ticket, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    apiClient.get('/admin/dashboard')
      .then(res => {
        if (res.data.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Operational Overview" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl">
          
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading SaaS metrics...</div>
          ) : (
            <>
              {/* Top 5 Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                
                <div className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
                    <span>TOTAL APPLICANTS</span>
                    <Users className="w-4 h-4 text-[#B51D2A]" />
                  </div>
                  <div className="text-2xl font-extrabold font-heading text-white">{data?.metrics?.total_applications?.toLocaleString()}</div>
                  <div className="text-[10px] text-green-400 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +14.2% from last month
                  </div>
                </div>

                <div className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
                    <span>SHORTLISTED TALENT</span>
                    <Sparkles className="w-4 h-4 text-[#D6A84F]" />
                  </div>
                  <div className="text-2xl font-extrabold font-heading text-[#D6A84F]">{data?.metrics?.shortlisted?.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 mt-1">Ready for audition round</div>
                </div>

                <div className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
                    <span>UPCOMING SHOWS</span>
                    <Calendar className="w-4 h-4 text-[#B51D2A]" />
                  </div>
                  <div className="text-2xl font-extrabold font-heading text-white">{data?.metrics?.upcoming_shows}</div>
                  <div className="text-[10px] text-gray-400 mt-1">Active tour dates</div>
                </div>

                <div className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
                    <span>TICKETS SOLD</span>
                    <Ticket className="w-4 h-4 text-[#D6A84F]" />
                  </div>
                  <div className="text-2xl font-extrabold font-heading text-white">{data?.metrics?.tickets_sold?.toLocaleString()}</div>
                  <div className="text-[10px] text-green-400 font-semibold mt-1">+8.5% growth</div>
                </div>

                <div className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
                    <span>TOTAL REVENUE</span>
                    <IndianRupee className="w-4 h-4 text-[#D6A84F]" />
                  </div>
                  <div className="text-2xl font-extrabold font-heading text-[#D6A84F]">₹{(data?.metrics?.total_revenue / 100000).toFixed(1)}L</div>
                  <div className="text-[10px] text-green-400 font-semibold mt-1">₹48.6L target achieved</div>
                </div>

              </div>

              {/* Recharts Revenue & Applications Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Revenue Growth Chart */}
                <div className="lg:col-span-8 admin-card p-6 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white font-heading uppercase">TICKET SALES &amp; REVENUE TREND</h3>
                      <p className="text-xs text-gray-400">Monthly breakdown across all show tour venues</p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data?.charts?.revenue}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#B51D2A" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#B51D2A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                        <XAxis dataKey="month" stroke="#666" fontSize={11} />
                        <YAxis stroke="#666" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F131C', borderColor: '#1E2638', color: '#fff', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#B51D2A" fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Applications by Category Chart */}
                <div className="lg:col-span-4 admin-card p-6 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <h3 className="text-base font-bold text-white font-heading uppercase mb-2">APPLICANTS BY TALENT CATEGORY</h3>
                  <p className="text-xs text-gray-400 mb-6">Distribution of audition entries</p>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.charts?.applications}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
                        <XAxis dataKey="category" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F131C', borderColor: '#1E2638', color: '#fff', fontSize: '12px' }} />
                        <Bar dataKey="count" fill="#D6A84F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Recent Applicants & Bookings Table Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Applicants */}
                <div className="admin-card p-6 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <h3 className="text-sm font-bold text-white font-heading uppercase mb-4 pb-3 border-b border-[#1E2638]">
                    RECENT AUDITION APPLICANTS
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    {data?.recent_applicants?.map(app => (
                      <div key={app.id} className="p-3 rounded-lg bg-[#161C2A] border border-[#263148] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{app.full_name} ({app.category})</div>
                          <div className="text-[11px] text-gray-400">{app.application_no} &bull; {app.city}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#B51D2A]/20 text-[#B51D2A] border border-[#B51D2A] font-bold text-[10px]">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="admin-card p-6 rounded-xl border border-[#1E2638] bg-[#0F131C]">
                  <h3 className="text-sm font-bold text-white font-heading uppercase mb-4 pb-3 border-b border-[#1E2638]">
                    RECENT TICKET BOOKINGS
                  </h3>

                  <div className="space-y-3 text-xs">
                    {data?.recent_bookings?.map(b => (
                      <div key={b.id} className="p-3 rounded-lg bg-[#161C2A] border border-[#263148] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{b.customer_name} &bull; {b.booking_no}</div>
                          <div className="text-[11px] text-gray-400">{b.show?.title} ({b.total_seats} seats)</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#D6A84F]">₹{b.total_amount}</div>
                          <span className="text-[10px] text-green-400 uppercase font-semibold">{b.payment_status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
