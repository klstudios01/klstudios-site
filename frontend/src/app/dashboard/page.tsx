"use client";

import React, { useState, useEffect } from "react";
import { 
  Briefcase, CheckCircle2, Clock, FileText, Upload, Download, 
  MessageSquare, User, CreditCard, Send, Settings, AlertTriangle, AlertCircle, Loader2, Check
} from "lucide-react";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Payment Modal Simulator
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Tickets
  const [tickets, setTickets] = useState<any[]>([]);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMsg, setNewTicketMsg] = useState("");
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [ticketReply, setTicketReply] = useState("");

  // Revisions
  const [revisionText, setRevisionText] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const fetchClientData = () => {
    const token = localStorage.getItem("token") || "mock-token";
    
    // Fetch orders
    fetch(`http://localhost:8000/api/orders/client?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
          if (data.length > 0 && !selectedOrder) setSelectedOrder(data[0]);
        }
      })
      .catch(() => {
        // Fallback local mock state for previewing the dashboard immediately
        const mockOrders = [
          {
            id: "ORD-26071610-1",
            service_id: "website",
            subtotal: 2800,
            discount: 0,
            tax: 140,
            total: 2940,
            paid_amount: 1470,
            balance: 1470,
            payment_status: "deposit_paid",
            options_selected: { website_type: "corporate", pages: "6-10", design_style: "luxury" },
            timeline: "14 DAYS",
            status: "in_progress",
            created_at: "2026-07-16T12:00:00Z"
          },
          {
            id: "ORD-26071610-2",
            service_id: "design",
            subtotal: 420,
            discount: 84,
            tax: 16.8,
            total: 352.8,
            paid_amount: 0,
            balance: 352.8,
            payment_status: "pending",
            options_selected: { design_type: "company_profile", quantity: 1, revisions: 3 },
            timeline: "STANDARD",
            status: "pending",
            created_at: "2026-07-16T14:30:00Z"
          }
        ];
        setOrders(mockOrders);
        if (!selectedOrder) setSelectedOrder(mockOrders[0]);
      });

    // Fetch Tickets
    fetch(`http://localhost:8000/api/tickets?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTickets(data);
      })
      .catch(() => {
        const mockTickets = [
          {
            id: 1,
            subject: "Hosting Server Credentials Query",
            status: "resolved",
            messages: [
              { sender: "client", sender_name: "John Doe", text: "Where do we host the website?", time: "2026-07-16 13:00" },
              { sender: "support", sender_name: "Legacy Support", text: "We set up Amazon AWS EC2 or standard Hostinger server based on options selected.", time: "2026-07-16 13:30" }
            ]
          }
        ];
        setTickets(mockTickets);
      });
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  // Simulator for Paystack
  const handleVerifyPayment = async () => {
    setIsPaying(true);
    const token = localStorage.getItem("token") || "mock-token";
    
    try {
      await fetch(`http://localhost:8000/api/payments/pay?order_id=${selectedOrder.id}&amount=${payAmount}&method=card&token=${token}`, {
        method: "POST"
      });
      setIsPaying(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPayModal(false);
        setPaymentSuccess(false);
        fetchClientData();
      }, 2000);
    } catch {
      // Offline mock fallback
      setIsPaying(false);
      setPaymentSuccess(true);
      
      // Update selected order in local state
      const updated = { ...selectedOrder };
      updated.paid_amount += payAmount;
      updated.balance = Math.max(0, updated.total - updated.paid_amount);
      if (updated.paid_amount >= updated.total) {
        updated.payment_status = "fully_paid";
      } else if (updated.paid_amount >= (updated.total * 0.5)) {
        updated.payment_status = "deposit_paid";
        if (updated.status === "pending") updated.status = "requirements_received";
      }
      
      setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
      setSelectedOrder(updated);

      setTimeout(() => {
        setShowPayModal(false);
        setPaymentSuccess(false);
      }, 2000);
    }
  };

  // Support ticket messaging
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "mock-token";
    const payload = {
      order_id: selectedOrder?.id || null,
      subject: newTicketSubject,
      message: newTicketMsg
    };

    try {
      await fetch(`http://localhost:8000/api/tickets?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setNewTicketSubject("");
      setNewTicketMsg("");
      fetchClientData();
    } catch {
      const mockNew = {
        id: tickets.length + 1,
        subject: newTicketSubject,
        status: "open",
        messages: [{ sender: "client", text: newTicketMsg, time: "Just now" }]
      };
      setTickets([...tickets, mockNew]);
      setNewTicketSubject("");
      setNewTicketMsg("");
    }
  };

  const handleSendReply = async () => {
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
      fetchClientData();
      setActiveTicket(data);
    } catch {
      const updatedMessages = [...activeTicket.messages, { sender: "client", text: ticketReply, time: "Just now" }];
      const updatedTicket = { ...activeTicket, messages: updatedMessages };
      setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
      setActiveTicket(updatedTicket);
      setTicketReply("");
    }
  };

  const handleRequestRevision = () => {
    if (!revisionText) return;
    // Local mock submission for visual review
    alert(`Revision submitted: "${revisionText}"`);
    setShowRevisionModal(false);
    setRevisionText("");
  };

  const statuses = [
    { id: "pending", label: "Pending Setup" },
    { id: "requirements_received", label: "Requirements OK" },
    { id: "planning", label: "Planning UI" },
    { id: "in_progress", label: "In Progress" },
    { id: "review", label: "Client Review" },
    { id: "revision", label: "Refinements" },
    { id: "completed", label: "Asset Completed" }
  ];

  const getStatusIndex = (current: string) => {
    return statuses.findIndex(s => s.id === current);
  };

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* SIDEBAR TABS */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center font-serif text-[#121212] font-bold">
              JD
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">John Doe</h3>
              <span className="text-[9px] text-[#D4AF37] tracking-widest uppercase">Verified Client</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            {[
              { id: "orders", label: "Active Orders", icon: Briefcase },
              { id: "tickets", label: "Support Tickets", icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-3 ${
                    activeTab === tab.id 
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <div className="lg:col-span-3 space-y-8">
        
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Orders List Panel */}
            <div className="md:col-span-1 glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Inquired Builds</span>
              <div className="space-y-3">
                {orders.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`w-full p-4 rounded-2xl border text-left space-y-2 transition-all ${
                      selectedOrder?.id === o.id 
                        ? "border-[#D4AF37] bg-[#D4AF37]/5" 
                        : "border-white/5 bg-white/[0.01] hover:border-white/15"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-gray-500">{o.id}</span>
                      <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                        o.payment_status === "fully_paid" ? "bg-emerald-400/10 text-emerald-400" :
                        o.payment_status === "deposit_paid" ? "bg-amber-400/10 text-amber-400" : "bg-red-400/10 text-red-400"
                      }`}>{o.payment_status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{o.service_id} Builder</h4>
                    <p className="text-[10px] text-gray-400">Total: GH¢ {o.total.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Order Detail Panel */}
            {selectedOrder ? (
              <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
                
                {/* ID & Title */}
                <div className="flex justify-between items-start border-b border-white/5 pb-6">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-bold uppercase">{selectedOrder.service_id} Workspace</h3>
                    <span className="text-[9px] tracking-widest text-gray-500 uppercase block mt-1">Order Ref: {selectedOrder.id}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {selectedOrder.payment_status !== "fully_paid" && (
                      <button 
                        onClick={() => {
                          setPayAmount(selectedOrder.payment_status === "pending" ? selectedOrder.total * 0.5 : selectedOrder.balance);
                          setShowPayModal(true);
                        }}
                        className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B5942B] text-[10px] font-bold uppercase text-[#121212] tracking-widest rounded-full transition-all flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Pay Now
                      </button>
                    )}
                    <button 
                      onClick={() => setShowRevisionModal(true)}
                      className="px-4 py-2 border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase text-white tracking-widest rounded-full transition-colors"
                    >
                      Request Revision
                    </button>
                  </div>
                </div>

                {/* REAL-TIME PIPELINE PROGRESS */}
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Development Pipeline Track</span>
                  <div className="relative pt-6">
                    {/* Pipeline track bar */}
                    <div className="absolute top-8 left-4 right-4 h-1 bg-white/5 -z-10" />
                    <div 
                      className="absolute top-8 left-4 h-1 bg-[#D4AF37] -z-10 transition-all duration-500" 
                      style={{ width: `${(getStatusIndex(selectedOrder.status) / (statuses.length - 1)) * 100}%` }}
                    />
                    
                    <div className="flex justify-between items-center">
                      {statuses.map((s, idx) => {
                        const active = idx <= getStatusIndex(selectedOrder.status);
                        const isCurrent = s.id === selectedOrder.status;
                        return (
                          <div key={s.id} className="flex flex-col items-center text-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold ${
                              isCurrent ? "border-[#D4AF37] bg-[#121212] text-[#D4AF37]" :
                              active ? "border-[#D4AF37] bg-[#D4AF37] text-[#121212]" : "border-white/10 bg-[#121212] text-gray-500"
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[8px] uppercase tracking-wider mt-2 font-bold ${
                              isCurrent ? "text-[#D4AF37]" : active ? "text-white" : "text-gray-600"
                            }`}>
                              {s.label.split(" ")[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* FINANCIAL STATUS DETAILS */}
                <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest">Total Invoice</span>
                    <h4 className="text-md font-serif font-bold text-white mt-1">GH¢ {selectedOrder.total.toLocaleString()}</h4>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest">Amount Cleared</span>
                    <h4 className="text-md font-serif font-bold text-emerald-400 mt-1">GH¢ {selectedOrder.paid_amount.toLocaleString()}</h4>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest">Remaining Balance</span>
                    <h4 className="text-md font-serif font-bold text-red-400 mt-1">GH¢ {selectedOrder.balance.toLocaleString()}</h4>
                  </div>
                </div>

                {/* DOWNLOAD ARTIFACT DOCUMENTS */}
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Generated Deliverables & Documents</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: "Legal Service Agreement", type: "Contract", code: "contract" },
                      { name: "Milestone Deposit Invoice", type: "Invoice", code: "invoice" },
                      { name: "Print-ready Official Quote", type: "Quotation", code: "quotation" }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">{doc.type}</span>
                          <h4 className="text-xs text-white mt-1 font-semibold">{doc.name}</h4>
                        </div>
                        <button 
                          onClick={() => {
                            window.open(`http://localhost:8000/api/pdf/${doc.code}/${selectedOrder.id}?token=mock-token`, "_blank");
                          }}
                          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="md:col-span-2 glass-panel p-12 text-center text-gray-500">
                No orders discovered. Initiate a builder quote to start.
              </div>
            )}
          </div>
        )}

        {/* SUPPORT TICKETS PANEL */}
        {activeTab === "tickets" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tickets Grid list */}
            <div className="md:col-span-1 glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Support Threads</span>
              <div className="space-y-3">
                {tickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      activeTicket?.id === t.id ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/5 bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-bold bg-white/5 text-gray-300">{t.status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2 truncate">{t.subject}</h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Support Dialog Box */}
            <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[450px]">
              {activeTicket ? (
                <div className="space-y-6 flex-grow flex flex-col justify-between">
                  {/* Thread messages */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {activeTicket.messages?.map((m: any, idx: number) => {
                      const isClient = m.sender === "client";
                      return (
                        <div key={idx} className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}>
                          <span className="text-[8px] text-gray-500 mb-1">{m.sender_name || (isClient ? "John Doe" : "KL Staff")} • {m.time}</span>
                          <div className={`p-3.5 rounded-2xl max-w-xs text-xs ${
                            isClient ? "bg-[#D4AF37]/10 text-white rounded-tr-none border border-[#D4AF37]/10" : "bg-white/5 text-gray-200 rounded-tl-none border border-white/5"
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Send Reply */}
                  <div className="flex gap-2 border-t border-white/5 pt-4">
                    <input 
                      type="text" 
                      placeholder="Type reply message..." 
                      value={ticketReply}
                      onChange={(e) => setTicketReply(e.target.value)}
                      className="flex-grow px-4 py-3 rounded-full bg-[#121212] border border-white/10 text-white text-xs"
                    />
                    <button 
                      onClick={handleSendReply}
                      className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#121212] hover:bg-[#B5942B] transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Ticket creation form */
                <form onSubmit={handleCreateTicket} className="space-y-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Open New Support Ticket</span>
                  
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block">Subject</label>
                    <input 
                      type="text" 
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      placeholder="E.G. HOSTING SERVER ACCESSIBILITY QUERY"
                      className="w-full px-6 py-4 rounded-full bg-[#121212] border border-white/10 text-white text-xs font-sans tracking-widest uppercase focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block">Message Detail</label>
                    <textarea 
                      rows={5}
                      value={newTicketMsg}
                      onChange={(e) => setNewTicketMsg(e.target.value)}
                      placeholder="PROVIDE SYSTEM LOGS OR QUESTION PARTICULARS..."
                      className="w-full px-6 py-4 rounded-3xl bg-[#121212] border border-white/10 text-white text-xs focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#D4AF37] hover:bg-[#B5942B] text-[#121212] text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Open Ticket
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

      </div>

      {/* --- MOCK PAYSTACK GATEWAY POPUP SIMULATOR --- */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-3xl border border-[#D4AF37]/30 max-w-sm w-full text-center space-y-6 animate-scaleIn">
            <div className="flex justify-center mb-2">
              <span className="px-3 py-1 rounded bg-teal-400/10 text-teal-400 text-[9px] font-bold uppercase tracking-widest">
                Paystack Gateway Simulator
              </span>
            </div>
            
            <h3 className="font-serif text-xl text-white font-bold">Authorize Billing</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Accepting payment of <strong className="text-[#D4AF37]">GH¢ {payAmount.toLocaleString()}</strong> for Order {selectedOrder?.id} on behalf of KL Studios.
            </p>

            <div className="space-y-3">
              <button 
                onClick={handleVerifyPayment}
                disabled={isPaying}
                className="w-full py-4 rounded-full bg-[#D4AF37] hover:bg-[#B5942B] text-[#121212] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                {isPaying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Simulate Payment Completion <Check className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <button 
                onClick={() => setShowPayModal(false)}
                className="w-full py-3 text-xs text-gray-500 uppercase tracking-widest hover:text-white"
              >
                Cancel transaction
              </button>
            </div>

            {paymentSuccess && (
              <div className="bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-xl p-3 text-[10px] font-bold">
                ✔ TRANSACTION CLEARED AND RECORDED SUCCESSFUL
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MOCK REVISION REQUEST POPUP --- */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-md w-full space-y-6 animate-scaleIn">
            <h3 className="font-serif text-xl text-white font-bold">Request Asset Revision</h3>
            
            <div>
              <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block">Revision Instructions</label>
              <textarea 
                rows={4}
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                placeholder="PROVIDE FEEDBACK ON THE CURRENT DEPLOYED DRAFT (E.G. MODIFY FONTS, LOGO SCALING)..."
                className="w-full p-4 rounded-2xl bg-[#121212] border border-white/10 text-white text-xs focus:outline-none resize-none uppercase font-sans tracking-widest"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowRevisionModal(false)}
                className="flex-grow py-3 border border-white/10 hover:border-white/20 text-xs font-semibold text-white tracking-widest uppercase rounded-full"
              >
                Cancel
              </button>
              <button 
                onClick={handleRequestRevision}
                className="flex-grow py-3 bg-[#D4AF37] hover:bg-[#B5942B] text-[#121212] text-xs font-bold uppercase tracking-widest rounded-full"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
