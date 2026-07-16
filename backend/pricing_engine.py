# AI Pricing Engine for KL Studios Services

PRICING_CONFIGS = {
    "website": {
        "base_prices": {
            "business": 1500.0,
            "corporate": 2500.0,
            "ecommerce": 3500.0,
            "real_estate": 2800.0,
            "school": 2000.0,
            "church": 1200.0,
            "ngo": 1500.0,
            "hospital": 3000.0,
            "hotel": 2500.0,
            "restaurant": 1800.0,
            "portfolio": 1000.0,
            "booking": 2200.0,
            "marketplace": 4500.0,
            "learning": 3800.0,
            "blog": 800.0,
            "landing_page": 600.0,
            "custom_webapp": 5000.0
        },
        "pages_pricing": {
            "1-5": 0.0,
            "6-10": 300.0,
            "11-20": 700.0,
            "20+": 1500.0
        },
        "design_style_multipliers": {
            "minimal": 1.0,
            "corporate": 1.1,
            "luxury": 1.3,
            "modern": 1.1,
            "creative": 1.2,
            "premium": 1.25,
            "custom": 1.4
        },
        "features": {
            "user_login": 400.0,
            "admin_dashboard": 600.0,
            "blog": 250.0,
            "news": 200.0,
            "gallery": 150.0,
            "booking_system": 500.0,
            "appointment": 400.0,
            "calendar": 250.0,
            "live_chat": 300.0,
            "whatsapp_integration": 150.0,
            "payment_gateway": 500.0,
            "email_system": 300.0,
            "crm": 800.0,
            "inventory": 600.0,
            "property_listings": 700.0,
            "job_portal": 600.0,
            "forum": 400.0,
            "ai_chatbot": 900.0,
            "analytics": 300.0,
            "seo_setup": 350.0,
            "google_maps": 150.0,
            "api_integration": 600.0,
            "custom_database": 800.0,
            "multi_language": 500.0,
            "membership": 600.0,
            "subscriptions": 650.0,
            "search": 200.0,
            "wishlist": 150.0,
            "reviews": 200.0,
            "messaging": 450.0,
            "notifications": 350.0
        },
        "asset_additions": {
            "logo": 250.0,
            "domain": 50.0,
            "hosting": 150.0,
            "brand_guidelines": 400.0,
            "content": 300.0,
            "images": 200.0,
            "videos": 500.0,
            "copywriting": 400.0
        },
        "rush_multipliers": {
            "30_days": 1.0,
            "21_days": 1.05,
            "14_days": 1.15,
            "10_days": 1.25,
            "7_days": 1.4,
            "5_days": 1.6,
            "72_hours": 1.9,
            "48_hours": 2.2,
            "24_hours": 2.5
        },
        "maintenance_monthly": {
            "none": 0.0,
            "3_months": 150.0,
            "6_months": 130.0,
            "12_months": 110.0,
            "24_months": 90.0
        }
    },
    "design": {
        "base_prices": {
            "logo": 300.0,
            "flyer": 100.0,
            "poster": 120.0,
            "banner": 150.0,
            "billboard": 400.0,
            "business_card": 80.0,
            "company_profile": 350.0,
            "brochure": 200.0,
            "menu": 150.0,
            "book_cover": 180.0,
            "social_media": 80.0,
            "packaging": 450.0,
            "brand_identity": 800.0,
            "letterhead": 60.0,
            "presentation": 250.0,
            "id_card": 50.0,
            "certificate": 70.0,
            "invitation": 90.0
        }
    },
    "photography": {
        "base_prices": {
            "wedding": 1500.0,
            "birthday": 600.0,
            "conference": 800.0,
            "church_event": 500.0,
            "corporate": 1000.0,
            "graduation": 700.0,
            "naming_ceremony": 500.0,
            "fashion_shoot": 900.0,
            "studio_shoot": 400.0,
            "real_estate": 800.0,
            "products": 600.0,
            "drone_coverage": 1200.0
        }
    },
    "videography": {
        "base_price": 1000.0
    },
    "printing": {
        "base_price": 50.0
    },
    "branding": {
        "base_price": 500.0
    }
}

