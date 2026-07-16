"use client";

import React, { useState } from "react";
import { Search, Grid, Eye, CheckCircle2, ArrowRight } from "lucide-react";

export default function Portfolio() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sliderPosition, setSliderPosition] = useState(50);

  const projects = [
    { id: 1, title: "Zener Estate Portal", category: "development", desc: "Interactive real-estate bidding and listing application built using Next.js 15 and Supabase.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", tags: ["Next.js", "PostgreSQL", "Supabase"] },
    { id: 2, title: "Vogue Portrait Series", category: "production", desc: "Luxury studio editorial campaign capturing high-end fashion lines in Accra.", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80", tags: ["Photography", "Studio Lighting", "Color Grading"] },
    { id: 3, title: "NeoBranding Core", category: "creative", desc: "Re-imagining a fintech company's visual language with gold and charcoal guidelines.", img: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80", tags: ["Brand Strategy", "Logo Design", "Stationery"] },
    { id: 4, title: "GCTU Student Finder", category: "development", desc: "Automated student ID finding portal serving thousands of queries.", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80", tags: ["Web App", "API Integration", "Tailwind"] },
    { id: 5, title: "Couture Film Campaign", category: "production", desc: "Cinematic commercial and social videography for high-fashion runway lines.", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", tags: ["Videography", "4K", "Direction"] },
    { id: 6, title: "Prestige Cards Suite", category: "creative", desc: "Minimalist, gold-foiled luxury cards and company profiles.", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80", tags: ["Graphic Design", "Hot Foil Printing"] }
  ];

  const filteredProjects = projects.filter(proj => {
    const matchesFilter = filter === "all" || proj.category === filter;
    const matchesSearch = proj.title.toLowerCase().includes(search.toLowerCase()) || 
                          proj.desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Background Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Exquisite Builds</span>
        <h1 className="font-serif text-4xl sm:text-6xl text-white font-extrabold mt-2 mb-6">Our Selected Works</h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Explore case studies and bespoke assets built by our creative technology house. Filter by capability to find matching builds.
        </p>
      </div>

      {/* BEFORE / AFTER INTERACTIVE SLIDER */}
      <section className="mb-24">
        <h3 className="font-serif text-xl md:text-2xl text-white font-bold mb-6 text-center">Interactive Design Transformation</h3>
        <div className="max-w-4xl mx-auto relative h-[450px] rounded-3xl overflow-hidden border border-white/10 select-none">
          {/* Before Layer (Legacy Layout) */}
          <div className="absolute inset-0 bg-[#2A2A2A] flex flex-col justify-center items-center text-center p-8">
            <span className="text-xs uppercase tracking-wider text-red-400 font-bold mb-2">Legacy Framework (2023)</span>
            <h2 className="font-sans text-3xl text-gray-500 max-w-md">Generic theme templates, slow load speeds, unoptimized client interactions.</h2>
          </div>

          {/* After Layer (Premium KL Studios Layout) - Clipped */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-[#121212] via-[#0A0A0A] to-[#251A08] flex flex-col justify-center items-center text-center p-8 overflow-hidden transition-all duration-75"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <div className="w-full h-full flex flex-col justify-center items-center">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2">KL Studios Re-build (2026)</span>
              <h2 className="font-serif text-3xl sm:text-5xl text-white max-w-md font-bold">
                Luxury <span className="text-gold-gradient italic font-normal">Next.js 15</span> experience, instant price quote, automated payment, and live dashboard.
              </h2>
            </div>
          </div>

          {/* Slider Control Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-[#D4AF37] cursor-ew-resize z-20 flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-[#121212] border border-[#D4AF37] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]">
              ↔
            </div>
          </div>

          {/* Invisible slider input for interaction */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderPosition} 
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
          />
        </div>
      </section>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 border-t border-white/5 pt-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {["all", "development", "creative", "production"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                filter === cat 
                  ? "bg-[#D4AF37] text-[#121212]" 
                  : "border border-white/10 hover:border-white/20 text-gray-400"
              }`}
            >
              {cat === "all" ? "All Projects" : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search Case Studies..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-[#0A0A0A]/40 border border-white/10 focus:outline-none focus:border-[#D4AF37] text-xs font-sans tracking-widest text-white uppercase"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProjects.map((proj) => (
          <div 
            key={proj.id}
            className="glass-panel p-6 rounded-3xl hover:border-[#D4AF37]/25 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-6 border border-white/5">
                <img 
                  src={proj.img} 
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#121212]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#121212] flex items-center justify-center shadow-lg">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                {proj.tags.map((t, idx) => (
                  <span key={idx} className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-gray-300">
                    {t}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">{proj.desc}</p>
            </div>
            
            <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
              <span className="text-gray-500 uppercase tracking-widest text-[9px]">{proj.category}</span>
              <a href={`/order?service=${proj.category === "development" ? "website" : "design"}`} className="text-[#D4AF37] hover:text-white transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider">
                Order Similar <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
