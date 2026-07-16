"use client";

import React from "react";
import { Shield, Sparkles, Cpu, Award, Zap, Users } from "lucide-react";

export default function About() {
  const team = [
    { name: "Kalaphol Senior", role: "Co-Founder & Creative Director", desc: "Crafting beautiful interactive designs for premium international clients.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
    { name: "Legacy Junior", role: "Co-Founder & Chief Engineer", desc: "Leading the systems integration and next-generation code pipelines.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
    { name: "Serena Mensah", role: "Head of Client Relations", desc: "Ensuring customer milestones are met with absolute transparency.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" }
  ];

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Background Glow */}
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      {/* STORY & MISSION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Our Identity</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-extrabold mt-2 mb-6">Kalaphol & Legacy</h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
            KL Studios was founded in Accra on a single guiding principle: that high-end digital design and deep, solid software engineering should never be compromised.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            We provide a transparent, automated workspace where clients collaborate directly with developers, designers, and media engineers. Through online quotation, instant payments, and order tracking, we represent the next phase of client service operations.
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-white/5 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
            alt="Agency Workspace Collaborators" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-60" />
        </div>
      </div>

      {/* CORE VALUES */}
      <section className="mb-24 border-t border-white/5 pt-16">
        <h2 className="font-serif text-3xl text-white font-bold text-center mb-16">Our Core Convictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Absolute Transparency", desc: "No hidden charges, no manual quote wait times. All options are calculated live by our AI price engine." },
            { icon: Sparkles, title: "Luxury Aesthetics", desc: "Every border, gradient, and animation is designed to align with premium world-class design languages." },
            { icon: Cpu, title: "Bespoke Technology", desc: "We deploy Next.js static layouts, secure SQLAlchemy relational models, and fast payment integrations." }
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">{val.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MEET THE TEAM */}
      <section className="border-t border-white/5 pt-16">
        <h2 className="font-serif text-3xl text-white font-bold text-center mb-16">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border border-[#D4AF37]/20">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-md font-bold text-white mb-1 uppercase tracking-wider">{member.name}</h3>
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold mb-4 block">{member.role}</span>
              <p className="text-xs text-gray-400 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
