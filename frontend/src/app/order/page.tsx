"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, ArrowRight, ArrowLeft, Upload, FileText, Download, 
  CreditCard, Loader2, Sparkles, AlertCircle, ShoppingBag, ShieldCheck
} from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderWizard() {
  const [service, setService] = useState("website");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<any>(null);
  
  // Promocodes
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- SELECTION STATES ---
  // Website
  const [webType, setWebType] = useState("business");
  const [webPages, setWebPages] = useState("1-5");
  const [webStyle, setWebStyle] = useState("minimal");
  const [webFeatures, setWebFeatures] = useState<string[]>([]);
  const [webMissingAssets, setWebMissingAssets] = useState<string[]>([]);
  const [webDelivery, setWebDelivery] = useState("30_days");
  const [webMaintenance, setWebMaintenance] = useState("none");

  // Design
  const [designType, setDesignType] = useState("logo");
  const [designQty, setDesignQty] = useState(1);
  const [designRevisions, setDesignRevisions] = useState(3);
  const [designSourceFiles, setDesignSourceFiles] = useState(false);
  const [designPremiumFonts, setDesignPremiumFonts] = useState(false);
  const [designStockImages, setDesignStockImages] = useState(false);
  const [designCopywriting, setDesignCopywriting] = useState(false);
  const [designPrinting, setDesignPrinting] = useState(false);
  const [designExpress, setDesignExpress] = useState(false);

  // Photography
  const [photoType, setPhotoType] = useState("studio_shoot");
  const [photoHours, setPhotoHours] = useState(2);
  const [photoPhotographers, setPhotoPhotographers] = useState(1);
  const [photoDrone, setPhotoDrone] = useState(false);
  const [photoAlbums, setPhotoAlbums] = useState(0);
  const [photoFrames, setPhotoFrames] = useState(0);
  const [photoLive, setPhotoLive] = useState(false);
  const [photoSameDay, setPhotoSameDay] = useState(false);
  const [photoTravel, setPhotoTravel] = useState(0);
  const [photoCount, setPhotoCount] = useState(50);
  const [photoExpress, setPhotoExpress] = useState(false);

  // Videography
  const [videoHours, setVideoHours] = useState(2);
  const [videoOps, setVideoOps] = useState(1);
  const [videoDrone, setVideoDrone] = useState(false);
  const [video4k, setVideo4k] = useState(false);
  const [videoHighlight, setVideoHighlight] = useState(false);
  const [videoDoc, setVideoDoc] = useState(false);
  const [videoMotion, setVideoMotion] = useState(false);
  const [videoVoice, setVideoVoice] = useState(false);
  const [videoSubtitles, setVideoSubtitles] = useState(false);
  const [videoExpress, setVideoExpress] = useState(false);

  // Printing
  const [printQty, setPrintQty] = useState(100);
  const [printMaterial, setPrintMaterial] = useState("standard_paper");
  const [printSize, setPrintSize] = useState("A4");
  const [printType, setPrintType] = useState("150gsm");
  const [printFinish, setPrintFinish] = useState("matte");
  const [printLamination, setPrintLamination] = useState(false);
  const [printBinding, setPrintBinding] = useState("none");
  const [printDelivery, setPrintDelivery] = useState(false);

  // Branding
  const [brandingDeliverables, setBrandingDeliverables] = useState<string[]>([]);

  // Real-time Pricing Cache
  const [pricing, setPricing] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    deposit: 0,
    balance: 0
  });

  // Calculate pricing based on currently selected values
  const calculateLivePrice = () => {
    // CollectSelections based on service type
    let selections: any = {};
    if (service === "website") {
      selections = {
        website_type: webType,
        pages: webPages,
        design_style: webStyle,
        features: webFeatures,
        missing_assets: webMissingAssets,
        delivery_time: webDelivery,
        maintenance: webMaintenance
      };
    } else if (service === "design") {
      selections = {
        design_type: designType,
        quantity: designQty,
        revisions: designRevisions,
        source_files: designSourceFiles,
        premium_fonts: designPremiumFonts,
        stock_images: designStockImages,
        copywriting: designCopywriting,
        printing: designPrinting,
        express_delivery: designExpress
      };
    } else if (service === "photography") {
      selections = {
        photo_type: photoType,
        hours: photoHours,
        photographers: photoPhotographers,
        drone: photoDrone,
        albums: photoAlbums,
        frames: photoFrames,
        live_coverage: photoLive,
        same_day_editing: photoSameDay,
        travel_distance: photoTravel,
        photos_count: photoCount,
        express_delivery: photoExpress
      };
    } else if (service === "videography") {
      selections = {
        hours: videoHours,
        camera_operators: videoOps,
        drone: videoDrone,
        resolutions_4k: video4k,
        highlight_video: videoHighlight,
        documentary: videoDoc,
        motion_graphics: videoMotion,
        voice_over: videoVoice,
        subtitles: videoSubtitles,
        express_editing: videoExpress
      };
    } else if (service === "printing") {
      selections = {
        quantity: printQty,
        material: printMaterial,
        paper_size: printSize,
        paper_type: printType,
        finish: printFinish,
        lamination: printLamination,
        binding: printBinding,
        delivery: printDelivery
      };
    } else if (service === "branding") {
      selections = {
        deliverables: brandingDeliverables
      };
    }

    // Call backend API or perform fallback direct calculation
    fetch(`http://localhost:8000/api/services/calculate-price?service_id=${service}${promoCode && promoApplied ? `&discount_code=${promoCode}` : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selections)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.total !== undefined) {
          setPricing({
            subtotal: data.subtotal,
            discount: data.discount || 0,
            tax: data.tax,
            total: data.total,
            deposit: data.deposit,
            balance: data.balance
          });
        }
      })
      .catch(() => {
        // Fallback local calculations
        let base = 500;
        let featuresCost = 0;
        let multiplier = 1.0;

        if (service === "website") {
          const types: any = { business: 1500, corporate: 2500, ecommerce: 3500, real_estate: 2800, booking: 2200, marketplace: 4500, landing_page: 600 };
          base = types[webType] || 1500;
          
          const pagesMap: any = { "1-5": 0, "6-10": 300, "11-20": 700, "20+": 1500 };
          featuresCost += pagesMap[webPages] || 0;

          const stylesMap: any = { minimal: 1.0, luxury: 1.3, corporate: 1.1, creative: 1.2 };
          multiplier = stylesMap[webStyle] || 1.0;

          featuresCost += webFeatures.length * 300;
          featuresCost += webMissingAssets.length * 200;

          const timelineMap: any = { "30_days": 1.0, "14_days": 1.15, "7_days": 1.4, "48_hours": 2.2, "24_hours": 2.5 };
          multiplier *= (timelineMap[webDelivery] || 1.0);
        } else if (service === "design") {
          base = designType === "logo" ? 300 : 120;
          featuresCost = (designQty * base) + (designRevisions > 3 ? (designRevisions - 3) * 20 : 0);
          if (designSourceFiles) featuresCost += 50;
          if (designExpress) featuresCost += 100;
        }

        const subtotal = (base + featuresCost) * multiplier;
        const discount = subtotal * (promoDiscountPercent / 100);
        const tax = (subtotal - discount) * 0.05;
        const total = subtotal - discount + tax;

        setPricing({
          subtotal,
          discount,
          tax,
          total,
          deposit: total * 0.5,
          balance: total * 0.5
        });
      });
  };

  useEffect(() => {
    calculateLivePrice();
  }, [
    service, webType, webPages, webStyle, webFeatures, webMissingAssets, webDelivery, webMaintenance,
    designType, designQty, designRevisions, designSourceFiles, designPremiumFonts, designStockImages, 
    designCopywriting, designPrinting, designExpress, photoType, photoHours, photoPhotographers, 
    photoDrone, photoAlbums, photoFrames, photoLive, photoSameDay, photoTravel, photoCount, 
    photoExpress, videoHours, videoOps, videoDrone, video4k, videoHighlight, videoDoc, 
    videoMotion, videoVoice, videoSubtitles, videoExpress, printQty, printMaterial, printSize, 
    printType, printFinish, printLamination, printBinding, printDelivery, brandingDeliverables,
    promoDiscountPercent, promoApplied
  ]);

  // Apply discount code
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "KLLEGACY20") {
      setPromoDiscountPercent(20);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid discount campaign code.");
      setPromoApplied(false);
    }
  };

  // Mock File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadedFiles(prevFiles => [...prevFiles, ...fileNames]);
            return 0;
          }
          return prev + 30;
        });
      }, 300);
    }
  };

  // Final Order & Invoice Creation
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    let selections: any = {};
    let timeline = "30 Days";
    if (service === "website") {
      selections = { website_type: webType, pages: webPages, design_style: webStyle, features: webFeatures, missing_assets: webMissingAssets, delivery_time: webDelivery };
      timeline = webDelivery.replace("_", " ").toUpperCase();
    } else if (service === "design") {
      selections = { design_type: designType, quantity: designQty, revisions: designRevisions };
      timeline = designExpress ? "Express Delivery" : "Standard Delivery";
    } else {
      selections = { service_id: service, selections_custom: true };
    }

    const payload = {
      service_id: service,
      selections,
      timeline,
      discount_code: promoApplied ? promoCode : null
    };

    // Grab JWT token from client session (default mock token)
    const token = localStorage.getItem("token") || "mock-token";

    try {
      const res = await fetch(`http://localhost:8000/api/orders?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      setIsSubmitting(false);
      if (data && data.order_id) {
        setCreatedOrderData(data);
        setOrderCompleted(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } catch {
      // Offline fallback state
      setIsSubmitting(false);
      setCreatedOrderData({
        order_id: `ORD-MOCK-${Math.floor(Math.random() * 90000 + 10000)}`,
        total: pricing.total,
        deposit: pricing.deposit
      });
      setOrderCompleted(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Maximum steps for Website service is 9 steps
  const totalWebsiteSteps = 9;

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      {/* LEFT COLUMN: ORDER WIZARD FLOW */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* PROGRESS INDICATOR */}
        {!orderCompleted && (
          <div className="flex justify-between items-center bg-[#0A0A0A] p-4 rounded-full border border-white/5 px-6">
            <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">
              Configurator: {service.toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">Step {step} of {service === "website" ? totalWebsiteSteps : 3}</span>
              <div className="w-20 bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#D4AF37] h-full transition-all duration-300"
                  style={{ width: `${(step / (service === "website" ? totalWebsiteSteps : 3)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {orderCompleted ? (
          /* SUCCESS STATE PANEL */
          <div className="glass-panel p-10 md:p-12 rounded-3xl border border-[#D4AF37]/20 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto text-[#D4AF37] mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Inquiry Successful</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold">Your Order is Created</h2>
            <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Order ID <strong>{createdOrderData?.order_id}</strong> is placed. A contract and deposit invoice have been generated in your client dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-sm mx-auto">
              <a 
                href="/dashboard"
                className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#B5942B] text-xs font-semibold text-[#121212] tracking-widest uppercase rounded-full text-center transition-all"
              >
                Go to Dashboard
              </a>
              <button 
                onClick={() => {
                  window.open(`http://localhost:8000/api/pdf/quotation/${createdOrderData?.order_id}?token=mock-token`, "_blank");
                }}
                className="flex-1 py-4 border border-white/10 hover:border-white/20 text-xs font-semibold text-white tracking-widest uppercase rounded-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF Quote
              </button>
            </div>
          </div>
        ) : (
          /* WIZARD CARD PANEL */
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 space-y-8 min-h-[400px] flex flex-col justify-between">
            
            {/* STEP CONTENTS */}
            <div className="space-y-6">
              
              {/* SERVICE TYPE SELECTOR (STEP 1 FOR ALL) */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Select Agency Capability</h3>
                    <p className="text-xs text-gray-400 mt-1">Select the core digital or physical service you require from Kalaphol & Legacy.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "website", name: "Website Development" },
                      { id: "design", name: "Graphic Design" },
                      { id: "photography", name: "Creative Photography" },
                      { id: "videography", name: "Videography" },
                      { id: "printing", name: "Printing Services" },
                      { id: "branding", name: "Corporate Branding" }
                    ].map((srv) => (
                      <button
                        key={srv.id}
                        onClick={() => {
                          setService(srv.id);
                          setService(srv.id);
                        }}
                        className={`p-5 rounded-2xl border text-left text-xs font-semibold uppercase tracking-widest transition-all ${
                          service === srv.id 
                            ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" 
                            : "border-white/5 hover:border-white/10 text-gray-400 bg-white/[0.01]"
                        }`}
                      >
                        {srv.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* --- WEBSITE CUSTOM WIZARD (STEPS 2-9) --- */}
              {service === "website" && step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Website Framework Type</h3>
                    <p className="text-xs text-gray-400 mt-1">Select the operational scale and category of your website.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: "business", name: "Business Website" },
                      { id: "corporate", name: "Corporate Portal" },
                      { id: "ecommerce", name: "E-Commerce Shop" },
                      { id: "real_estate", name: "Real Estate Portal" },
                      { id: "portfolio", name: "Premium Portfolio" },
                      { id: "booking", name: "Booking System" },
                      { id: "marketplace", name: "Marketplace Platform" },
                      { id: "custom_webapp", name: "Custom Web Application" }
                    ].map(w => (
                      <button
                        key={w.id}
                        onClick={() => setWebType(w.id)}
                        className={`p-4 rounded-xl border text-center text-[10px] uppercase font-bold tracking-wider transition-all ${
                          webType === w.id ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                        }`}
                      >
                        {w.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {service === "website" && step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Estimated Page Count</h3>
                    <p className="text-xs text-gray-400 mt-1">How many layout templates and pages do you expect us to engineer?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["1-5", "6-10", "11-20", "20+"].map(p => (
                      <button
                        key={p}
                        onClick={() => setWebPages(p)}
                        className={`p-5 rounded-2xl border text-center text-xs font-semibold tracking-wider transition-all ${
                          webPages === p ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                        }`}
                      >
                        {p} Pages
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {service === "website" && step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Aesthetic Design Language</h3>
                    <p className="text-xs text-gray-400 mt-1">Select the style guideline that fits your brand profile.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "minimal", name: "Minimalist (Sleek, Fast)" },
                      { id: "luxury", name: "Luxury (Gold Accents, Dark Theme)" },
                      { id: "corporate", name: "Corporate (Clean, Traditional)" },
                      { id: "creative", name: "Creative (Bold gradients, Dynamic)" }
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setWebStyle(s.id)}
                        className={`p-5 rounded-xl border text-left text-xs tracking-wider transition-all ${
                          webStyle === s.id ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {service === "website" && step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Operational Integration Checklist</h3>
                    <p className="text-xs text-gray-400 mt-1">Check the technical integration modules required.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                    {[
                      { id: "user_login", name: "Client/User Login" },
                      { id: "admin_dashboard", name: "Admin Dashboard Control" },
                      { id: "payment_gateway", name: "Paystack Gateway API" },
                      { id: "ai_chatbot", name: "Generative AI Chatbot" },
                      { id: "booking_system", name: "Online Booking System" },
                      { id: "crm", name: "Client CRM Integration" },
                      { id: "inventory", name: "Inventory Database" },
                      { id: "seo_setup", name: "Advanced Google SEO Setup" }
                    ].map(feat => {
                      const selected = webFeatures.includes(feat.id);
                      return (
                        <button
                          key={feat.id}
                          onClick={() => {
                            if (selected) setWebFeatures(webFeatures.filter(f => f !== feat.id));
                            else setWebFeatures([...webFeatures, feat.id]);
                          }}
                          className={`p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            selected ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                          }`}
                        >
                          {feat.name}
                          {selected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {service === "website" && step === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Existing Assets Checklist</h3>
                    <p className="text-xs text-gray-400 mt-1">Do you already own these assets? (No adds pricing configuration).</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "logo", name: "Professional Logo" },
                      { id: "domain", name: "Domain Name" },
                      { id: "hosting", name: "Hosting Server Setup" },
                      { id: "copywriting", name: "Written Copy & Assets" }
                    ].map(asset => {
                      const missing = webMissingAssets.includes(asset.id);
                      return (
                        <button
                          key={asset.id}
                          onClick={() => {
                            if (missing) setWebMissingAssets(webMissingAssets.filter(a => a !== asset.id));
                            else setWebMissingAssets([...webMissingAssets, asset.id]);
                          }}
                          className={`p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            missing ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                          }`}
                        >
                          <span>{asset.name}: <strong>{missing ? "NO (Add Price)" : "YES (Owned)"}</strong></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {service === "website" && step === 7 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Deployment Timeline</h3>
                    <p className="text-xs text-gray-400 mt-1">Select the timeline speed. Rush delivery includes automatic multipliers.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "30_days", name: "30 Days (Standard)" },
                      { id: "14_days", name: "14 Days" },
                      { id: "7_days", name: "7 Days" },
                      { id: "48_hours", name: "48 Hours (Express)" },
                      { id: "24_hours", name: "24 Hours (Urgent)" }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setWebDelivery(t.id)}
                        className={`p-3 rounded-lg border text-center text-[10px] uppercase font-bold tracking-wider transition-all ${
                          webDelivery === t.id ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {service === "website" && step === 8 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Requirement Assets Upload</h3>
                    <p className="text-xs text-gray-400 mt-1">Upload reference designs, copywriting, layout specs, or company logo files.</p>
                  </div>

                  <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01] relative cursor-pointer hover:bg-white/[0.02] transition-colors">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                    <span className="text-xs text-white block">Click to upload assets</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">PDF, PNG, ZIP, DOC, MP4 (Max 100MB)</span>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Uploading files...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#D4AF37] h-full" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Uploaded Files:</span>
                      <div className="space-y-1">
                        {uploadedFiles.map((fn, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 p-2 rounded-lg border border-white/5">
                            <FileText className="w-4 h-4 text-[#D4AF37]" />
                            <span className="truncate">{fn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {service === "website" && step === 9 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Inquiry Order Summary</h3>
                    <p className="text-xs text-gray-400 mt-1">Review configurations and payment milestones details before placing order.</p>
                  </div>

                  <div className="space-y-2 border-y border-white/5 py-4 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">Service Category</span><span className="text-white font-semibold">Web Development</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Website Blueprint</span><span className="text-white font-semibold capitalize">{webType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Layout Style</span><span className="text-white font-semibold capitalize">{webStyle}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Estimated Pages</span><span className="text-white font-semibold">{webPages} Pages</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Operational Features</span><span className="text-white font-semibold">{webFeatures.length} Modules</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Timeline Speed</span><span className="text-[#D4AF37] font-semibold uppercase">{webDelivery.replace("_", " ")}</span></div>
                  </div>
                </div>
              )}

              {/* --- GRAPHIC DESIGN CUSTOM STEPS (STEPS 2-3) --- */}
              {service === "design" && step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Graphic Deliverable Selections</h3>
                    <p className="text-xs text-gray-400 mt-1">Choose design product, quantity, and requirements.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "logo", name: "Corporate Logo" },
                      { id: "flyer", name: "Event Flyer" },
                      { id: "banner", name: "Web Banner" },
                      { id: "company_profile", name: "Company Profile" },
                      { id: "social_media", name: "Social Media Template" }
                    ].map(d => (
                      <button
                        key={d.id}
                        onClick={() => setDesignType(d.id)}
                        className={`p-4 rounded-xl border text-center text-xs tracking-wider transition-all ${
                          designType === d.id ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                        }`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block font-bold">Quantity</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={designQty} 
                        onChange={(e) => setDesignQty(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-white text-xs font-sans focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 block font-bold">Max Revisions</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={designRevisions} 
                        onChange={(e) => setDesignRevisions(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-white text-xs font-sans focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {service === "design" && step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Graphic Add-on Options</h3>
                    <p className="text-xs text-gray-400 mt-1">Select add-on requirements for delivery packaging.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Vector Source Files (+GH¢50)", val: designSourceFiles, set: setDesignSourceFiles },
                      { label: "Stock Premium Images (+GH¢40)", val: designStockImages, set: setDesignStockImages },
                      { label: "Copywriting Content (+GH¢80)", val: designCopywriting, set: setDesignCopywriting },
                      { label: "Express 48H Delivery (+30%)", val: designExpress, set: setDesignExpress }
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => opt.set(!opt.val)}
                        className={`p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          opt.val ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white" : "border-white/5 text-gray-400"
                        }`}
                      >
                        {opt.label}
                        {opt.val && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* --- FALLBACK TEXT FOR OTHER SERVICES STEP 2 --- */}
              {service !== "website" && service !== "design" && step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Configure Requirements</h3>
                    <p className="text-xs text-gray-400 mt-1">Type details about the photography, video, printing, or branding service you need.</p>
                  </div>
                  <textarea 
                    rows={6}
                    placeholder="TYPE HERE IN DETAIL (E.G. HOURS, CAMERA OPERATORS, LOCATION, EVENT CATEGORY)..."
                    className="w-full p-4 rounded-2xl bg-[#121212] border border-white/10 text-white text-xs font-sans tracking-widest uppercase focus:outline-none resize-none"
                  />
                </div>
              )}

              {service !== "website" && service !== "design" && step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold">Upload Specifications</h3>
                    <p className="text-xs text-gray-400 mt-1">Provide reference visual files, audio tracks, or guideline text documents.</p>
                  </div>
                  <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01]">
                    <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                    <span className="text-xs text-white block">Click to upload assets</span>
                  </div>
                </div>
              )}

            </div>

            {/* WIZARD ACTIONS CONTROL */}
            <div className="flex gap-4 border-t border-white/5 pt-8">
              {step > 1 && (
                <button 
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/10 hover:border-white/20 text-xs font-semibold text-white tracking-widest uppercase rounded-full flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}

              {step < (service === "website" ? totalWebsiteSteps : 3) ? (
                <button 
                  onClick={nextStep}
                  className="flex-grow py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white tracking-widest uppercase rounded-full flex items-center justify-center gap-2 transition-all"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-grow py-3 bg-[#D4AF37] hover:bg-[#B5942B] disabled:opacity-50 text-xs font-bold text-[#121212] tracking-widest uppercase rounded-full flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Seeding Order...
                    </>
                  ) : (
                    <>
                      Place Order & Generate Invoice <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* RIGHT COLUMN: PRICING ENGINE PANEL */}
      <div className="space-y-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 sticky top-24 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold border-b border-white/5 pb-4">
            <ShoppingBag className="w-4 h-4" />
            AI Pricing Summary
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">GH¢ {pricing.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Discount Applied</span>
              <span className="text-red-400 font-medium">- GH¢ {pricing.discount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Taxes (VAT 5%)</span>
              <span className="text-white font-medium">GH¢ {pricing.tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Estimated Total</span>
              <span className="text-xl font-serif text-[#D4AF37] font-extrabold">GH¢ {pricing.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Deposit Due (50%)</span>
                <span className="text-white font-semibold">GH¢ {pricing.deposit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Remaining Balance</span>
                <span className="text-white font-semibold">GH¢ {pricing.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Promocode Apply */}
          <div className="border-t border-white/5 pt-6 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Apply Discount Code</span>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="KLLEGACY20" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                className="flex-grow px-4 py-2.5 rounded-full bg-[#121212] border border-white/10 text-white text-[10px] font-sans tracking-widest uppercase focus:outline-none"
              />
              <button 
                onClick={handleApplyPromo}
                disabled={promoApplied}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && <span className="text-[9px] text-emerald-400 block font-semibold">Promo Active: 20% discount applied!</span>}
            {promoError && <span className="text-[9px] text-red-400 block font-semibold">{promoError}</span>}
          </div>

          {/* Agency Commitment Note */}
          <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 flex gap-3 text-[10px] leading-relaxed text-gray-400">
            <AlertCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <div>
              <strong>Secure Processing:</strong> Quotations generated represent immediate billing indicators. Formal development begins post deposit validation.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