def calculate_website_price(selections: dict) -> dict:
    # Get base price
    web_type = selections.get("website_type", "business")
    base_price = PRICING_CONFIGS["website"]["base_prices"].get(web_type, 1500.0)
    
    # Page additions
    pages = selections.get("pages", "1-5")
    pages_fee = PRICING_CONFIGS["website"]["pages_pricing"].get(pages, 0.0)
    
    # Design style multiplier
    style = selections.get("design_style", "minimal")
    style_mult = PRICING_CONFIGS["website"]["design_style_multipliers"].get(style, 1.0)
    
    # Selected features
    features_list = selections.get("features", [])
    features_fee = sum(PRICING_CONFIGS["website"]["features"].get(f, 0.0) for f in features_list)
    
    # Missing assets additions (if client says NO to asset owned)
    missing_assets = selections.get("missing_assets", [])
    assets_fee = sum(PRICING_CONFIGS["website"]["asset_additions"].get(a, 0.0) for a in missing_assets)
    
    # Calculate subtotal before rush fees and maintenance
    subtotal_for_rush = (base_price + pages_fee + features_fee + assets_fee) * style_mult
    
    # Rush fee multiplier
    delivery = selections.get("delivery_time", "30_days")
    rush_mult = PRICING_CONFIGS["website"]["rush_multipliers"].get(delivery, 1.0)
    rush_fee = subtotal_for_rush * (rush_mult - 1.0)
    
    # Maintenance additions
    maint_option = selections.get("maintenance", "none")
    maint_rate = PRICING_CONFIGS["website"]["maintenance_monthly"].get(maint_option, 0.0)
    maint_months = 0
    if maint_option == "3_months":
        maint_months = 3
    elif maint_option == "6_months":
        maint_months = 6
    elif maint_option == "12_months":
        maint_months = 12
    elif maint_option == "24_months":
        maint_months = 24
    maint_fee = maint_rate * maint_months
    
    # Subtotal
    subtotal = subtotal_for_rush + rush_fee + maint_fee
    
    # Discount (flat amount or percentage code)
    discount_val = selections.get("discount", 0.0)
    
    # Tax - let's set a flat 5% NHIL/VAT or optional tax
    tax_rate = selections.get("tax_rate", 0.05)
    tax_fee = max(0.0, (subtotal - discount_val) * tax_rate)
    
    total = max(0.0, subtotal - discount_val + tax_fee)
    
    # Deposit required (typically 50%)
    deposit_required = total * 0.5
    balance = total - deposit_required
    
    return {
        "base_price": base_price,
        "pages_fee": pages_fee,
        "design_multiplier": style_mult,
        "features_fee": features_fee,
        "assets_fee": assets_fee,
        "rush_fee": rush_fee,
        "maintenance_fee": maint_fee,
        "subtotal": subtotal,
        "discount": discount_val,
        "tax": tax_fee,
        "total": total,
        "deposit": deposit_required,
        "balance": balance
    }

def calculate_graphic_design_price(selections: dict) -> dict:
    design_type = selections.get("design_type", "logo")
    base_price = PRICING_CONFIGS["design"]["base_prices"].get(design_type, 150.0)
    
    quantity = int(selections.get("quantity", 1))
    revisions = int(selections.get("revisions", 3))
    
    # Extra revisions fee (above 3)
    extra_revisions_fee = max(0, revisions - 3) * 20.0
    
    # Option add-ons
    source_files_fee = 50.0 if selections.get("source_files") else 0.0
    premium_fonts_fee = 30.0 if selections.get("premium_fonts") else 0.0
    stock_images_fee = 40.0 if selections.get("stock_images") else 0.0
    copywriting_fee = 80.0 if selections.get("copywriting") else 0.0
    printing_fee = 100.0 if selections.get("printing") else 0.0
    
    subtotal = (base_price * quantity) + extra_revisions_fee + source_files_fee + premium_fonts_fee + stock_images_fee + copywriting_fee + printing_fee
    
    # Express delivery
    express_fee = subtotal * 0.3 if selections.get("express_delivery") else 0.0
    subtotal += express_fee
    
    discount_val = selections.get("discount", 0.0)
    tax_fee = max(0.0, (subtotal - discount_val) * 0.05)
    total = max(0.0, subtotal - discount_val + tax_fee)
    
    return {
        "base_price": base_price,
        "quantity": quantity,
        "extra_revisions_fee": extra_revisions_fee,
        "add_ons": {
            "source_files": source_files_fee,
            "premium_fonts": premium_fonts_fee,
            "stock_images": stock_images_fee,
            "copywriting": copywriting_fee,
            "printing": printing_fee
        },
        "express_fee": express_fee,
        "subtotal": subtotal,
        "discount": discount_val,
        "tax": tax_fee,
        "total": total,
        "deposit": total * 0.5,
        "balance": total * 0.5
    }

