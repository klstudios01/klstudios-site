"use client";

import React from "react";
import { 
  Code, Paintbrush, Camera, Video, Printer, Bot, Globe, Shield, 
  Layers, Settings, ChevronRight, Zap, CheckCircle2 
} from "lucide-react";

export default function Services() {
  const serviceDetails = [
    {
      id: "website",
      name: "Website Development",
      category: "Development",
      icon: Code,
      basePrice: "GH¢ 1,500",
      desc: "Stunning, high-performance web applications and corporate websites built using React, Next.js, and Tailwind CSS. Fully responsive and conversion-optimized.",
      features: ["Custom UI Architecture", "Next.js Static & Server Generation", "Fully Integrated CMS", "Complete SEO Engineering"]
    },
    {
      id: "branding",
      name: "Brand Identity & Strategy",
      category: "Creative Services",
      icon: Paintbrush,
      basePrice: "GH¢ 500",
      desc: "Complete visual positioning to differentiate your brand. We design logos, business stationery, brand style guides, packaging, and digital assets.",
      features: ["Bespoke Logo Suites", "Brand Guideline Documents", "Vehicle & Uniform Concepts", "Social Media Asset Bundles"]
    },
    {
      id: "photography",
      name: "Professional Photography",
      category: "Visual Production",
      icon: Camera,
      basePrice: "GH¢ 400",
      desc: "High-end product photography, fashion shoots, corporate events, and drone coverage. High-fidelity visual editing and same-day delivery options available.",
      features: ["High-Resolution Studio Shoots", "Bespoke Drone Capture", "Advanced Color Balancing", "Print-Ready Album Assets"]
    },
    {
      id: "videography",
      name: "Professional Videography",
      category: "Visual Production",
      icon: Video,
      basePrice: "GH¢ 1,000",
      desc: "Cinematic commercial advertisements, brand documentaries, event coverage, and motion graphics design. Delivered in crystal-clear 4K resolution.",
      features: ["Multi-Camera Operations", "Professional Audio Setup", "Advanced Color Grading", "Subtitles & Sound Design"]
    },
    {
      id: "ai_solutions",
      name: "Bespoke AI Solutions",
      category: "Development",
      icon: Bot,
      basePrice: "GH¢ 3,000",
      desc: "Integrate intelligence into your operations. We build customized generative AI chatbots, intelligent search indexes, and automatic data workflows.",
      features: ["Custom ChatGPT Automations", "Intelligent Vector Searching", "Automatic Data Pipelines", "LLM API Integrations"]
    },
    {
      id: "printing",
      name: "Luxury Printing Services",
      category: "Visual Production",
      icon: Printer,
      basePrice: "GH¢ 50",
      desc: "High-grade physical print production for flyers, menus, corporate books, billboards, and company cards with gloss, matte, and lamination finishing options.",
      features: ["Premium Paper Selections", "Gloss & Matte Laminations", "Professional Binding", "Rapid Turnaround Delivery"]
    }
  ];

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Bespoke Suite</span>
        <h1 className="font-serif text-4xl sm:text-6xl text-white font-extrabold mt-2 mb-6">Our Capabilities</h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Explore our range of professional digital services. Configure options, review instant quotes, and order directly online.
        </p>
      </div>

      {/* SERVICES LIST */}
      <div className="space-y-16">
        {serviceDetails.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div 
              key={srv.id}
              className={`flex flex-col md:flex-row gap-12 items-center border-b border-white/5 pb-16 last:border-0 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Text Area */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
                  <Icon className="w-4 h-4" />
                  {srv.category}
                </div>
                
                <h2 className="font-serif text-2xl md:text-4xl text-white font-bold">{srv.name}</h2>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{srv.desc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {srv.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="text-xs text-gray-400">
                    Baseline Cost<br/>
                    <strong className="text-xl text-white font-serif">{srv.basePrice}</strong>
                  </div>
                  <a 
                    href={`/order?service=${srv.id}`}
                    className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B5942B] text-xs font-semibold text-[#121212] tracking-widest uppercase transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  >
                    Configure Order <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Graphic/Image Area */}
              <div className="flex-1 w-full relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-white/5 group">
                <img 
                  src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80`} 
                  alt={srv.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#121212] to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-gray-300">Milestone Tracked</span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold">100% Quality Guaranteed</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
