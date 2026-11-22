import { useEffect, useRef, useState } from 'react'
import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Award, Check,
  ChevronDown, CircleCheck, Globe2, GraduationCap,
  Luggage, MapPin, Menu, MessageCircle,
  Plane, Quote, ShieldCheck, Smartphone, Star, TrainFront, Users,
  WalletCards, X, CarFront, Compass, Clock3, Phone, Mail
} from 'lucide-react'
import './App.css'
import { redirectToWhatsApp } from './utils/whatsapp'
import { packageInclusions, tourPackages } from './data/tourPackages'
import { blogPosts } from './data/blogPosts'

type DrawerState = { open: boolean; summary: string }

function imageSource(filename: string) {
  return `${import.meta.env.BASE_URL}images/${filename}`
}

function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget
  image.parentElement?.classList.add('image-fallback')
  if (image.dataset.fallbackApplied !== 'true') {
    image.dataset.fallbackApplied = 'true'
    image.src = imageSource('fallback-travel.svg')
  }
}

function Navbar({ openDrawer }: { openDrawer: (summary?: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const location = useLocation()
  const navRoot = useRef<HTMLElement | null>(null)
  const dropdowns = [
    {
      label: 'Services',
      key: 'services',
      items: [
        { label: 'Services Overview', path: '/services', detail: 'View all GOYAD travel solutions', icon: Globe2 },
        { label: 'Tour Packages', path: '/tour-packages', detail: 'Domestic, international & pilgrimage tours', icon: Compass },
        { label: 'Cab Services', path: '/cab-services', detail: 'Airport, local, outstation & corporate cabs', icon: CarFront },
        { label: 'Flights, Hotels & Train', path: '/flights-hotels-train', detail: 'Essential booking support', icon: Plane },
        { label: 'Travel Add-Ons', path: '/services', detail: 'Insurance, forex, SIM & essentials', icon: Luggage },
      ],
    },
    {
      label: 'Study Abroad & Visas',
      key: 'study',
      items: [
        { label: 'Study Abroad Guidance', path: '/study-abroad', detail: 'Profile, course & country guidance', icon: GraduationCap },
        { label: 'Student Visa', path: '/visa-services', detail: 'Student application preparation', icon: GraduationCap },
        { label: 'Tourist & Visitor Visas', path: '/visa-services', detail: 'Holiday and family visit guidance', icon: Globe2 },
        { label: 'Work Visa', path: '/visa-services', detail: 'Employment route document support', icon: Compass },
      ],
    },
    {
      label: 'Explore',
      key: 'explore',
      items: [
        { label: 'About Us', path: '/about', detail: 'Experience, mission & credentials', icon: Award },
        { label: 'Travel Blog', path: '/blog', detail: 'Recent travel and study articles', icon: Luggage },
        { label: 'Travel Guides', path: '/travel-guides', detail: 'Practical planning guides', icon: Compass },
      ],
    },
  ] as const

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setOpenAccordion(null)
        setMenuOpen(false)
      }
    }
    const handlePointer = (event: PointerEvent) => {
      const root = navRoot.current
      if (root && event.target instanceof Node && !root.contains(event.target)) setOpenDropdown(null)
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('pointerdown', handlePointer)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('pointerdown', handlePointer)
    }
  }, [])
  return (
    <header className="navbar" ref={navRoot}>
      <div className="nav-inner">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)} aria-label="GOYAD Travel Home">
          <span className="brand-logo"><img src={`${import.meta.env.BASE_URL}logo2.png`} alt="GOYAD Travel" onError={handleImageError} /></span>
        </Link>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <Link
            to="/"
            className={location.pathname === '/' ? 'nav-top-link active' : 'nav-top-link'}
            aria-current={location.pathname === '/' ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          {dropdowns.map((group) => (
            <div
              className="nav-dropdown"
              key={group.key}
              onMouseEnter={() => setOpenDropdown(group.key)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className="nav-dropdown-trigger"
                aria-haspopup="menu"
                aria-expanded={openDropdown === group.key}
                onClick={() => setOpenDropdown(openDropdown === group.key ? null : group.key)}
              >
                {group.label} <ChevronDown size={15} />
              </button>
              <div className={openDropdown === group.key ? 'dropdown-panel open' : 'dropdown-panel'} role="menu">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    role="menuitem"
                    onClick={() => {
                      setOpenDropdown(null)
                      setMenuOpen(false)
                    }}
                  >
                    <item.icon size={18} />
                    <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                  </Link>
                ))}
              </div>
              <div className={openAccordion === group.key ? 'mobile-accordion open' : 'mobile-accordion'}>
                <button
                  type="button"
                  className="mobile-accordion-trigger"
                  aria-expanded={openAccordion === group.key}
                  onClick={() => setOpenAccordion(openAccordion === group.key ? null : group.key)}
                >
                  {group.label} <ChevronDown size={16} />
                </button>
                <div className="mobile-accordion-links">
                  {group.items.map((item) => (
                    <Link key={item.label} to={item.path} onClick={() => setMenuOpen(false)}>
                      <item.icon size={16} /><span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link
            to="/contact"
            className={location.pathname === '/contact' ? 'nav-top-link active' : 'nav-top-link'}
            aria-current={location.pathname === '/contact' ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <button className="mobile-whatsapp-cta" type="button" onClick={() => { setMenuOpen(false); openDrawer() }}>
            <MessageCircle size={18} /> Get a Free Quote
          </button>
        </nav>
        <div className="nav-actions">
          <button className="whatsapp-icon" type="button" onClick={() => openDrawer()} aria-label="Get a free quote">
            <MessageCircle size={20} />
          </button>
          <button className="nav-cta" onClick={() => openDrawer()}>Get a Free Quote <ArrowRight size={16} /></button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  )
}

function Planner({ openDrawer: _openDrawer }: { openDrawer: (summary: string) => void }) {
  const tabs = [
    { name: 'Tours', icon: Compass, action: 'Get Quote', fields: ['Holiday type', 'Travel month', 'Travelers', 'Budget'] },
    { name: 'Cab & Fleet', icon: CarFront, action: 'Book Cab', fields: ['Trip type', 'Pickup city', 'Vehicle', 'Cab travel date'] },
    { name: 'Study Abroad', icon: GraduationCap, action: 'Get Free Counselling', fields: ['Service', 'Country', 'Level', 'Timeline'] },
    { name: 'Bookings', icon: Plane, action: 'Check Availability', fields: ['Booking', 'Route', 'Booking travel date', 'Passengers'] },
  ]
  const [tab, setTab] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const set = (key: string, value: string) => setValues(prev => ({ ...prev, [key]: value }))
  const submit = () => {
    const activeValues = tabs[tab].fields.reduce<Record<string, string>>((selected, key) => {
      if (values[key]) selected[key] = values[key]
      return selected
    }, {})
    redirectToWhatsApp(tabs[tab].name, activeValues)
  }
  const field = (key: string, label: string, options: string[]) => (
    <label className="planner-field"><span>{label}</span><select value={values[key] || ''} onChange={e => set(key, e.target.value)}>
      <option value="">Select</option>{options.map(o => <option key={o}>{o}</option>)}
    </select><ChevronDown size={15} /></label>
  )
  return (
    <div className="planner">
      <div className="planner-tabs" role="tablist">
        {tabs.map((t, i) => <button role="tab" aria-selected={tab === i} key={t.name} className={tab === i ? 'active' : ''} onClick={() => setTab(i)}>
          <t.icon size={17} /> {t.name}
        </button>)}
      </div>
      <div className="planner-fields">
        {tab === 0 && <>
          {field('Holiday type', 'Holiday type', ['Domestic Holiday', 'International Holiday', 'Weekend Getaway', 'Honeymoon', 'Family', 'Pilgrimage', 'Corporate Group'])}
          {field('Travel month', 'Travel month', ['December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'])}
          {field('Travelers', 'Travelers', ['1 Person', '2 People', 'Family', '5–10 People', '11+ People'])}
          {field('Budget', 'Budget tier', ['Essential', 'Premium', 'Luxury'])}
        </>}
        {tab === 1 && <>
          {field('Trip type', 'Trip type', ['Airport Transfer', 'Local', 'Outstation', 'Corporate Employee Transport'])}
          {field('Pickup city', 'Pickup city', ['Hyderabad', 'Secunderabad', 'Bangalore', 'Vijayawada'])}
          {field('Vehicle', 'Vehicle type', ['Sedan', 'SUV / Innova', 'Tempo Traveller', 'Bus'])}
          {field('Cab travel date', 'Travel date', ['Today', 'Tomorrow', 'This week', 'Next week', 'Custom date'])}
        </>}
        {tab === 2 && <>
          {field('Service', 'Service', ['Study Abroad Guidance', 'Student Visa', 'Tourist / Visitor Visa', 'Work Visa', 'Document & Application Support'])}
          {field('Country', 'Target country', ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Europe', 'Other'])}
          {field('Level', 'Study level', ['Undergraduate', 'Postgraduate', 'PhD', 'Diploma', 'Not sure yet'])}
          {field('Timeline', 'Preferred timeline', ['Within 3 months', '3–6 months', '6–12 months', 'Just exploring'])}
        </>}
        {tab === 3 && <>
          {field('Booking', 'Booking type', ['Domestic Flight', 'International Flight', 'Hotel Reservation', 'IRCTC Train Reservation'])}
          {field('Route', 'Route', ['Hyderabad to ...', 'Mumbai to ...', 'Delhi to ...', 'International route'])}
          {field('Booking travel date', 'Travel date', ['Today', 'Tomorrow', 'This week', 'Next month'])}
          {field('Passengers', 'Passengers', ['1 Person', '2 People', 'Family', 'Group'])}
        </>}
        <button type="button" className="planner-submit" onClick={submit} aria-label={tab === 0 ? 'Get Quote - Enquire on WhatsApp' : tabs[tab].action}>
          {tabs[tab].action} {tab === 0 ? <MessageCircle size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}

function Hero({ openDrawer: _openDrawer }: { openDrawer: (summary: string) => void }) {
  return (
    <section className="hero-section">
      <div className="hero-bg"><img src={imageSource('hero-travel.jpg')} alt="" onError={handleImageError} /></div>
      <div className="hero-overlay" />
      <div className="container hero-content">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <div className="eyebrow light"><CircleCheck size={15} /> Hyderabad’s complete travel partner</div>
          <h1>Travel made simple.<br /><em>From planning to departure.</em></h1>
          <p>Holidays, cabs, study abroad and visas—personalised support for every step of your journey.</p>
        </motion.div>
      </div>
      <div className="container planner-wrap"><Planner openDrawer={_openDrawer} /></div>
    </section>
  )
}

function ServicesBento({ openDrawer: _openDrawer }: { openDrawer: (summary: string) => void }) {
  const cards = [
    { id: 'tours', title: 'Domestic & International Tours', text: 'Thoughtfully planned holidays, pilgrimages, honeymoons and group journeys.', path: '/tour-packages', icon: Globe2, image: 'beach.jpg' },
    { id: 'fleet', title: 'Corporate & Travel Cabs', text: 'Airport, local, outstation and employee transport across Hyderabad.', path: '/cab-services', icon: CarFront, image: 'sedan.jpg' },
    { id: 'study', title: 'Study Abroad & Visas', text: 'Clear guidance, application support and pre-departure assistance.', path: '/study-abroad', icon: GraduationCap, image: 'campus.jpg' },
    { id: 'services', title: 'Flights, Hotels & IRCTC', text: 'Essential bookings for domestic and international journeys.', path: '/flights-hotels-train', icon: Plane, image: 'plane.jpg' },
  ]
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-heading">
          <div><div className="eyebrow"><Compass size={15} /> Complete travel solutions</div><h2>One partner for every journey</h2></div>
          <p>Practical support, transparent communication and global perspective—wherever you’re headed.</p>
        </div>
        <div className="bento">
          {cards.map((c, i) => <motion.article id={i === 0 ? 'tours' : undefined} className="service-card" key={c.title} whileHover={{ y: -6 }} transition={{ duration: .2 }}>
            <img className="service-card-image" src={imageSource(c.image)} alt="" onError={handleImageError} />
            <div className="service-shade" />
            <div className="service-content">
              <span className="service-icon"><c.icon size={22} /></span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <Link to={c.path}>Explore service <ArrowRight size={16} /></Link>
            </div>
          </motion.article>)}
        </div>
      </div>
    </section>
  )
}

function FleetExplorer({ openDrawer: _openDrawer }: { openDrawer: (summary: string) => void }) {
  const filters = ['All', 'Sedans', 'SUVs / Innova', 'Tempo Travellers', 'Buses']
  const [filter, setFilter] = useState('All')
  const fleet = [
    { type: 'Sedans', name: 'Executive Sedan', seats: '4 seats', use: 'Airport transfers, local travel', image: 'sedan.jpg' },
    { type: 'SUVs / Innova', name: 'Premium SUV / Innova', seats: '6–7 seats', use: 'Family, outstation, corporate', image: 'suv.jpg' },
    { type: 'Tempo Travellers', name: 'Tempo Traveller', seats: '12–17 seats', use: 'Group tours, pilgrimages', image: 'tempo.jpg' },
    { type: 'Buses', name: 'Luxury Bus', seats: '25–50 seats', use: 'Corporate, large groups', image: 'bus.jpg' },
  ]
  const visible = filter === 'All' ? fleet : fleet.filter(v => v.type === filter)
  return (
    <section className="section fleet-section" id="fleet">
      <div className="container">
        <div className="section-heading">
          <div><div className="eyebrow"><CarFront size={15} /> Cab & fleet</div><h2>Ride comfortably, arrive confidently</h2></div>
          <p>Well-maintained vehicles, professional drivers and flexible plans for every kind of travel.</p>
        </div>
        <div className="filter-tabs" aria-label="Fleet filters">{filters.map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
        <div className="fleet-grid">
          <AnimatePresence mode="popLayout">{visible.map(v => (
            <motion.article layout initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} className="fleet-card" key={v.name}>
              <div className="fleet-image"><img src={imageSource(v.image)} alt={v.name} onError={handleImageError} /><CarFront className="visual-icon" size={38} aria-hidden="true" /><span>{v.seats}</span></div>
              <div className="fleet-body"><h3>{v.name}</h3><p>{v.use}</p>
                <div className="fleet-benefits"><span><ShieldCheck size={15} /> Safety checked</span><span><Users size={15} /> Professional driver</span></div>
                <button onClick={() => redirectToWhatsApp('Cab & Fleet', { 'Vehicle': v.name, 'Capacity': v.seats, 'Recommended for': v.use })}>Request a quote <ArrowRight size={16} /></button>
              </div>
            </motion.article>
          ))}</AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function VisaStepper({ openDrawer: _openDrawer }: { openDrawer: (summary: string) => void }) {
  const types = ['Student Visa', 'Tourist & Visitor Visas', 'Work Visa']
  const [selected, setSelected] = useState(types[0])
  const steps = [
    ['Profile & Country Guidance', 'Course, country and profile-based guidance'],
    ['Documentation & SOP Support', 'Documents, statement of purpose and applications'],
    ['Visa & Application Filing', 'Visa filing support and process clarity'],
    ['Pre-Departure Assistance', 'Travel readiness and practical next steps'],
  ]
  return (
    <section className="section visa-section" id="study">
      <div className="container">
        <div className="section-heading"><div><div className="eyebrow"><GraduationCap size={15} /> Study abroad & visas</div><h2>A clear path from ambition to arrival</h2></div>
          <div className="visa-switch">{types.map(t => <button key={t} className={selected === t ? 'active' : ''} onClick={() => setSelected(t)}>{t}</button>)}</div>
        </div>
        <div className="stepper">
          {steps.map(([title, text], i) => <motion.div className="step" key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}>
            <div className="step-number">0{i + 1}</div><div className="step-line" /><h3>{title}</h3><p>{text}</p>
            {selected === types[0] && i === 0 && <span className="step-tag">Profile review</span>}
          </motion.div>)}
        </div>
        <div className="study-cta"><Award size={28} /><div><strong>Not sure which pathway fits you?</strong><span>Get a free profile and country consultation.</span></div><button onClick={() => redirectToWhatsApp('Study Abroad & Visa', { 'Visa / Guidance': selected })}>Get Free Counselling <ArrowRight size={16} /></button></div>
      </div>
    </section>
  )
}

function TravelAddons({ openDrawer: _openDrawer }: { openDrawer: (summary: string) => void }) {
  const [open, setOpen] = useState<number | null>(null)
  const [added, setAdded] = useState<string[]>([])
  const addons = [
    { title: 'Travel Insurance', text: 'Suitable options for medical and trip protection.', detail: 'Compare coverage for medical emergencies, baggage loss and trip cancellation.', icon: ShieldCheck },
    { title: 'Forex Assistance', text: 'Help with foreign currency needs through available partners.', detail: 'Get guidance on currency exchange, travel cards and documentation.', icon: WalletCards },
    { title: 'International SIM', text: 'Stay connected while travelling abroad.', detail: 'Explore data and calling options suited to your destination and duration.', icon: Smartphone },
    { title: 'Travel Essentials', text: 'Helpful accessories for students and travellers.', detail: 'Plan luggage, adapters, document holders and journey-ready essentials.', icon: Luggage },
  ]
  const toggle = (title: string) => setAdded(a => a.includes(title) ? a.filter(x => x !== title) : [...a, title])
  return (
    <section className="section addons-section">
      <div className="container">
        <div className="section-heading"><div><div className="eyebrow"><Luggage size={15} /> Travel add-ons</div><h2>Make the journey even easier</h2></div><p>Add the essentials you need while planning your trip.</p></div>
        <div className="addons-grid">{addons.map((a, i) => <motion.article layout className={`addon-card ${open === i ? 'open' : ''}`} key={a.title}>
          <button className="addon-main" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span className="addon-icon"><a.icon size={24} /></span><div className="addon-copy"><h3>{a.title}</h3><p>{a.text}</p></div><ChevronDown size={18} />
          </button>
          <AnimatePresence>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="addon-detail"><p>{a.detail}</p>
            <button className={added.includes(a.title) ? 'added' : ''} onClick={() => toggle(a.title)}>{added.includes(a.title) ? <><Check size={15} /> Added to quote</> : 'Add to quote'}</button>
          </motion.div>}</AnimatePresence>
        </motion.article>)}</div>
        {added.length > 0 && <button className="addons-quote" onClick={() => redirectToWhatsApp('Travel Add-ons', { 'Selected add-ons': added.join(', ') })}>Send quote request <ArrowRight size={16} /></button>}
      </div>
    </section>
  )
}

function ReviewsSection() {
  const reviews = [
    { tag: 'Cab Service', title: 'Outstation Cab', text: 'Booked a cab for outstation from Hyderabad to Karnataka. The driver was on time at midnight 3 AM. He was polite, made us comfortable and safe throughout.', name: 'Naga Divya', initials: 'ND', time: '3 weeks ago' },
    { tag: 'Visa & Counselling', title: 'Student Visa', text: 'A great experience with Goyad Travel for student counselling and visa assistance. The team guided me clearly at every step.', name: 'Srinivas', initials: 'SR', time: '2 weeks ago' },
    { tag: 'Flight Booking', title: 'Flight Ticket Booking', text: 'Recently contacted Goyad Travel for flight ticket booking. Very smooth, transparent and hassle-free from start to finish.', name: 'Vishnu Vardhan', initials: 'VV', time: '2 weeks ago' },
    { tag: 'Tour Package', title: 'Last-Minute Trip', text: 'Thank you to Goyad Travel for arranging my last-minute trip so efficiently. Despite the short notice, they managed everything perfectly — transport, stays and itinerary. Truly impressed by their speed and professionalism!', name: 'Uday K', initials: 'UK', time: '2 weeks ago' },
    { tag: 'Customer Service', title: 'Travel Service', text: 'Nice hospitality — really appreciate it! Guided us so well and made the whole experience smooth and stress-free. I will definitely suggest Goyad Travel to my friends and family. Thank you so much!', name: 'Anusha K', initials: 'AK', time: '5 days ago' },
    { tag: 'Cab Service', title: 'Outstation Cab — Hyderabad to Chennai', text: 'Thank you for giving us a smooth and safe ride on our trip to Chennai. The driver was professional, punctual and made the entire journey very comfortable. One of the best travel experiences we’ve had!', name: 'Sanju Sanjay', initials: 'SS', time: 'Recently' },
  ]
  return (
    <section className="section reviews-section">
      <div className="container">
        <div className="reviews-heading"><div><div className="eyebrow"><Star size={15} /> Google Reviews</div><h2>Trusted by travellers across Hyderabad</h2></div><a href="https://share.google/BuuuZ3xANCzGw4sF2" target="_blank" rel="noreferrer">View all Google reviews <ArrowRight size={16} /></a></div>
        <div className="review-grid">{reviews.map(r => <article className="review-card" key={r.name}>
          <div className="review-top"><span>{r.tag}</span><div>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}</div></div>
          <p className="review-text">“{r.text}”</p><div className="review-author"><span>{r.initials}</span><div><strong>{r.name}</strong><small>{r.time} · {r.title}</small></div><b>G</b></div>
        </article>)}</div>
      </div>
    </section>
  )
}

function QuoteDrawer({ state, setState }: { state: DrawerState; setState: (s: DrawerState) => void }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    redirectToWhatsApp(state.summary ? 'Travel Quote' : 'General Enquiry', {
      Request: state.summary || 'Please help me plan my journey',
      Name: form.name,
      Phone: form.phone,
      Email: form.email,
      Notes: form.message,
    })
    setState({ open: false, summary: '' })
  }
  return <AnimatePresence>{state.open && <>
    <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setState({ open: false, summary: '' })} />
    <motion.aside className="quote-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} aria-label="Request a quote">
      <div className="drawer-head"><div><span>Free quote request</span><h2>Let’s plan your journey</h2></div><button onClick={() => setState({ open: false, summary: '' })} aria-label="Close quote drawer"><X /></button></div>
      {state.summary && <div className="quote-summary"><Quote size={17} /><p>{state.summary}</p></div>}
      <form onSubmit={submit}>
        <label>Full name<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" /></label>
        <label>Phone number<input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91" /></label>
        <label>Email (optional)<input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" /></label>
        <label>How can we help?<textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Dates, destinations, travelers or any special needs" /></label>
        <button type="submit" className="drawer-submit"><MessageCircle size={19} /> Send via WhatsApp</button>
        <a href="tel:+917997226661" className="drawer-call"><Phone size={17} /> Or call +91 79972 26661</a>
      </form>
    </motion.aside>
  </>}</AnimatePresence>
}

function Footer({ openDrawer }: { openDrawer: (summary?: string) => void }) {
  return (
    <footer id="contact">
      <div className="container footer-grid">
        <div className="footer-brand"><Link className="brand footer-logo" to="/" aria-label="GOYAD Travel Home"><span className="brand-logo"><img src={`${import.meta.env.BASE_URL}logo2.png`} alt="GOYAD Travel" onError={handleImageError} /></span></Link>
          <p>Travel made simple. From planning to departure.</p><div className="socials"><Link to="/contact" aria-label="Contact us"><Mail /></Link><button type="button" onClick={() => openDrawer()} aria-label="Get a travel quote"><MessageCircle /></button></div>
        </div>
        <div><h3>Explore</h3><Link to="/about">About Us</Link><Link to="/services">Services</Link><Link to="/tour-packages">Tours</Link><Link to="/cab-services">Cab & Fleet</Link><Link to="/study-abroad">Study Abroad</Link><Link to="/flights-hotels-train">Flight, Hotel & IRCTC</Link></div>
        <div><h3>Visit us</h3><p><MapPin size={16} /> 2nd Floor, Reliance Humsafar Building, Road No-11, Mithila Nagar, Banjara Hills, Hyderabad - 500034</p><p><Phone size={16} /> +91 79972 26661<br />+91 79972 26662</p><p><Mail size={16} /> contact@goyadtravel.com</p></div>
        <div className="office-card"><span><Clock3 size={17} /> Office hours</span><p>Mon–Sat: 10:00 AM–6:00 PM</p><p>WhatsApp: 7 days, 9 AM–9 PM</p><small><CircleCheck size={14} /> Typically responds within 1 hour</small><button onClick={() => openDrawer()}>Get a free quote <ArrowRight size={15} /></button></div>
      </div>
      <div className="container footer-bottom"><div><span>© 2026 GOYAD Travel. All rights reserved.</span><nav className="legal-links"><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms-conditions">Terms & Conditions</Link><Link to="/cancellation-refund-policy">Cancellation & Refund</Link><Link to="/visa-disclaimer">Visa Disclaimer</Link></nav></div><span className="irctc"><TrainFront size={16} /> IRCTC-accredited rail booking</span></div>
    </footer>
  )
}

function PageHero({ eyebrow, title, text, image = 'hero-travel.jpg' }: { eyebrow: string; title: string; text: string; image?: string }) {
  return <section className="page-hero">
    <img className="page-hero-image" src={imageSource(image)} alt="" onError={handleImageError} />
    <div className="page-hero-shade" />
    <div className="container"><div className="eyebrow light">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div>
  </section>
}

function AboutPage() {
  return <>
    <PageHero eyebrow="About GOYAD Travel" title="Travel planning, made personal" text="A Hyderabad-based travel agency bringing practical, clear and reliable support to every journey." image="hero-travel.jpg" />
    <section className="section"><div className="container about-grid">
      <article><div className="eyebrow">Our experience</div><h2>Backed by real international experience</h2><p>GOYAD Travel was built from real international experience. Our founder has lived, studied and worked in Sweden and Canada, gaining first-hand experience of international education, travel, cultural differences and the practical challenges of living abroad.</p><p>That experience shapes the way we assist our customers today — with clear guidance, transparent communication and practical support for travel, visa and study-abroad requirements.</p></article>
      <div className="founder-card"><span>Founder, GOYAD Travel</span><strong>Global perspective.<br />Personal assistance.</strong><p>Whether you're planning a holiday, travelling for work, booking your next journey or considering studying abroad, our goal is simple: make the process easier, clearer and more reliable.</p></div>
    </div></section>
    <section className="section credentials-section"><div className="container"><div className="section-heading"><div><div className="eyebrow">Credentials</div><h2>Registered and transparent</h2></div></div>
      <div className="credential-grid">
        <div><span>GSTIN</span><strong>36BRQPG6382K1Z4</strong></div><div><span>MSME Udyam</span><strong>UDYAM-TS-02-0310289</strong></div><div><span>GeM Verified Seller</span><strong>Y9RR260013984072</strong></div><div><span>NSIC / MSME Gold</span><strong>NSIC00315701</strong></div><div><span>Rail Booking</span><strong>IRCTC-accredited</strong></div>
      </div>
    </div></section>
  </>
}

function ServicesPage({ openDrawer }: { openDrawer: (summary?: string) => void }) {
  const services = [
    {
      title: 'Domestic & International Tours',
      text: 'Plan customised holidays across India and international destinations, with flexible itineraries built around your travel needs.',
      includes: ['Domestic & International Holidays', 'Pilgrimage & Family Tours', 'Honeymoon & Leisure Trips', 'Corporate & Group Travel'],
      path: '/tour-packages',
      icon: Globe2,
      image: 'beach.jpg',
    },
    {
      title: 'Corporate & Travel Cab Services',
      text: 'Reliable transportation for businesses, airport transfers, local travel and outstation journeys, with professional drivers and well-maintained vehicles.',
      includes: ['Airport Transfers', 'Local & Outstation Trips', 'Corporate Employee Transport', 'Sedan, SUV, Innova & Tempo Traveller'],
      path: '/cab-services',
      icon: CarFront,
      image: 'sedan.jpg',
    },
    {
      title: 'Study Abroad & Visa Services',
      text: 'Practical guidance shaped by real international experience, from choosing a study pathway to preparing visa documents.',
      includes: ['Study Abroad Guidance', 'Student Visa Assistance', 'Tourist & Visitor Visas', 'Work Visa Guidance', 'Document & Application Support'],
      path: '/study-abroad',
      icon: GraduationCap,
      image: 'campus.jpg',
    },
    {
      title: 'Flight, Hotel & Train Reservations',
      text: 'Arrange essential bookings for your journey, from flights and hotels to domestic rail reservations.',
      includes: ['Domestic & International Flights', 'Hotel Reservations', 'IRCTC-accredited Train Reservations', 'Travel Booking Support'],
      path: '/flights-hotels-train',
      icon: Plane,
      image: 'plane.jpg',
    },
  ]
  return <><PageHero eyebrow="Complete travel solutions" title="All the support your journey needs" text="From planning your holiday to arranging transportation, visas and essential bookings, GOYAD Travel brings the key parts of your journey together." image="plane.jpg" />
    <section className="section"><div className="container"><div className="service-page-grid">{services.map(({title,text,path,icon:Icon,includes,image}) => <article key={title}><div className="service-page-visual"><img src={imageSource(image)} alt="" onError={handleImageError}/><span><Icon size={22}/></span></div><span className="service-page-icon"><Icon size={22}/></span><h2>{title}</h2><p>{text}</p><ul>{includes.map(item=><li key={item}><CircleCheck size={16}/>{item}</li>)}</ul><Link to={path}>Explore service <ArrowRight size={16} /></Link></article>)}</div></div></section>
    <section className="section addons-section"><div className="container"><div className="section-heading"><div><div className="eyebrow">Travel add-ons</div><h2>Helpful essentials for a smoother journey</h2></div></div><div className="simple-addon-grid">{['Travel Insurance','Forex Assistance','International SIM','Travel Essentials'].map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><button onClick={()=>openDrawer(`Travel add-on: ${x}`)}>Add to enquiry</button></article>)}</div></div></section>
  </>
}

function TourPackagesPage() {
  const [filter,setFilter]=useState('All')
  const categories=['All','Domestic','International','Pilgrimage & Heritage','Corporate MICE']
  const visible=filter==='All'?tourPackages:tourPackages.filter(p=>p.category===filter)
  return <><PageHero eyebrow="Customised tour packages" title="Your journey, your way" text="Customised Domestic, International & Pilgrimage Tour Packages from Hyderabad. You choose the place, days and budget. We handle everything." image="beach.jpg" />
    <section className="section"><div className="container"><div className="filter-tabs">{categories.map(f=><button className={filter===f?'active':''} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div><div className="tour-grid">{visible.map(p=><article className="tour-card" key={p.slug}><div className="tour-card-visual"><img src={imageSource(p.image)} alt={p.name} onError={handleImageError}/><span className="visual-icon"><Compass size={30}/></span></div><div><span>{p.category}</span><h3>{p.name}</h3><p>{p.summary}</p><small>Options: {p.duration}</small><Link to={`/tour-packages/${p.slug}`}>Explore {p.name} <ArrowRight size={16}/></Link></div></article>)}</div></div></section>
  </>
}

function TourPackageDetailPage() {
  const { slug } = useParams()
  const tour = tourPackages.find(item => item.slug === slug)

  if (!tour) {
    return <PolicyPage title="Package not found"><p>This tour package is not available. <Link to="/tour-packages">Explore all tour packages.</Link></p></PolicyPage>
  }

  return <>
    <PageHero eyebrow={tour.category} title={`${tour.name} tour package`} text={tour.summary} image={tour.image} />
    <section className="section">
      <div className="container package-detail">
        <div className="package-detail-intro"><div><div className="eyebrow">Flexible durations</div><h2>{tour.duration}</h2><p>Pricing is available on request. Tell us your dates, group size and preferences for a customised proposal.</p></div><Link to="/tour-packages">← All packages</Link></div>
        <div className="package-detail-grid">
          <article><h2>Highlights</h2><ul>{tour.highlights.map(item=><li key={item}><CircleCheck size={17}/>{item}</li>)}</ul></article>
          <article><h2>What can be arranged</h2><ul>{packageInclusions.map(item=><li key={item}><CircleCheck size={17}/>{item}</li>)}</ul><p className="package-note">These are planning options, not guaranteed inclusions. Final services and costs are confirmed in your personalised quote.</p></article>
        </div>
        <details className="itinerary-details">
          <summary>View a sample itinerary</summary>
          <ol>{tour.itinerary.map((day,index)=><li key={`${index}-${day}`}><strong>Day {index+1}</strong><span>{day}</span></li>)}</ol>
          <p>Sample plan only. The final route and day-by-day schedule are adjusted to your selected duration and requirements.</p>
        </details>
        <div className="package-enquiry">
          <div><h2>Make this trip yours</h2><p>Share your preferred dates and travel style to get a tailored package proposal.</p></div>
          <button className="primary-button" onClick={()=>redirectToWhatsApp('Tour Package Enquiry', { Package: tour.name, Category: tour.category, 'Duration options': tour.duration, Highlights: tour.highlights.join('; ') })}>Customize &amp; Enquire on WhatsApp <MessageCircle size={17}/></button>
        </div>
      </div>
    </section>
  </>
}

function StudyAbroadPage({ openDrawer: _openDrawer }: { openDrawer: (summary?: string) => void }) {
  const countries = [
    { name: 'UK', visa: 'Student Visa', postStudy: '2-year Graduate Route (subject to current rules)', fields: 'MBA, Engineering, Law, Data Science', overview: 'Popular for one-year master’s programmes and universities including Oxford, Cambridge, UCL, Imperial and Manchester.', image: 'uk.jpg' },
    { name: 'USA', visa: 'F-1 Visa', postStudy: 'OPT up to 3 years for eligible STEM graduates', fields: 'MS, MBA, PhD, STEM', overview: 'A wide choice of universities, specialisations and research programmes, with STEM OPT opportunities for eligible graduates.', image: 'usa.jpg' },
    { name: 'Canada', visa: 'Study Permit', postStudy: 'PGWP up to 3 years where eligible', fields: 'Diplomas, Postgraduate, Business, IT', overview: 'A range of universities and colleges, with post-graduation work opportunities subject to current programme rules.', image: 'canada.jpg' },
    { name: 'Australia', visa: 'Student Visa (Subclass 500)', postStudy: 'Subclass 485: 2–4 years, depending on eligibility and qualification', fields: 'Engineering, Nursing, IT, Business', overview: 'Internationally recognised universities and a welcoming student environment, with graduate visa rules dependent on qualification.', image: 'australia.jpg' },
    { name: 'Europe', visa: 'Country-specific Student Visa / Residence Permit', postStudy: 'Varies by country and programme', fields: 'Engineering, Tech, Pharma, Research', overview: 'Explore options including Germany, France, Ireland and Sweden; tuition and language requirements vary by country and course.', image: 'europe.jpg' },
    { name: 'New Zealand', visa: 'Student Visa', postStudy: 'Post-study work options up to 3 years, depending on eligibility', fields: 'Agriculture, IT, Hospitality, Environmental Science', overview: 'A welcoming study destination with options across universities and practical career-focused programmes.', image: 'new-zealand.jpg' },
    { name: 'Dubai / UAE', visa: 'Student Residence Visa', postStudy: 'Depends on programme and applicable UAE rules', fields: 'Business, Hospitality, Computing', overview: 'Study at international branch campuses and regional institutions in a growing education hub.', image: 'dubai.jpg' },
  ]
  return <><PageHero eyebrow="Study Abroad Consultants · Hyderabad" title="Dream of studying abroad? We've been there." text="Our founder personally lived, studied and worked in Europe and Canada for over 5 years. We guide you from first-hand knowledge." image="campus.jpg" />
    <section className="section"><div className="container"><div className="section-heading"><div><div className="eyebrow">Explore your destination</div><h2>Study abroad destinations we support</h2></div><p>We help you compare course options, entry requirements and likely costs for your profile.</p></div><div className="study-destination-grid">{countries.map(c=><article key={c.name}><div className="study-destination-visual"><img src={imageSource(c.image)} alt={`${c.name} study destination`} onError={handleImageError}/><span className="visual-icon"><GraduationCap size={28}/></span></div><span>{c.name}</span><h3>{c.overview}</h3><div className="country-facts"><p><small>Visa</small><strong>{c.visa}</strong></p><p><small>Popular fields</small><strong>{c.fields}</strong></p><p><small>Post-study work</small><strong>{c.postStudy}</strong></p></div><button className="primary-button" onClick={()=>redirectToWhatsApp('Study Abroad Counselling', { 'Target country': c.name, 'Visa': c.visa, 'Popular fields': c.fields, 'Post-study work': c.postStudy })}>Get Free Counselling <ArrowRight size={16}/></button></article>)}</div></div></section>
    <section className="section fee-section"><div className="container fee-panel"><div className="eyebrow">Our fees</div><h2>Transparent fees. No guesswork.</h2><p>Every student’s journey is different. University, destination and selected support services affect the cost, so GOYAD does not publish a one-size-fits-all service fee. During a free counselling session, the team explains what is included, the service cost and expected timeline before you decide.</p><ul><li>Clear breakdown before you pay anything</li><li>No obligation after the free consultation</li><li>Service costs explained separately from university, visa and other official fees</li></ul></div></section>
    <section className="section"><div className="container study-faq"><div className="section-heading"><div><div className="eyebrow">Helpful answers</div><h2>Study abroad FAQs</h2></div></div><details><summary>What does study abroad guidance include?</summary><p>Support can include profile review, course and university shortlisting, application and offer letter assistance, SOP and document preparation, student visa guidance and pre-departure planning.</p></details><details><summary>How much does study abroad counselling cost?</summary><p>The first counselling session is free and there is no obligation. Any further service fee is explained in a clear breakdown before you commit; university tuition, visa fees and third-party charges are separate.</p></details><details><summary>Can you guarantee admission or a visa?</summary><p>No. Admission decisions are made by the institution and visa decisions by the relevant authority. GOYAD provides guidance and application support but cannot guarantee an outcome.</p></details><details><summary>How do I choose the right country and course?</summary><p>Options are reviewed against your academic profile, goals, preferred course, budget and timeline so you can compare a practical shortlist.</p></details></div></section>
    <section className="section fleet-section"><div className="container"><div className="section-heading"><div><div className="eyebrow">Student pathway</div><h2>Complete study abroad support</h2></div></div><div className="study-service-grid">{['University Shortlisting & Admissions','SOP Writing & Documentation','Offer Letter Assistance','Student Visa Application & Interview','Flight Bookings & Accommodation','Pre-Departure & Post-Arrival Help'].map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><p>{i===0?'Profile-based matching':i===1?'Expert documentation support':i===2?'Fast turnaround':i===3?'Mock interviews and document verification':i===4?'Student accommodation and airport pickup': 'Forex, SIM, banking and settling-in support'}</p></article>)}</div></div></section>
  </>
}

function VisaPage({ openDrawer: _openDrawer }: { openDrawer: (summary?: string) => void }) {
  const [category,setCategory]=useState('Tourist & Visitor Visas')
  const data:Record<string,string[]>={
    'Student Visa':['Passport and previous travel documents','Offer letter or admission documents','Financial evidence','Academic records','Visa application form','Interview preparation'],
    'Tourist & Visitor Visas':['Valid passport','Application form','Photographs','Financial evidence','Travel itinerary','Accommodation or invitation documents'],
    'Work Visa':['Valid passport','Employment offer or sponsor documents','Qualifications','Experience evidence','Financial records','Application and interview documents'],
    'Document & Application Support':['Passport copies','Application forms','Supporting information','Document checklist','Photographs','Country-specific requirements'],
  }
  return <><PageHero eyebrow="Global Visa Services · Hyderabad" title="Your journey starts with the right visa" text="From tourist and visitor visas to student, work and business visas, GOYAD Travel provides practical guidance, document support and application assistance." image="campus.jpg" />
    <section className="section"><div className="container"><div className="visa-checklist"><div className="visa-switch" style={{justifyContent:'flex-start'}}>{Object.keys(data).map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><div className="checklist-card"><div><span>Document checklist</span><h2>{category}</h2></div><ul>{data[category].map(x=><li key={x}><CircleCheck size={17}/>{x}</li>)}</ul><button className="primary-button" onClick={()=>redirectToWhatsApp('Visa Services', { 'Visa category': category, 'Document checklist': data[category].join(', ') })}>Get Free Counselling <ArrowRight size={16}/></button></div></div></div></section>
  </>
}

  function BookingPage() {
    const [tab,setTab]=useState('Domestic Flights')
    const [from,setFrom]=useState('')
    const [to,setTo]=useState('')
    const [date,setDate]=useState('')
    const [passengers,setPassengers]=useState('')
    const tabs=['Domestic Flights','International Flights','Hotel Reservations','IRCTC Train Reservations']
    return <><PageHero eyebrow="Travel Booking Services from Hyderabad" title="Flight, hotel & train reservations" text="Book domestic and international flights, hotels and train tickets with GOYAD Travel. Practical assistance from enquiry to confirmation." image="plane.jpg" />
      <section className="section"><div className="container"><div className="booking-module"><div className="booking-tabs">{tabs.map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div><div className="booking-form">
        {tab==='Hotel Reservations' ? <><label>City / Destination<input value={to} onChange={e=>setTo(e.target.value)} placeholder="Destination" /></label><label>Check-in<input value={date} onChange={e=>setDate(e.target.value)} type="date"/></label><label>Check-out<input type="date"/></label><label>Guests<select value={passengers} onChange={e=>setPassengers(e.target.value)}><option value="">Select</option><option>1 Guest</option><option>2 Guests</option><option>Family</option></select></label></> : tab==='IRCTC Train Reservations' ? <><label>From<input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Hyderabad"/></label><label>To<input value={to} onChange={e=>setTo(e.target.value)} placeholder="Destination"/></label><label>Travel date<input value={date} onChange={e=>setDate(e.target.value)} type="date"/></label><label>Passengers<select value={passengers} onChange={e=>setPassengers(e.target.value)}><option value="">Select</option><option>1 Passenger</option><option>2 Passengers</option><option>Family / Group</option></select></label></> : <><label>From<input value={from} onChange={e=>setFrom(e.target.value)} placeholder="City or airport"/></label><label>To<input value={to} onChange={e=>setTo(e.target.value)} placeholder="Destination"/></label><label>Travel date<input value={date} onChange={e=>setDate(e.target.value)} type="date"/></label><label>Passengers<select value={passengers} onChange={e=>setPassengers(e.target.value)}><option value="">Select</option><option>1 Passenger</option><option>2 Passengers</option><option>Family / Group</option></select></label></>}
      </div><button className="primary-button booking-submit" onClick={()=>redirectToWhatsApp('Flight, Hotel & Train', { 'Booking type': tab, 'From / City': from, 'To / Destination': to, 'Travel date': date, 'Passengers / Guests': passengers })}>Get your travel quote <ArrowRight size={16}/></button></div></div></section>
    </>
  }

  function CabPage() {
    const [vehicle,setVehicle]=useState('Sedan')
    const [tripType,setTripType]=useState('Airport Transfer')
    const [pickup,setPickup]=useState('Hyderabad')
    const [destination,setDestination]=useState('')
    const vehicles=[
      ['Sedan','4 seats','Airport, local and outstation travel','sedan'],
      ['SUV','6–7 seats','Family, outstation and corporate','SUV'],
      ['Innova','6–7 seats','Family and premium outstation','Innova'],
      ['Tempo Traveller','12–17 seats','Group tours and pilgrimage','Tempo'],
    ] as const
    return <><PageHero eyebrow="Cab Service · Hyderabad" title="Reliable cab service for every journey" text="Local cabs, airport transfers, sightseeing, pilgrimage trips, one-way and round-trip outstation travel, and group transportation." image="sedan.jpg" />
      <section className="section"><div className="container"><div className="cab-calculator"><div><span>Cab enquiry calculator</span><h2>Choose your journey</h2><label>Trip type<select value={tripType} onChange={e=>setTripType(e.target.value)}><option>Airport Transfer</option><option>Local Cab</option><option>One-Way Outstation</option><option>Round-Trip Outstation</option><option>Corporate Employee Transport</option></select></label><label>Pickup / Destination<div className="route-fields"><input value={pickup} onChange={e=>setPickup(e.target.value)} placeholder="Hyderabad"/><input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Destination"/></div></label></div><div className="vehicle-picker"><span>Vehicle type</span>{vehicles.map(v=><button key={v[0]} className={vehicle===v[0]?'active':''} onClick={()=>setVehicle(v[0])}><strong>{v[0]}</strong><small>{v[1]} · {v[3]}</small></button>)}</div><button className="primary-button" onClick={()=>redirectToWhatsApp('Cab & Fleet', { 'Trip type': tripType, 'Pickup': pickup, 'Destination': destination, 'Vehicle': vehicle })}>Get cab quote <ArrowRight size={16}/></button></div></div></section>
    </>
  }

  function BlogPage({ guides=false }:{guides?:boolean}) {
    const [category,setCategory]=useState('All')
    const categories=guides?['All','Travel Guides']:['All','Visa Services','Flights & Hotels']
    const collection=blogPosts.filter(post=>guides?post.category==='Travel Guides':post.category!=='Travel Guides')
    const visible=category==='All'?collection:collection.filter(post=>post.category===category)
    const basePath=guides?'/travel-guides':'/blog'
    return <><PageHero eyebrow={guides?'Practical travel guides':'Travel Blog'} title={guides?'Travel guides for smarter journeys':'Travel stories, advice and guides'} text="Locally available planning articles for study, travel, bookings and everyday trip preparation." image="blog-books.jpg" />
      <section className="section"><div className="container"><div className="filter-tabs">{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><div className="blog-grid">{visible.map(post=><article key={post.slug}><div className="blog-card-visual"><img src={imageSource(post.image)} alt={post.title} onError={handleImageError}/><span className="visual-icon"><Compass size={30}/></span></div><div><span>{post.category}</span><h2>{post.title}</h2><p>{post.summary}</p><Link to={`${basePath}/${post.slug}`}>{guides?'Read Guide':'Read Full Article'} <ArrowRight size={15}/></Link></div></article>)}</div></div></section>
    </>
  }

  function BlogArticlePage({ guides=false }:{guides?:boolean}) {
    const { slug }=useParams()
    const post=blogPosts.find(item=>item.slug===slug && (guides?item.category==='Travel Guides':item.category!=='Travel Guides'))
    if(!post) return <PolicyPage title="Article not found"><p>This article is not available. <Link to={guides?'/travel-guides':'/blog'}>Return to {guides?'travel guides':'the blog'}.</Link></p></PolicyPage>
    return <><PageHero eyebrow={post.category} title={post.title} text={post.summary} image={post.image}/>
      <section className="section"><article className="container policy-content article-content">
        <Link className="article-back-link" to={guides?'/travel-guides':'/blog'}>← All {guides?'travel guides':'articles'}</Link>
        {post.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.points&&<ul>{section.points.map(point=><li key={point}>{point}</li>)}</ul>}</section>)}
        <p className="article-disclaimer">Information is general planning guidance, not legal, immigration or financial advice. Requirements and policies can change; confirm current details with the relevant official authority or provider.</p>
        <Link className="article-contact-link" to="/contact">Need help planning? Contact us <ArrowRight size={16}/></Link>
      </article></section>
    </>
  }

  function ContactPage() {
    const [contact,setContact]=useState({ name:'', phone:'', email:'', service:'Tours', message:'' })
    const submit = (event: React.FormEvent) => {
      event.preventDefault()
      redirectToWhatsApp(contact.service, { 'Name': contact.name, 'Phone': contact.phone, 'Email': contact.email, 'Notes': contact.message })
    }
    return <><PageHero eyebrow="Contact GOYAD Travel" title="Let's plan your journey, your way" text="Tell us what you need and our travel team will get back to you with the right options and next steps." />
      <section className="section"><div className="container contact-grid"><form className="contact-form-card" onSubmit={submit}><div className="eyebrow">Send an enquiry</div><h2>How can we help?</h2><div className="contact-fields"><label>Full name<input required value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} placeholder="Your name"/></label><label>Phone number<input required type="tel" value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})} placeholder="+91"/></label><label>Email<input type="email" value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})} placeholder="you@example.com"/></label><label>Service<select value={contact.service} onChange={e=>setContact({...contact,service:e.target.value})}><option>Tours</option><option>Cab & Fleet</option><option>Study Abroad</option><option>Visa Services</option><option>Flight / Hotel / Train</option></select></label><label className="full">Message<textarea value={contact.message} onChange={e=>setContact({...contact,message:e.target.value})} placeholder="Tell us your destination, dates or requirements"/></label></div><button type="submit" className="primary-button">Send on WhatsApp <MessageCircle size={17}/></button></form>
        <aside className="office-card-large"><span>Office</span><h2>Banjara Hills, Hyderabad</h2><p><MapPin size={18}/>#2nd Floor, Reliance Humsafar Building, Road No-11, Mithila Nagar, Banjara Hills (Opp. Care Hospital Lane), Hyderabad, Telangana - 500034</p><p><Phone size={18}/><a href="tel:+917997226661">+91 7997226661</a><br/><a href="tel:+917997226662">+91 7997226662</a></p><p><Mail size={18}/>contact@goyadtravel.com</p><div><strong>Office hours</strong><span>Monday – Saturday: 10:00 AM – 6:00 PM</span><strong>WhatsApp support</strong><span>7 Days: 9:00 AM – 9:00 PM</span><small>Typically within 1 hour response</small></div></aside></div></section>
    </>
  }

  function PolicyPage({ title, children }: { title:string; children:React.ReactNode }) {
    return <><PageHero eyebrow="GOYAD Travel" title={title} text="Please review the applicable terms for services booked through GOYAD Travel." /><section className="section"><article className="container policy-content">{children}</article></section></>
  }

  const cancellationPolicy = <>
    <h2>CANCELLATION & REFUND POLICY</h2><p><strong>Last Updated: 14 August 2026</strong></p>
    <h3>1. General Policy</h3><p>Cancellation and refund eligibility depends on the service booked and the applicable terms of the airline, hotel, tour operator, transport provider, railway service, educational institution, visa authority or other supplier. The specific cancellation conditions applicable to a booking will be communicated or made available to the customer where applicable before confirmation.</p>
    <h3>2. Customer Cancellation</h3><p>If a customer wishes to cancel a booking, they should contact GOYAD Travel as soon as possible. Cancellation requests should preferably be made in writing through email, WhatsApp or another recognised communication channel. Applicable charges depend on the type of service, date of cancellation, travel date, supplier policy, booking conditions, amount paid and government or third-party charges.</p>
    <h3>3. Flight, Hotel, Tour, Cab and Train Bookings</h3><p>Flight, hotel, tour, cab and train cancellations are subject to the applicable airline, property, tour operator, transport provider or railway rules. Refunds may involve supplier cancellation charges, fare differences, service or processing charges, non-refundable taxes or fees and other applicable deductions.</p>
    <h3>4. Visa and Study Abroad Fees</h3><p>Government visa fees, embassy fees, appointment charges and other official fees are generally subject to the rules of the relevant authority and may be non-refundable. University application, examination, courier, government and third-party fees are subject to the relevant provider’s rules.</p>
    <h3>5. Refund Processing</h3><p>Where a refund is applicable, processing may begin after GOYAD Travel receives or confirms the corresponding refund from the relevant provider. Timelines depend on the airline, hotel, tour operator, transport provider or payment provider. Refunds will normally use the applicable payment method or another method agreed with the customer.</p>
    <h3>6. Changes and Rescheduling</h3><p>Changes to travel dates, passenger details, itinerary or other booking components may incur additional charges and remain subject to availability and supplier rules.</p>
    <h3>7. Customer Responsibilities</h3><p>Customers should review booking confirmations and cancellation conditions and contact GOYAD Travel promptly if they identify an error or need to cancel or amend a booking.</p>
    <h3>Policy Updates and Contact</h3><p>GOYAD Travel may update this policy from time to time. Contact <strong>contact@goyadtravel.com</strong> or <strong>+91 79972 26661 / +91 79972 26662</strong> for questions.</p>
  </>

  const termsPolicy = <>
    <h2>TERMS & CONDITIONS</h2><p><strong>Last Updated: 14 August 2026</strong></p>
    <p>These Terms & Conditions govern the use of the GOYAD Travel website and travel-related services provided by GOYAD Travel.</p>
    <h3>1. About Our Services</h3><p>GOYAD Travel provides Domestic & International Tours, Study Abroad & Visa Services, Corporate & Travel Cab Services, Flight, Hotel & Train Reservations, related travel assistance and travel add-ons. Some services are fulfilled directly and others arranged through third-party suppliers.</p>
    <h3>2. Enquiries and Quotations</h3><p>Information or prices before confirmation may change due to availability, supplier pricing, taxes, government charges, exchange rates, travel dates or itinerary changes. A quotation is not a confirmed booking until GOYAD Travel confirms receipt of applicable payment or confirmation.</p>
    <h3>3. Booking Confirmation</h3><p>A booking is confirmed after applicable payment and confirmation is received. Customers must review passenger names, dates, destinations, passport details and booking information.</p>
    <h3>4. Payments and Third Parties</h3><p>Payments, taxes, government fees and supplier charges apply as communicated at booking. Airlines, hotels, transport operators, tour operators, educational institutions, visa providers and booking platforms may apply their own terms.</p>
    <h3>5. Cabs and Force Majeure</h3><p>Cab availability and timings depend on vehicle, driver, traffic, weather, road conditions and other circumstances. GOYAD Travel is not responsible for delays or inability to provide services caused by circumstances beyond reasonable control.</p>
    <h3>6. Study Abroad and Visa Services</h3><p>GOYAD Travel does not guarantee admission, scholarships or visa approval. Admission, academic decisions and visa decisions remain with the relevant institution or authority.</p>
    <h3>7. Governing Law</h3><p>These terms are governed by applicable Indian law and, subject to mandatory consumer-protection provisions, subject to the jurisdiction of courts in Hyderabad, Telangana.</p>
    <h3>Contact</h3><p>GOYAD Travel, Banjara Hills, Hyderabad, Telangana, India · contact@goyadtravel.com · +91 79972 26661 / +91 79972 26662</p>
  </>

  const privacyPolicy = <>
    <h2>Privacy Policy</h2>
    <h3>Information you provide</h3><p>This application does not create an account or store information entered into quote and contact forms on its own servers. When you choose to send an enquiry, the information you provide is included in a WhatsApp message addressed to GOYAD Travel.</p>
    <h3>External services you choose</h3><p>Opening WhatsApp, placing a telephone call, sending email or viewing Google reviews connects you to the selected third-party service. Those services process data under their own privacy policies and terms.</p>
    <h3>Local storage and cookies</h3><p>The application does not use account cookies or save form details in browser storage. Essential browser and hosting behavior may still apply when you access the site.</p>
    <h3>Data minimisation</h3><p>Please include only information needed to respond to your travel enquiry. Do not send payment credentials, passwords or sensitive identity documents through an initial enquiry.</p>
    <h3>Your choices</h3><p>You can choose not to submit a form and can contact the team by phone or email instead. For requests about information already sent to a third-party service, contact that service directly as well as GOYAD Travel.</p>
    <h3>Contact</h3><p>For privacy questions, contact <strong>contact@goyadtravel.com</strong> or +91 79972 26661.</p>
  </>

  const visaDisclaimer = <>
    <h2>Visa Disclaimer</h2><p><strong>Last Updated: 14 August 2026</strong></p>
    <p>GOYAD Travel provides visa assistance, documentation support and application guidance for eligible travellers and students. Our role is to help customers understand the applicable process and prepare applications. <strong>GOYAD Travel does not make visa decisions and cannot guarantee visa approval.</strong></p>
    <h3>Visa Decisions and Approval</h3><p>All decisions are made solely by the relevant embassy, consulate, immigration authority or government department. Submitting an application does not guarantee approval, issuance, processing time, appointment availability or immigration clearance.</p>
    <h3>Customer Information</h3><p>Customers are responsible for providing complete, accurate and genuine information and documents. GOYAD Travel may decline assistance where information or documentation appears false, altered, misleading or fraudulent.</p>
    <h3>Requirements and Processing</h3><p>Visa requirements, fees and procedures can change without notice. Processing times are estimates and may be extended by document requests, background checks, embassy workload or individual circumstances.</p>
    <h3>Fees and Refusal</h3><p>Government fees and official charges may be non-refundable even if an application is refused or withdrawn. GOYAD Travel cannot override a refusal but may discuss appropriate next steps.</p>
    <h3>Student and Other Visas</h3><p>University admission and student visa issuance are separate decisions. Tourist, visitor, business, work and family visa eligibility varies with destination, nationality, purpose, financial circumstances and immigration history.</p>
    <h3>No Legal or Immigration Advice</h3><p>GOYAD Travel provides travel and visa assistance rather than legal representation or legal advice. Customers should consult a qualified immigration lawyer or authorised professional for legal advice.</p>
    <h3>Contact</h3><p>GOYAD Travel, Banjara Hills, Hyderabad, Telangana, India · contact@goyadtravel.com · +91 79972 26661 / +91 79972 26662</p>
  </>
