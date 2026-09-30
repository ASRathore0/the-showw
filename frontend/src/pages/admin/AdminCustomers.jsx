import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Users } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/customers')
      .then(res => {
        if (res.data.success) setCustomers(res.data.customers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Registered Audience &amp; Customers" />

        <main className="p-8 space-y-6 max-w-7xl">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white font-heading uppercase">CUSTOMER DIRECTORY</h2>
            <div className="text-xs text-gray-400">Total Registered Members: {customers.length}</div>
          </div>

          <div className="admin-card rounded-xl border border-[#1E2638] bg-[#0F131C] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161C2A] border-b border-[#1E2638] text-gray-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Bookings Count</th>
                    <th className="p-4">Auditions Count</th>
                    <th className="p-4">Total Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-12 text-gray-500">Loading customers...</td></tr>
                  ) : customers.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-12 text-gray-500">No registered customers found.</td></tr>
                  ) : (
                    customers.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-white">{c.name}</td>
                        <td className="p-4 text-gray-300">{c.email}</td>
                        <td className="p-4 text-gray-400">{c.phone || '—'}</td>
                        <td className="p-4">{c.city || '—'}</td>
                        <td className="p-4 font-bold text-white">{c.bookings_count} Bookings</td>
                        <td className="p-4 text-[#D6A84F] font-bold">{c.applications_count} Auditions</td>
                        <td className="p-4 font-bold text-[#D6A84F]">₹{c.total_spend || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminCustomers;