def calculate_photography_price(selections: dict) -> dict:
    photo_type = selections.get("photo_type", "studio_shoot")
    base_price = PRICING_CONFIGS["photography"]["base_prices"].get(photo_type, 400.0)
    
    hours = float(selections.get("hours", 2.0))
    # Hours above baseline (baseline is 2 hours)
    extra_hours_fee = max(0.0, hours - 2.0) * 150.0
    
    photographers = int(selections.get("photographers", 1))
    photographer_fee = max(0, photographers - 1) * 200.0
    
    drone_fee = 300.0 if selections.get("drone") else 0.0
    albums = int(selections.get("albums", 0)) * 100.0
    frames = int(selections.get("frames", 0)) * 50.0
    live_coverage_fee = 250.0 if selections.get("live_coverage") else 0.0
    same_day_edit_fee = 200.0 if selections.get("same_day_editing") else 0.0
    
    travel_dist = float(selections.get("travel_distance", 0.0))
    travel_fee = travel_dist * 2.5  # per km fee
    
    photos_count = int(selections.get("photos_count", 50))
    # Above baseline 50 photos
    extra_photos_fee = max(0, photos_count - 50) * 2.0
    
    subtotal = base_price + extra_hours_fee + photographer_fee + drone_fee + albums + frames + live_coverage_fee + same_day_edit_fee + travel_fee + extra_photos_fee
    
    express_fee = subtotal * 0.25 if selections.get("express_delivery") else 0.0
    subtotal += express_fee
    
    discount_val = selections.get("discount", 0.0)
    tax_fee = max(0.0, (subtotal - discount_val) * 0.05)
    total = max(0.0, subtotal - discount_val + tax_fee)
    
    return {
        "base_price": base_price,
        "hours_fee": extra_hours_fee,
        "photographers_fee": photographer_fee,
        "add_ons": {
            "drone": drone_fee,
            "albums": albums,
            "frames": frames,
            "live_coverage": live_coverage_fee,
            "same_day_edit": same_day_edit_fee,
            "travel": travel_fee,
            "extra_photos": extra_photos_fee
        },
        "express_fee": express_fee,
        "subtotal": subtotal,
        "discount": discount_val,
        "tax": tax_fee,
        "total": total,
        "deposit": total * 0.5,
        "balance": total * 0.5
    }

def calculate_videography_price(selections: dict) -> dict:
    base_price = PRICING_CONFIGS["videography"]["base_price"]
    
    hours = float(selections.get("hours", 2.0))
    extra_hours_fee = max(0.0, hours - 2.0) * 200.0
    
    camera_operators = int(selections.get("camera_operators", 1))
    camera_operators_fee = max(0, camera_operators - 1) * 300.0
    
    drone_fee = 400.0 if selections.get("drone") else 0.0
    resolutions_4k_fee = 200.0 if selections.get("resolutions_4k") else 0.0
    highlight_video_fee = 250.0 if selections.get("highlight_video") else 0.0
    documentary_fee = 500.0 if selections.get("documentary") else 0.0
    motion_graphics_fee = 300.0 if selections.get("motion_graphics") else 0.0
    voice_over_fee = 150.0 if selections.get("voice_over") else 0.0
    subtitles_fee = 100.0 if selections.get("subtitles") else 0.0
    
    subtotal = base_price + extra_hours_fee + camera_operators_fee + drone_fee + resolutions_4k_fee + highlight_video_fee + documentary_fee + motion_graphics_fee + voice_over_fee + subtitles_fee
    
    express_fee = subtotal * 0.3 if selections.get("express_editing") else 0.0
    subtotal += express_fee
    
    discount_val = selections.get("discount", 0.0)
    tax_fee = max(0.0, (subtotal - discount_val) * 0.05)
    total = max(0.0, subtotal - discount_val + tax_fee)
    
    return {
        "base_price": base_price,
        "hours_fee": extra_hours_fee,
        "camera_operators_fee": camera_operators_fee,
        "add_ons": {
            "drone": drone_fee,
            "4k": resolutions_4k_fee,
            "highlight": highlight_video_fee,
            "documentary": documentary_fee,
            "motion_graphics": motion_graphics_fee,
            "voice_over": voice_over_fee,
            "subtitles": subtitles_fee
        },
        "express_fee": express_fee,
        "subtotal": subtotal,
        "discount": discount_val,
        "tax": tax_fee,
        "total": total,
        "deposit": total * 0.5,
        "balance": total * 0.5
    }