export default function App() {
  const [drawer, setDrawer] = useState<DrawerState>({ open: false, summary: '' })
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [location.pathname])
  const openDrawer = (summary = '') => setDrawer({ open: true, summary })
  return (
    <>
      <Navbar openDrawer={openDrawer} />
      <main>
        <Routes>
          <Route path="/" element={<><Hero openDrawer={openDrawer}/><ServicesBento openDrawer={openDrawer}/><FleetExplorer openDrawer={openDrawer}/><VisaStepper openDrawer={openDrawer}/><TravelAddons openDrawer={openDrawer}/><ReviewsSection/></>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage openDrawer={openDrawer}/>} />
          <Route path="/tour-packages" element={<TourPackagesPage />} />
          <Route path="/tour-packages/:slug" element={<TourPackageDetailPage />} />
          <Route path="/study-abroad" element={<StudyAbroadPage openDrawer={openDrawer}/>} />
          <Route path="/visa-services" element={<VisaPage openDrawer={openDrawer}/>} />
          <Route path="/flights-hotels-train" element={<BookingPage/>} />
          <Route path="/cab-services" element={<CabPage/>} />
          <Route path="/blog" element={<BlogPage/>} />
          <Route path="/blog/:slug" element={<BlogArticlePage/>} />
          <Route path="/travel-guides" element={<BlogPage guides/>} />
          <Route path="/travel-guides/:slug" element={<BlogArticlePage guides/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/privacy-policy" element={<PolicyPage title="Privacy Policy">{privacyPolicy}</PolicyPage>} />
          <Route path="/goyad-travel-privacy-policy" element={<PolicyPage title="Privacy Policy">{privacyPolicy}</PolicyPage>} />
          <Route path="/terms-and-conditions" element={<PolicyPage title="Terms & Conditions">{termsPolicy}</PolicyPage>} />
          <Route path="/terms-conditions" element={<PolicyPage title="Terms & Conditions">{termsPolicy}</PolicyPage>} />
          <Route path="/cancellation-refund-policy" element={<PolicyPage title="Cancellation & Refund Policy">{cancellationPolicy}</PolicyPage>} />
          <Route path="/visa-disclaimer" element={<PolicyPage title="Visa Disclaimer">{visaDisclaimer}</PolicyPage>} />
          <Route path="*" element={<PolicyPage title="Page Not Found"><p>The page you requested could not be found. <Link to="/">Return to the GOYAD Travel homepage.</Link></p></PolicyPage>} />
        </Routes>
      </main>
      <Footer openDrawer={openDrawer} />
      <QuoteDrawer state={drawer} setState={setDrawer} />
      <button className="floating-whatsapp" type="button" onClick={() => openDrawer()} aria-label="Get a travel quote"><MessageCircle size={24} /><span>Get a quote</span></button>
    </>
  )
}
