import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KL Studios | Premium Digital Agency & Creative Technology Partner",
  description: "Kalaphol & Legacy Studios delivers world-class custom websites, branding, photography, and AI solutions. Get an instant quote and track your order in real-time.",
  keywords: ["digital agency", "web development Accra", "branding Ghana", "UI/UX design", "AI business automation", "creative photography"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#121212] text-[#F5F5F7] min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-[#121212]">
        
        {/* LUXURY FLOATING HEADER */}
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#AA8B2C] flex items-center justify-center font-serif text-[#121212] font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform duration-300">
                KL
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-sm tracking-widest font-bold text-white group-hover:text-[#D4AF37] transition-colors">KL STUDIOS</span>
                <span className="text-[9px] tracking-wider text-gray-400 font-sans uppercase">Kalaphol & Legacy</span>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-gray-300">
            <a href="/services" className="hover:text-[#D4AF37] transition-colors">Services</a>
            <a href="/portfolio" className="hover:text-[#D4AF37] transition-colors">Portfolio</a>
            <a href="/blog" className="hover:text-[#D4AF37] transition-colors">Blog</a>
            <a href="/about" className="hover:text-[#D4AF37] transition-colors">About</a>
            <a href="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors">
              Client Area
            </a>
            <a 
              href="/order" 
              className="px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B5942B] text-xs font-semibold text-[#121212] tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              Order Now
            </a>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* LUXURY FOOTER */}
        <footer className="bg-[#0A0A0A] border-t border-white/5 py-12 px-6 md:px-12 text-gray-400">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-serif text-[#121212] font-bold text-sm">KL</span>
                <span className="font-serif tracking-widest text-white font-bold">KL STUDIOS</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                Premium digital agency specializing in luxury websites, high-end design, photography, and bespoke AI automations.
              </p>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase text-white font-bold mb-4">Capabilities</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/services" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Branding & Strategy</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Creative Photography</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">AI Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase text-white font-bold mb-4">Agency</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/about" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="/portfolio" className="hover:text-white transition-colors">Selected Projects</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Insights</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase text-white font-bold mb-4">Accra Office</h4>
              <p className="text-xs leading-relaxed">
                Legon East Road, Shiashie<br/>
                Accra, Ghana<br/>
                <span className="text-[#D4AF37]">contact@klstudios.co</span><br/>
                +233 (0) 555 123 456
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px]">
            <p>&copy; {new Date().getFullYear()} KL Studios Ltd. All rights reserved. Kalaphol & Legacy.</p>
            <div className="flex gap-6">
              <a href="/terms" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}

