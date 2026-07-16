"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, Sparkles, Camera, Video, Layers, Printer, TrendingUp, Bot, 
  Paintbrush, ArrowRight, ChevronDown, Check, Star, Shield, Cpu, RefreshCw
} from "lucide-react";

export default function Home() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const services = [
    { id: "website", name: "Web Development", icon: Code, price: "GH¢ 1,500+", desc: "Premium custom websites and e-commerce architectures." },
    { id: "branding", name: "Brand Identity", icon: Paintbrush, price: "GH¢ 500+", desc: "Corporate stationery, logos, and high-end visual kits." },
    { id: "photography", name: "Creative Photography", icon: Camera, price: "GH¢ 400+", desc: "Studio, products, corporate, and event visual capture." },
    { id: "videography", name: "Videography & 4K", icon: Video, price: "GH¢ 1,000+", desc: "Advertisements, documentaries, and high-fidelity video." },
    { id: "ai_solutions", name: "Bespoke AI Solutions", icon: Bot, price: "GH¢ 3,000+", desc: "Automated chatbots, intelligent database layers." },
    { id: "printing", name: "Printing Services", icon: Printer, price: "GH¢ 50+", desc: "Exquisite flyer, banner, and document production." }
  ];

  const recentProjects = [
    { title: "Zener Estate Portal", category: "Web Design & Systems", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
    { title: "Vogue Studio Series", category: "Photography", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80" },
    { title: "NeoBranding Launch", category: "Visual Strategy", img: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80" }
  ];

  const faqs = [
    { q: "How does the live ordering and quotation system work?", a: "Simply click 'Order Now', choose your specific service, and go through the customization steps. The AI Pricing Engine calculates your quote instantly. You can pay a 50% deposit via Paystack or Mobile Money, and track development milestones live in your client dashboard." },
    { q: "What is your typical turnaround time?", a: "Depending on your selection, we offer standard 30-day timelines as well as express delivery (down to 24-48 hours for urgent digital assets) backed by our dedicated rapid-response design team." },
    { q: "Can I request revisions directly on the platform?", a: "Yes. Once draft versions are uploaded to your dashboard, you can click 'Request Revision', type your changes, and upload references. Our staff will be notified and address the updates immediately." }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[60vh] right-1/4 w-[400px] h-[400px] rounded-full bg-[#AA8B2C]/5 blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative px-6 md:px-12 pt-24 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 mb-8 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The Creative Technology House
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-8xl leading-none text-white max-w-5xl mb-8 tracking-tight font-extrabold"
        >
          We Build <span className="text-gold-gradient font-normal italic">Luxury Digital</span> Experiences.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-12"
        >
          At KL Studios, we unite premium engineering with award-winning design. Configure your custom product, get real-time automated pricing, pay deposits online, and collaborate directly with our creative team.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a 
            href="/order" 
            className="px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#B5942B] text-sm font-semibold text-[#121212] tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-3"
          >
            Launch Builder <ArrowRight className="w-4 h-4" />
          </a>
          <a 
            href="/services" 
            className="px-8 py-4 rounded-full border border-white/10 hover:border-white/20 text-sm font-semibold text-white tracking-widest uppercase transition-colors"
          >
            Explore Services
          </a>
        </motion.div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Bespoke Offerings</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold mt-2">Bespoke Creative Capabilities</h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm mt-4 md:mt-0">
            From Next.js platforms to cinematic visual branding campaigns, every detail is engineered with absolute pixel perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div 
                key={srv.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-3xl hover:border-[#D4AF37]/30 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{srv.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-6">{srv.desc}</p>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="text-xs text-gray-500">Starts from <strong className="text-[#D4AF37] font-semibold">{srv.price}</strong></span>
                  <a href={`/order?service=${srv.id}`} className="text-xs font-semibold tracking-wider text-white hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 uppercase">
                    Order <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE US & PROCESS */}
      <section className="px-6 md:px-12 py-20 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">How We Work</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold mt-2 mb-8">From Concept to Interactive Deployment</h2>
            
            <div className="space-y-8">
              {[
                { step: "01", title: "Automated Customization", desc: "Select options, page counts, delivery timelines, and special features in seconds." },
                { step: "02", title: "Deposit & Onboarding", desc: "Verify details, pay a 50% deposit via Paystack secure billing, and sign digital contracts." },
                { step: "03", title: "Interactive Development", desc: "Track progress bar milestones inside your personal client panel in real-time." },
                { step: "04", title: "Revision & Final Output", desc: "Request edits, verify quality standards, download files, and launch your project." }
              ].map((proc) => (
                <div key={proc.step} className="flex gap-6">
                  <span className="font-serif text-2xl font-bold text-[#D4AF37]">{proc.step}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{proc.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{proc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 aspect-[4/3] group">
            <img 
              src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80" 
              alt="Interactive UI Workspace"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-80" />
            <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">Premium Standards</span>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mt-1">99.8% Client Satisfaction</h4>
              </div>
              <Shield className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO HIGHLIGHTS */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Selected Artifacts</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold mt-2">Bespoke Case Studies</h2>
          </div>
          <a href="/portfolio" className="text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors flex items-center gap-2 font-bold">
            View All Projects <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentProjects.map((proj, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-3xl overflow-hidden mb-6 aspect-[4/3] border border-white/5">
                <img 
                  src={proj.img} 
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">{proj.category}</span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-[#D4AF37] transition-colors">{proj.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#AA8B2C]/5 border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "14+", label: "Creative Services" },
            { value: "250+", label: "Digital Builds" },
            { value: "100%", label: "Online Transparency" },
            { value: "24h", label: "Fastest Turnaround" }
          ].map((stat, idx) => (
            <div key={idx}>
              <h4 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">{stat.value}</h4>
              <p className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-white font-bold text-center mb-12">Frequently Answered Queries</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-white/5 rounded-2xl bg-[#0A0A0A]/40 overflow-hidden"
            >
              <button 
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-bold text-white uppercase tracking-wider">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${activeFAQ === idx ? "rotate-180" : ""}`} />
              </button>
              {activeFAQ === idx && (
                <div className="p-6 pt-0 border-t border-white/5 text-xs text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto text-center border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-3xl blur-3xl pointer-events-none" />
        <div className="glass-panel p-12 md:p-20 rounded-3xl relative border border-[#D4AF37]/10">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-4 block">Bespoke Updates</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold mb-6">Stay Guided with Creative Insights</h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed mb-10">
            Subscribe to receives insights, new tech templates updates, and exclusive project discount campaigns.
          </p>
          
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="flex-grow px-6 py-4 rounded-full bg-[#121212] border border-white/10 text-white text-xs font-sans tracking-widest uppercase focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
            <button 
              type="submit" 
              className="px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#B5942B] text-[#121212] text-xs font-semibold uppercase tracking-widest transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
