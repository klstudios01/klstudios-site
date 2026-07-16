"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Background Glow */}
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Get Connected</span>
        <h1 className="font-serif text-4xl sm:text-6xl text-white font-extrabold mt-2 mb-6">Initiate Inquiry</h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Reach out to Kalaphol & Legacy Studios. Our staff is ready to address bespoke software development and visual production inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-white font-bold mb-6">Studio Coordinates</h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              We operate a physical studio showroom in Accra for client project briefings, photography, and video post-production reviews.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Office Location</h4>
                <p className="text-xs text-gray-400">Legon East Road, Shiashie, Accra, Ghana</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Digital Correspondence</h4>
                <p className="text-xs text-[#D4AF37]">contact@klstudios.co</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Direct Calling</h4>
                <p className="text-xs text-gray-400">+233 (0) 555 123 456 / +233 (0) 505 987 654</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Studio Hours</h4>
                <p className="text-xs text-gray-400">Monday - Friday: 08:00 - 18:00 GMT<br/>Saturday: 10:00 - 15:00 GMT (By Appointment)</p>
              </div>
            </div>
          </div>

          {/* MOCK MAP CONTAINER */}
          <div className="h-60 rounded-3xl overflow-hidden border border-white/5 relative bg-[#0A0A0A] flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')" }} />
            <div className="glass-panel p-4 rounded-xl text-center z-10 border border-white/10">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">Shiashie, Accra</span>
              <p className="text-[10px] text-white font-sans font-bold uppercase tracking-wider mt-1">KL Studios Showroom Map</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5">
          <h3 className="font-serif text-xl md:text-2xl text-white font-bold mb-6">Send A Message</h3>
          
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
              <CheckCircle className="w-12 h-12 text-[#D4AF37] animate-bounce" />
              <h4 className="text-md font-bold text-white uppercase tracking-widest">Message Dispatched</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                Thank you. A KL Studios partner will email or call you back within the next 2-4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block font-semibold">Your Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="JOHN DOE"
                  className="w-full px-6 py-4 rounded-full bg-[#121212] border border-white/10 text-white text-xs font-sans tracking-widest uppercase focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block font-semibold">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="JOHN@EXAMPLE.COM"
                  className="w-full px-6 py-4 rounded-full bg-[#121212] border border-white/10 text-white text-xs font-sans tracking-widest uppercase focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block font-semibold">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="WEBSITE DEVELOPMENT INQUIRY"
                  className="w-full px-6 py-4 rounded-full bg-[#121212] border border-white/10 text-white text-xs font-sans tracking-widest uppercase focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block font-semibold">Message Detail</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="PROVIDE DETAILS ABOUT YOUR PROJECT ESTIMATIONS..."
                  className="w-full px-6 py-4 rounded-3xl bg-[#121212] border border-white/10 text-white text-xs font-sans tracking-widest uppercase focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-full bg-[#D4AF37] hover:bg-[#B5942B] text-[#121212] text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Send Message <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