def calculate_printing_price(selections: dict) -> dict:
    base_price = PRICING_CONFIGS["printing"]["base_price"]
    
    quantity = int(selections.get("quantity", 100))
    # scaling factor based on quantity
    quantity_cost = quantity * 0.15
    
    material = selections.get("material", "standard_paper")
    material_cost = 50.0 if material == "premium_card" else 0.0
    
    paper_size = selections.get("paper_size", "A4")
    size_cost = 20.0 if paper_size in ["A3", "A2", "A1"] else 0.0
    
    paper_type = selections.get("paper_type", "150gsm")
    type_cost = 30.0 if paper_type == "300gsm" else 0.0
    
    finish = selections.get("finish", "matte")
    finish_cost = 25.0 if finish == "gloss" else 0.0
    
    lamination_fee = 40.0 if selections.get("lamination") else 0.0
    binding_fee = 50.0 if selections.get("binding") else 0.0
    delivery_fee = 30.0 if selections.get("delivery") else 0.0
    
    subtotal = base_price + quantity_cost + material_cost + size_cost + type_cost + finish_cost + lamination_fee + binding_fee + delivery_fee
    
    discount_val = selections.get("discount", 0.0)
    tax_fee = max(0.0, (subtotal - discount_val) * 0.05)
    total = max(0.0, subtotal - discount_val + tax_fee)
    
    return {
        "base_price": base_price,
        "quantity_cost": quantity_cost,
        "add_ons": {
            "material": material_cost,
            "size": size_cost,
            "type": type_cost,
            "finish": finish_cost,
            "lamination": lamination_fee,
            "binding": binding_fee,
            "delivery": delivery_fee
        },
        "subtotal": subtotal,
        "discount": discount_val,
        "tax": tax_fee,
        "total": total,
        "deposit": total * 0.5,
        "balance": total * 0.5
    }

def calculate_branding_price(selections: dict) -> dict:
    base_price = PRICING_CONFIGS["branding"]["base_price"]
    
    deliverables = selections.get("deliverables", [])
    # Deliverable costs
    deliverable_pricing = {
        "logo": 300.0,
        "business_cards": 100.0,
        "letterhead": 80.0,
        "email_signature": 60.0,
        "brand_guidelines": 400.0,
        "packaging": 500.0,
        "vehicle_branding": 600.0,
        "uniform_design": 250.0,
        "social_media_kit": 200.0
    }
    
    deliverables_fee = sum(deliverable_pricing.get(d, 0.0) for d in deliverables)
    subtotal = base_price + deliverables_fee
    
    discount_val = selections.get("discount", 0.0)
    tax_fee = max(0.0, (subtotal - discount_val) * 0.05)
    total = max(0.0, subtotal - discount_val + tax_fee)
    
    return {
        "base_price": base_price,
        "deliverables_fee": deliverables_fee,
        "subtotal": subtotal,
        "discount": discount_val,
        "tax": tax_fee,
        "total": total,
        "deposit": total * 0.5,
        "balance": total * 0.5
    }

def calculate_price(service_id: str, selections: dict) -> dict:
    if service_id == "website":
        return calculate_website_price(selections)
    elif service_id == "design":
        return calculate_graphic_design_price(selections)
    elif service_id == "photography":
        return calculate_photography_price(selections)
    elif service_id == "videography":
        return calculate_videography_price(selections)
    elif service_id == "printing":
        return calculate_printing_price(selections)
    elif service_id == "branding":
        return calculate_branding_price(selections)
    else:
        # Fallback generic calculation
        base_price = 500.0
        subtotal = base_price
        discount_val = selections.get("discount", 0.0)
        tax_fee = subtotal * 0.05
        total = subtotal - discount_val + tax_fee
        return {
            "base_price": base_price,
            "subtotal": subtotal,
            "discount": discount_val,
            "tax": tax_fee,
            "total": total,
            "deposit": total * 0.5,
            "balance": total * 0.5
        }
