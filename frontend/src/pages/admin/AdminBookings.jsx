import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Ticket, Search } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    apiClient.get('/admin/bookings')
      .then(res => {
        if (res.data.success) setBookings(res.data.bookings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Ticket Bookings &amp; Transactions" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white font-heading uppercase">TICKET RESERVATIONS AUDIT</h2>
            <div className="text-xs text-gray-400">Total Bookings Recorded: {bookings.length}</div>
          </div>

          <div className="admin-card rounded-xl border border-[#1E2638] bg-[#0F131C] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161C2A] border-b border-[#1E2638] text-gray-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Booking Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Show Event</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-12 text-gray-500">Loading bookings...</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-12 text-gray-500">No ticket bookings recorded yet.</td></tr>
                  ) : (
                    bookings.map(b => (
                      <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-[#D6A84F]">{b.booking_no}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{b.customer_name}</div>
                          <div className="text-[11px] text-gray-400">{b.customer_phone} &bull; {b.customer_email}</div>
                        </td>
                        <td className="p-4 text-gray-300 font-semibold">{b.show?.title}</td>
                        <td className="p-4">{b.total_seats} Seats</td>
                        <td className="p-4 font-bold text-white">₹{b.total_amount}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-green-950 text-green-300 border border-green-700 font-bold uppercase text-[10px]">
                            {b.payment_status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">{b.created_at?.split('T')[0]}</td>
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

export default AdminBookings;
