import { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- ICONS (Keep your existing icon components here) ---
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>);
const ChevronLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const ChevronRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><polyline points="20 6 9 17 4 12" /></svg>);
const ArrowRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const scrollContainerRef = useRef(null);
  const [formStatus, setFormStatus] = useState('idle');

  // --- DYNAMIC REVIEWS STATE ---
  const [testimonials, setTestimonials] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' or 'prev'

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId;

    const scroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += 1; // Speed: 1px per frame
        // Reset when we've scrolled past the first set of items
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [testimonials, isPaused]);

  useEffect(() => {
    fetch('/reviews.json')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error("Could not load reviews", err));
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    const form = e.target;
    const data = new FormData(form);
    try {
      const response = await fetch("https://formspree.io/f/xojvbblw", {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setFormStatus('success');
        form.reset();
        setTimeout(() => setFormStatus('idle'), 5000);
      } else { setFormStatus('error'); }
    } catch (error) { setFormStatus('error'); }
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollTestimonials = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const galleryItems = [
    { type: 'video', url: 'videos/wardrobe_assembly.mp4', title: 'PAX Wardrobe Assembly' },
    { type: 'image', url: '/IMG_8185.JPG', title: 'Mirror Mounting' },
    { type: 'image', url: '/IMG_2667.jpg', title: 'Bed Assembly' },
    { type: 'video', url: 'videos/tv_mounting.mp4', title: 'Seamless TV Mounting' },
    { type: 'image', url: '/IMG_8407.JPG', title: 'Picture Mounting' },
    { type: 'image', url: '/IMG_2614.jpg', title: 'PAX Wardrobe Assembly' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pt-20">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-[100]">
        <div className="bg-slate-900 text-white text-xs sm:text-sm py-2 px-4 text-center">Serving London & Surrounding Areas</div>
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
                <img src="logos/logo.png" alt="Logo" className="h-16 w-auto object-contain rounded-lg" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl leading-none tracking-tight text-slate-900">RONCAN<span className="text-sky-500">FIXIT</span></span>
                  <span className="text-xs text-gray-500 tracking-widest uppercase">Professional Handyman</span>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => scrollToSection('pricing')} className="font-medium text-gray-600">Pricing & Services</button>
                <button onClick={() => scrollToSection('work')} className="font-medium text-gray-600">Recent Work</button>
                <button onClick={() => scrollToSection('contact')} className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium">Book Now</button>
              </div>
              <div className="md:hidden"><button onClick={toggleMenu} className="text-gray-900 p-2">{isMenuOpen ? <XIcon /> : <MenuIcon />}</button></div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">Home improvements, <br /><span className="text-sky-500">simplified.</span></h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl">Professional, transparently priced handyman services for London homes.</p>
          <div className="flex gap-4">
            <button onClick={() => scrollToSection('pricing')} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">Check Prices <ArrowRightIcon /></button>
          </div>
        </div>
      </section>

      {/* Pricing - Using Local Public Images */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src="tv_mounting.png" alt="TV" className="w-full h-full object-cover scale-100 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg font-bold">From £65</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3">TV Mounting</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Any size TV</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Any Wall</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Materials can be provided</li>
                </ul>
                <button onClick={() => scrollToSection('contact')} className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold hover:border-sky-500 hover:text-sky-600 transition-colors">Book Now</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src="/IMG_2614.jpg" alt="Furniture" className="w-full h-full object-cover scale-100 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg font-bold">From £45</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3">Furniture Assembly</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Wardrobes & Beds</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> IKEA Specialist</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Household Furniture</li>
                </ul>
                <button onClick={() => scrollToSection('contact')} className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold hover:border-sky-500 hover:text-sky-600 transition-colors">Book Now</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src="/IMG_8407.JPG" alt="General" className="w-full h-full object-cover scale-100 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg font-bold">From £30</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3">Shelves & Pictures</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Mirrors & Art</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Cabinets</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700"><CheckIcon /> Blinds & Poles</li>
                </ul>
                <button onClick={() => scrollToSection('contact')} className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold hover:border-sky-500 hover:text-sky-600 transition-colors">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work & Testimonials */}
      <section id="work" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Recent Work</h2>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-20">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedItem(item)}
                className="relative break-inside-avoid rounded-2xl overflow-hidden group cursor-zoom-in bg-gray-50 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl"
              >
                {item.type === 'video' ? (
                  <div className="relative">
                    <video muted loop autoPlay playsInline className="w-full object-cover">
                      <source src={item.url} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                      {/* <PlayIcon /> */}
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                  <p className="text-white font-bold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC TESTIMONIALS */}
          <div className="relative px-4 md:px-12">
            <h3 className="text-2xl font-bold text-center mb-8">Latest Reviews</h3>
            <div className="hidden md:block" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
              <button onClick={() => scrollTestimonials('left')} className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-xl z-10"><ChevronLeftIcon /></button>
              <button onClick={() => scrollTestimonials('right')} className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-xl z-10"><ChevronRightIcon /></button>
            </div>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-8 no-scrollbar"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-[300px] md:w-[350px] bg-gray-50 p-6 rounded-2xl border border-gray-100 flex-shrink-0">
                  <div className="text-sky-600 font-bold text-xs uppercase mb-1">{t.task}</div>
                  <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, s) => <StarIcon key={s} />)}</div>
                  <p className="text-gray-700 italic mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">{t.name.charAt(0)}</div>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-gray-500 uppercase">{t.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(50px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideInLeft {
              from { transform: translateX(-50px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-next { animation: slideInRight 0.3s ease-out; }
            .animate-slide-prev { animation: slideInLeft 0.3s ease-out; }
          `}</style>
          <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform"><XIcon /></button>

          <button
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setSlideDirection('prev');
              const idx = galleryItems.findIndex(i => i.url === selectedItem.url);
              const prevIdx = (idx - 1 + galleryItems.length) % galleryItems.length;
              setSelectedItem(galleryItems[prevIdx]);
            }}
          >
            <ChevronLeftIcon />
          </button>

          <button
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setSlideDirection('next');
              const idx = galleryItems.findIndex(i => i.url === selectedItem.url);
              const nextIdx = (idx + 1) % galleryItems.length;
              setSelectedItem(galleryItems[nextIdx]);
            }}
          >
            <ChevronRightIcon />
          </button>

          <div
            key={selectedItem.url}
            className={`max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-slide-${slideDirection}`}
            onClick={e => e.stopPropagation()}
          >
            {selectedItem.type === 'video' ? (
              <video
                controls
                autoPlay
                muted
                loop
                playsInline
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain"
              >
                <source src={selectedItem.url} type="video/mp4" />
              </video>
            ) : (
              <img
                src={selectedItem.url}
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain"
                alt={selectedItem.title}
              />
            )}
            <p className="text-white text-center mt-4 text-xl font-bold">{selectedItem.title}</p>
          </div>
        </div>
      )}

      {/* Contact Form */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Ready to get started?</h2>
          <p className="text-gray-400 mb-12 text-lg text-center">Send us a message with what you need doing and we'll get back to you with a quote within 24 hours.</p>
          <form className="bg-white text-left p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none" placeholder="Name" required />
                <input type="text" name="postcode" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none" placeholder="Postcode" required />
                <input type="tel" name="phone" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none" placeholder="Contact Number" required />
                <input type="email" name="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none" placeholder="Email" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Needed</label>
                <select name="service" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-900">
                  <option>TV Mounting</option>
                  <option>Furniture Assembly</option>
                  <option>Hanging & Shelving</option>
                  <option>Other</option>
                </select>
              </div>
              <textarea name="message" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none" placeholder="Details (e.g. TV size, wall type).." required></textarea>
              <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
                {formStatus === 'submitting' ? 'Sending...' : 'Request Quote'}
              </button>
              {formStatus === 'success' && (
                <p className="text-green-600 text-center font-bold mt-4 animate-bounce">
                  Message received! We'll get back to you shortly.
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-500 text-center font-bold mt-4">
                  Oops! Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">RONCAN<span className="text-sky-500">FIXIT</span></h3>
            <p className="text-sm opacity-80">Professional Handyman Services &copy; {new Date().getFullYear()}</p>
            <p className="text-lg font-bold text-white mt-1">07931 094 866</p>
          </div>

          <div className="flex gap-4">
            <a href="https://instagram.com/roncanfixit_" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 rounded-xl hover:bg-slate-800 transition-all border border-slate-800 shadow-lg group flex items-center justify-center">
              <img src="logos/instagram.svg" alt="Instagram" className="w-6 h-6 transition-transform group-hover:scale-110" />
            </a>
            <a href="https://tiktok.com/@roncanfixit_" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 rounded-xl hover:bg-slate-800 transition-all border border-slate-800 shadow-lg group flex items-center justify-center">
              <img src="logos/tiktok.svg" alt="TikTok" className="w-6 h-6 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { createRoot(container).render(<App />); }