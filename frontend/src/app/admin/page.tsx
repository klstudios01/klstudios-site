"use client";

import React, { useState, useEffect } from "react";
import { 
  DollarSign, Briefcase, Users, Ticket, Activity, Edit3, 
  Check, Save, Plus, Trash2, Key, Loader2, RefreshCw, Clock, Send
} from "lucide-react";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>({
    total_orders: 0,
    total_revenue: 0,
    status_distribution: { pending: 0, in_progress: 0, completed: 0 },
    activity_logs: []
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([
    { code: "KLLEGACY20", percent_discount: 20, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPercent, setNewCouponPercent] = useState(20);

  // Selected for edits
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editStatus, setEditStatus] = useState("pending");
  const [editStaff, setEditStaff] = useState("");

  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [ticketReply, setTicketReply] = useState("");

  const fetchAdminData = () => {
    const token = localStorage.getItem("token") || "mock-token";
    
    // Fetch orders
    fetch(`http://localhost:8000/api/admin/orders?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(() => {
        // Fallback local state for direct testing/rendering
        const mockOrders = [
          {
            order: { id: "ORD-26071610-1", service_id: "website", total: 2940, paid_amount: 1470, balance: 1470, payment_status: "deposit_paid", status: "in_progress", staff_assigned_id: 2, created_at: "2026-07-16T12:00:00Z" },
            client_name: "John Doe",
            staff_name: "Legacy Designer"
          },
          {
            order: { id: "ORD-26071610-2", service_id: "design", total: 352.8, paid_amount: 0, balance: 352.8, payment_status: "pending", status: "pending", staff_assigned_id: null, created_at: "2026-07-16T14:30:00Z" },
            client_name: "Jane Smith",
            staff_name: "Unassigned"
          }
        ];
        setOrders(mockOrders);
      });

    // Fetch Tickets
    fetch(`http://localhost:8000/api/tickets?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTickets(data);
      })
      .catch(() => {
        const mockTickets = [
          { id: 1, subject: "Hosting Server Credentials Query", status: "open", messages: [{ sender: "client", sender_name: "John Doe", text: "Where do we host the website?", time: "2026-07-16 13:00" }] }
        ];
        setTickets(mockTickets);
      });

    // Fetch analytics
    fetch(`http://localhost:8000/api/admin/analytics?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.total_orders !== undefined) setAnalytics(data);
      })
      .catch(() => {
        setAnalytics({
          total_orders: 2,
          total_revenue: 1822.8,
          status_distribution: { pending: 1, in_progress: 1, completed: 0 },
          activity_logs: [
            { id: 1, user_name: "John Doe", action: "Create Order", details: "Created order ORD-26071610-1", created_at: "2026-07-16T12:00:00Z" },
            { id: 2, user_name: "John Doe", action: "Pay Invoice", details: "Paid GH¢ 1,470 for order ORD-26071610-1", created_at: "2026-07-16T12:15:00Z" }
          ]
        });
      });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    const token = localStorage.getItem("token") || "mock-token";
    const payload = {
      status: editStatus,
      staff_assigned_id: editStaff ? Number(editStaff) : null
    };

    try {
      await fetch(`http://localhost:8000/api/admin/orders/${editingOrder.order.id}?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setEditingOrder(null);
      fetchAdminData();
    } catch {
      // Local Mock State update
      const updatedList = orders.map(item => {
        if (item.order.id === editingOrder.order.id) {
          const ordCopy = { ...item.order, status: editStatus };
          return {
            ...item,
            order: ordCopy,
            staff_name: editStaff === "2" ? "Legacy Designer" : "Unassigned"
          };
        }
        return item;
      });
      setOrders(updatedList);
      setEditingOrder(null);
    }
  };

  const handleCreateCoupon = () => {
    if (!newCouponCode) return;
    const newCoupon = {
      code: newCouponCode.toUpperCase(),
      percent_discount: newCouponPercent,
      active: true
    };
    setCoupons([...coupons, newCoupon]);
    setNewCouponCode("");
  };

  const handleSendTicketReply = async () => {
    if (!ticketReply) return;
    const token = localStorage.getItem("token") || "mock-token";
    try {
      const res = await fetch(`http://localhost:8000/api/tickets/${activeTicket.id}/message?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ticketReply })
      });
      const data = await res.json();
      setTicketReply("");
      fetchAdminData();
      setActiveTicket(data);
    } catch {
      const updatedMessages = [...activeTicket.messages, { sender: "support", sender_name: "Kalaphol Staff", text: ticketReply, time: "Just now" }];
      const updatedTicket = { ...activeTicket, status: "in_progress", messages: updatedMessages };
      setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
      setActiveTicket(updatedTicket);
      setTicketReply("");
    }
  };

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Super Administration</span>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-extrabold mt-1">KL Studios Ops</h1>
        </div>
        <button 
          onClick={fetchAdminData}
          className="p-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-full text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* STATS HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Aggregate Revenue", val: `GH¢ ${analytics.total_revenue?.toLocaleString()}`, icon: DollarSign, color: "text-[#D4AF37]" },
          { label: "Orders Placed", val: analytics.total_orders, icon: Briefcase, color: "text-blue-400" },
          { label: "Pending Pipeline", val: analytics.status_distribution?.pending || 0, icon: Clock, color: "text-amber-400" },
          { label: "In-Progress builds", val: analytics.status_distribution?.in_progress || 0, icon: Users, color: "text-purple-400" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">{stat.label}</span>
                <h4 className="text-2xl font-bold text-white mt-1">{stat.val}</h4>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ORDERS & ASSIGNMENTS GRID */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Digital Orders Pipeline</span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-2">Order Ref</th>
                  <th className="py-3 px-2">Service</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Staff</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.order.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                    <td className="py-4 px-2 font-bold text-[#D4AF37]">{o.order.id}</td>
                    <td className="py-4 px-2 font-semibold text-white uppercase tracking-wider">{o.order.service_id}</td>
                    <td className="py-4 px-2 text-gray-300">{o.client_name}</td>
                    <td className="py-4 px-2 text-gray-400">{o.staff_name}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider ${
                        o.order.status === "completed" ? "bg-emerald-400/10 text-emerald-400" :
                        o.order.status === "in_progress" ? "bg-blue-400/10 text-blue-400" : "bg-amber-400/10 text-amber-400"
                      }`}>{o.order.status}</span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button 
                        onClick={() => {
                          setEditingOrder(o);
                          setEditStatus(o.order.status);
                          setEditStaff(o.order.staff_assigned_id ? String(o.order.staff_assigned_id) : "");
                        }}
                        className="p-2 bg-white/5 border border-white/10 hover:border-white/20 rounded text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILS/EDITS DRAWER */}
        <div className="lg:col-span-1 space-y-6">
          {editingOrder ? (
            <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/20 space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Modify Order Status</span>
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Reference ID</span>
                  <strong className="text-white mt-1 block">{editingOrder.order.id}</strong>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block">Set Milestone</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-white text-xs"
                  >
                    <option value="pending">Pending Setup</option>
                    <option value="requirements_received">Requirements Received</option>
                    <option value="planning">Planning & Design</option>
                    <option value="in_progress">In Development</option>
                    <option value="review">Client Review</option>
                    <option value="revision">Revision Phase</option>
                    <option value="completed">Completed & Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block">Assign Staff</label>
                  <select 
                    value={editStaff}
                    onChange={(e) => setEditStaff(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-white text-xs"
                  >
                    <option value="">Unassigned</option>
                    <option value="2">Legacy Designer (Designer)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={() => setEditingOrder(null)}
                    className="flex-grow py-3 border border-white/10 hover:border-white/20 text-xs font-semibold text-white tracking-widest uppercase rounded-full"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateOrder}
                    className="flex-grow py-3 bg-[#D4AF37] hover:bg-[#B5942B] text-[#121212] text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* DISCOUNT COUPONS CRUD PANEL */
            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Discount Campaign Codes</span>
              <div className="space-y-4">
                <div className="space-y-2">
                  {coupons.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5 text-xs">
                      <div>
                        <span className="font-bold text-white tracking-wider">{c.code}</span>
                        <p className="text-[9px] text-gray-500">Discount: {c.percent_discount}%</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 font-bold">Active</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block font-semibold">New Promo Code</label>
                    <input 
                      type="text" 
                      placeholder="KLJULY30" 
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full bg-[#121212] border border-white/10 text-white text-[10px] uppercase focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block font-semibold">Discount Percent</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="100" 
                      value={newCouponPercent}
                      onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-full bg-[#121212] border border-white/10 text-white text-[10px] focus:outline-none"
                    />
                  </div>

                  <button 
                    onClick={handleCreateCoupon}
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#B5942B] text-[#121212] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Register Campaign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUPPORT TICKETS AND AUDIT LOGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-12">
        {/* Support Tickets */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Support Tickets Router</span>
          <div className="space-y-3">
            {tickets.map(t => (
              <div 
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTicket?.id === t.id ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/5 bg-white/[0.01]"
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-white uppercase">{t.subject}</span>
                  <span className="text-[9px] text-[#D4AF37] font-bold uppercase">{t.status}</span>
                </div>
              </div>
            ))}
          </div>

          {activeTicket && (
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 text-xs">
                {activeTicket.messages?.map((m: any, idx: number) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${
                    m.sender === "client" ? "bg-white/[0.01] border-white/5" : "bg-[#D4AF37]/5 border-[#D4AF37]/10"
                  }`}>
                    <span className="text-[8px] text-gray-500 block mb-1">{m.sender_name || m.sender} • {m.time}</span>
                    <p className="text-white">{m.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type reply message..." 
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  className="flex-grow px-4 py-2.5 rounded-full bg-[#121212] border border-white/10 text-white text-xs"
                />
                <button 
                  onClick={handleSendTicketReply}
                  className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#121212] hover:bg-[#B5942B] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audit Logs */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">System Activity Logs</span>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {analytics.activity_logs?.map((log: any) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 text-[10px] flex justify-between items-center">
                <div>
                  <strong className="text-white">{log.user_name || "System"}</strong>: <span className="text-gray-400">{log.action}</span>
                  <p className="text-gray-500 mt-1">{log.details}</p>
                </div>
                <span className="text-gray-600 font-sans">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
