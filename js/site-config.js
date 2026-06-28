window.SITE_CONFIG = {
  currency: {
    symbol: '$',
    code: 'USD',
    locale: 'en-US'
  },
  brand: {
    name: 'KL STUDIOS',
    shortName: 'KL STUDIOS',
    logo: 'assets/logo.png',
    logoAlt: 'KL Studios — Design, Create, Inspire',
    email: 'klstudios.agency@gmail.com',
    homeHref: 'index.html',
    footerDescription: 'Premium creative designs, digital assets, and interactive websites built for elite modern brands.'
  },
  navItems: [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'about', label: 'Why Us', href: 'about.html' },
    { key: 'services', label: 'Services', href: 'services.html' },
    { key: 'portfolio', label: 'Our Work', href: 'portfolio.html' },
    { key: 'photography', label: 'Photography', href: 'photography.html' },
    { key: 'estimator', label: 'Cost Calculator', href: 'estimator.html' },
    { key: 'contact', label: 'Get In Touch', href: 'contact.html', cta: true }
  ],
  footer: {
    ctaHeading: 'Ready to elevate your brand?',
    ctaText: 'Get a ballpark quote in minutes or send us your brief — we respond within 2 hours.',
    ctaPrimaryLabel: 'Get a Quote',
    ctaSecondaryLabel: 'Contact Us',
    navigationTitle: 'Navigation',
    servicesTitle: 'Core Services',
    socialLinks: {
      instagram: 'https://instagram.com/KLSTUDIOS.AGENCY',
      facebook: 'https://facebook.com/KLSTUDIOS.AGENCY',
      youtube: 'https://youtube.com/KLSTUDIOS.AGENCY'
    }
  },
  estimator: {
    emptyMessage: 'No services selected yet. Click on services to calculate cost!',
    contactGreeting: 'Hello KL Studios team!',
    speedOptions: [
      { text: 'Standard Delivery', multiplier: 1.0 },
      { text: 'Express Delivery (+35%)', multiplier: 1.35 },
      { text: 'Super Express (+75%)', multiplier: 1.75 }
    ],
    services: {
      graphic: { name: 'Graphic Design', basePrice: 1500, baseTimeline: 3, unit: 'Asset(s)' },
      photo: { name: 'Photo Editing', basePrice: 1200, baseTimeline: 2, unit: 'Photo(s)' },
      video: { name: 'Video Editing', basePrice: 2500, baseTimeline: 4, unit: 'Minute(s)' },
      branding: { name: 'Branding Kit', basePrice: 3500, baseTimeline: 6, unit: 'Asset(s)' },
      web: { name: 'Web Development', basePrice: 6000, baseTimeline: 10, unit: 'Page(s)' },
      portrait: { name: 'Portrait Session', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
      event: { name: 'Event / Wedding', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
      commercial: { name: 'Commercial / Product', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
      editing: { name: 'Photo Editing Only', basePrice: 0, baseTimeline: 0, unit: 'Photo(s)' },
      other: { name: 'Photography Inquiry', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
      multiple: { name: 'Multiple Services', basePrice: 0, baseTimeline: 0, unit: 'Item(s)' }
    }
  }
};
