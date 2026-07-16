"use client";

import React, { useState } from "react";
import { Search, Calendar, User, MessageCircle, ArrowRight } from "lucide-react";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const posts = [
    {
      id: 1,
      title: "Why We Chose Next.js 15 for Luxury Digital Builds",
      category: "technology",
      date: "July 12, 2026",
      author: "Legacy Junior",
      comments: 5,
      desc: "An in-depth look into static route optimization, server functions, and performance metrics that satisfy modern premium brand standards.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "The Golden Ratio: Aesthetics in Creative Videography",
      category: "creative",
      date: "June 28, 2026",
      author: "Kalaphol Senior",
      comments: 3,
      desc: "Balancing color schemes, motion vectors, and dark space to trigger high-end brand alignment in short commercials.",
      img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Vector DBs & Business Automation Workflows",
      category: "business",
      date: "May 15, 2026",
      author: "Legacy Junior",
      comments: 8,
      desc: "How structured database seeding and AI chatbots reduce operational support requirements by up to 75%.",
      img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCat = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Background Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Insight & Strategy</span>
        <h1 className="font-serif text-4xl sm:text-6xl text-white font-extrabold mt-2 mb-6">The Legacy Blog</h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Read articles on code performance, high-end branding typography, vector chatbot integrations, and creative production workflows.
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 border-t border-white/5 pt-12">
        <div className="flex gap-2">
          {["all", "technology", "creative", "business"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                activeCategory === cat 
                  ? "bg-[#D4AF37] text-[#121212]" 
                  : "border border-white/10 hover:border-white/20 text-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search Insights..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-[#0A0A0A]/40 border border-white/10 focus:outline-none focus:border-[#D4AF37] text-xs font-sans tracking-widest text-white uppercase"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article 
            key={post.id}
            className="glass-panel p-6 rounded-3xl hover:border-[#D4AF37]/25 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-6 border border-white/5">
                <img 
                  src={post.img} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {post.author}
                </span>
              </div>

              <h3 className="text-md font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 line-clamp-3">
                {post.desc}
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.comments} Comments
              </span>
              <a href="#" className="text-[#D4AF37] hover:text-white transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px]">
                Read Article <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
