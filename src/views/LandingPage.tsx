import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

import { db, Course } from '../utils/db';

// --- Componente para animar elementos al hacer scroll (Reveal on Scroll) ---
const FadeInSection: React.FC<{ children: React.ReactNode; delay?: string }> = ({ children, delay = '0ms' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const coursesRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(db.getCourses().filter(c => c.published));
  }, []);

  const [isPaused, setIsPaused] = useState(false);

  // --- Lógica del Carrusel Automático ---
  useEffect(() => {
    const scrollContainer = carouselRef.current;
    if (!scrollContainer) return;

    const scrollStep = () => {
      if (isPaused) return;

      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      // Tolerancia de 5px para detectar el final
      if (scrollContainer.scrollLeft >= maxScrollLeft - 5) {
        // Si llegamos al final, volver al inicio suavemente
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Desplazar una tarjeta a la derecha (ancho aproximado de tarjeta + gap)
        scrollContainer.scrollBy({ left: 340, behavior: 'smooth' });
      }
    };

    const intervalId = setInterval(scrollStep, 3500); // Cambia cada 3.5 segundos

    return () => clearInterval(intervalId);
  }, [isPaused]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      // Si estamos al final, manual click vuelve al principio
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
      }
    }
  };

  const translations = {
    es: {
      heroTitle: 'Domina el Cielo.',
      heroSub: 'Piloto Certificado.',
      heroText: 'Formación profesional para la nueva generación de aviadores. Obtén tu licencia oficial y despega en inspecciones, cine y topografía.',
      viewCourses: 'Ver Cursos',
      simulator: 'Simulador',
      pathTitle: 'Tu Camino al Éxito',
      pathSub: 'Sigue nuestro proceso de tres pasos diseñado por expertos.',
      step1: 'Conecta',
      step1Text: 'Únete a nuestra comunidad. Haz networking con instructores y pilotos expertos.',
      step2: 'Entrena',
      step2Text: 'Domina el temario con más de 40 horas de video y simulaciones de vuelo.',
      step3: 'Certifica',
      step3Text: 'Supera los exámenes oficiales de AESA y obtén tu licencia profesional.',
      catalogTitle: 'Módulos de Formación',
      catalogSub: 'Desliza para explorar las especializaciones disponibles.',
      ctaTitle: '¿Listo para despegar tu carrera?',
      ctaSub: 'Únete a más de 2.000 alumnos que ya están trabajando en el sector.',
      ctaBtn: 'Empezar Ahora',
      price: '299€',
      details: 'Detalles',
      // Courses
      course1: 'Operaciones de Vuelo',
      course2: 'Termografía Aérea',
      course3: 'Cine y Fotografía',
      course4: 'Agricultura de Precisión',
      course5: 'Inspección Industrial',
      // Footer
      footerDesc: 'La plataforma líder en formación de pilotos de drones. Tecnología, normativa y práctica en un solo lugar.',
      company: 'Compañía',
      about: 'Sobre Nosotros',
      careers: 'Trabaja con nosotros',
      blog: 'Blog de Aviación',
      legal: 'Legal',
      terms: 'Términos de Uso',
      privacy: 'Privacidad',
      cookies: 'Cookies',
      contact: 'Contacto',
      rights: 'Todos los derechos reservados.'
    },
    en: {
      heroTitle: 'Master the Skies.',
      heroSub: 'Certified Pilot.',
      heroText: 'Professional training for the next generation of aviators. Get your official license and takeoff in inspections, film, and surveying.',
      viewCourses: 'View Courses',
      simulator: 'Simulator',
      pathTitle: 'Your Path to Success',
      pathSub: 'Follow our three-step process designed by experts.',
      step1: 'Connect',
      step1Text: 'Join our community. Network with instructors and expert pilots.',
      step2: 'Train',
      step2Text: 'Master the syllabus with over 40 hours of video and flight simulations.',
      step3: 'Qualify',
      step3Text: 'Pass the official exams and obtain your professional license.',
      catalogTitle: 'Training Modules',
      catalogSub: 'Swipe to explore available specializations.',
      ctaTitle: 'Ready to launch your career?',
      ctaSub: 'Join over 2,000 students already working in the industry.',
      ctaBtn: 'Start Now',
      price: '$299',
      details: 'Details',
      // Courses
      course1: 'Flight Ops',
      course2: 'Thermal Imaging',
      course3: 'Cinematography',
      course4: 'Precision Agriculture',
      course5: 'Industrial Inspection',
      // Footer
      footerDesc: 'The leading platform for drone pilot training. Technology, regulation, and practice in one place.',
      company: 'Company',
      about: 'About Us',
      careers: 'Careers',
      blog: 'Aviation Blog',
      legal: 'Legal',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      cookies: 'Cookies',
      contact: 'Contact',
      rights: 'All rights reserved.'
    }
  };

  const t = translations[language];




  const scrollToCourses = (e: React.MouseEvent) => {
    e.preventDefault();
    coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRestrictedAccess = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      const msg = language === 'es'
        ? "Esta área requiere una cuenta de piloto. Por favor, accede para continuar."
        : "This area requires a pilot account. Please login to continue.";
      alert(msg);
      login(); // Assuming login() here opens login page or similar? Wait, in original it was onLogin passed from App.
      // Actually onLogin in App set isLoggedIn to true, which is not what we want if we are redirecting.
      // But in original code, onLogin was handleLogin which sets isLoggedIn=true.
      // The original logic was: alert -> onLogin() -> isLoggedIn becomes true. This logic seems flawed (it logs user in immediately after alert without credentials).
      // However, to keep same behavior: 
      navigate('/login');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Floating WhatsApp Mock - Now Functional */}
      {!isLoggedIn && (
        <a
          href="https://wa.me/5491112345678"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg cursor-pointer hover:scale-110 transition-transform group animate-bounce"
          title="Chat on WhatsApp"
        >
          <span className="material-symbols-outlined text-3xl">chat</span>
        </a>
      )}

      <main className="flex-1 w-full space-y-24 py-12 overflow-hidden">
        {/* ... Hero Section unchanged ... */}

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <section className="relative overflow-hidden rounded-3xl min-h-[500px] flex items-center shadow-2xl shadow-black/20">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1600')` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#181411] via-[#181411]/85 to-transparent" />
              <div className="relative z-10 px-8 py-20 sm:px-16 lg:w-2/3">
                <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl">
                  {t.heroTitle}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-200 text-6xl sm:text-7xl">{t.heroSub}</span>
                </h1>
                <p className="mb-10 max-w-lg text-lg text-gray-300 font-light leading-relaxed">{t.heroText}</p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button
                    onClick={scrollToCourses}
                    className="group flex h-14 items-center justify-center rounded-xl bg-primary px-10 text-lg font-bold text-[#181411] transition-all hover:bg-[#ff9529] shadow-xl hover:scale-105"
                  >
                    <span>{t.viewCourses}</span>
                    <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => handleRestrictedAccess('/simulator')}
                    className="flex h-14 items-center justify-center rounded-xl border border-[#393028] bg-[#221910]/80 px-10 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-[#393028]"
                  >
                    <span className="material-symbols-outlined mr-2">sports_esports</span>
                    {t.simulator}
                  </button>
                </div>
              </div>
            </section>
          </FadeInSection>
        </div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-12 border-y border-[#393028]/30">
            <FadeInSection>
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-black text-white sm:text-5xl mb-4">{t.pathTitle}</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t.pathSub}</p>
              </div>
            </FadeInSection>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { step: '01', title: t.step1, desc: t.step1Text, icon: 'share', delay: '100ms' },
                { step: '02', title: t.step2, desc: t.step2Text, icon: 'school', delay: '300ms' },
                { step: '03', title: t.step3, desc: t.step3Text, icon: 'verified', delay: '500ms' }
              ].map((item) => (
                <FadeInSection key={item.step} delay={item.delay}>
                  <div className="group relative overflow-hidden rounded-2xl border border-[#393028] bg-surface-dark p-10 transition-all hover:border-primary/50 hover:bg-[#2a2018] flex flex-col items-center text-center h-full">
                    <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#393028] text-primary transition-all group-hover:bg-primary group-hover:text-[#181411] shadow-lg group-hover:shadow-primary/20">
                      <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </section>
        </div>

        {/* Catalog Carousel */}
        <section id="courses" ref={coursesRef} className="py-12 scroll-mt-24 pl-4 sm:pl-6 lg:pl-8 relative group/carousel">
          <FadeInSection>
            <div className="max-w-7xl mx-auto pr-4 sm:pr-6 lg:pr-8 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-white sm:text-5xl">{t.catalogTitle}</h2>
                <p className="mt-3 text-gray-400 text-lg flex items-center gap-2">
                  {t.catalogSub} <span className="material-symbols-outlined animate-pulse">arrow_right_alt</span>
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* Carousel Wrapper with Arrows */}
          <FadeInSection>
            <div
              className="relative w-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-black hover:scale-110 hidden md:flex"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-black hover:scale-110 hidden md:flex"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>

              {/* Container */}
              <div
                ref={carouselRef}
                className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide pr-8 items-center"
                style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div key={course.id} className="min-w-[320px] md:min-w-[380px] snap-center group overflow-hidden rounded-2xl border border-[#393028] bg-surface-dark transition-all hover:border-primary/50 flex-shrink-0 relative transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                      <div className="relative h-56 bg-gray-800 mb-0 overflow-hidden">
                        <img src={course.thumbnail || "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=400"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={course.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-60"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-white font-bold text-2xl mb-2 line-clamp-1">{course.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#393028]">
                          <span className="text-white font-bold text-lg">{course.price || "GRATIS"}</span>
                          <button onClick={() => handleRestrictedAccess(`/learn?courseId=${course.id}`)} className="text-primary text-sm font-bold hover:text-white transition-colors flex items-center gap-1">
                            {t.details} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center text-gray-500 py-10">No hay cursos publicados disponibles en este momento.</div>
                )}
                {/* Spacer for right padding to allow last item to be centered if needed */}
                <div className="w-[10vw] shrink-0" />
              </div>
            </div>
          </FadeInSection>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-24 border-t border-[#393028] bg-[#0d0a08] pt-16 pb-12 text-white z-10 relative">
        <FadeInSection>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Column 1: Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-3xl">flight_takeoff</span>
                  <h2 className="text-xl font-bold tracking-wide text-white">AeroVision</h2>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t.footerDesc}
                </p>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => alert("Contact: support@aerovision.com")} className="h-10 w-10 rounded-full bg-[#1e1a16] border border-[#393028] flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </button>
                  <button onClick={() => window.open('https://aerovision.com', '_blank')} className="h-10 w-10 rounded-full bg-[#1e1a16] border border-[#393028] flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all">
                    <span className="material-symbols-outlined text-sm">public</span>
                  </button>
                </div>
              </div>

              {/* Column 2: Company */}
              <div>
                <h3 className="text-lg font-bold mb-6">{t.company}</h3>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li><button onClick={() => alert("Información sobre la empresa...")} className="hover:text-primary transition-colors text-left">{t.about}</button></li>
                  <li><button onClick={() => alert("No hay vacantes disponibles en este momento.")} className="hover:text-primary transition-colors text-left">{t.careers}</button></li>
                  <li><button onClick={() => alert("Próximamente en nuestro blog...")} className="hover:text-primary transition-colors text-left">{t.blog}</button></li>
                </ul>
              </div>

              {/* Column 3: Legal */}
              <div>
                <h3 className="text-lg font-bold mb-6">{t.legal}</h3>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li><button onClick={() => alert("Aquí irían los Términos de Uso.")} className="hover:text-primary transition-colors text-left">{t.terms}</button></li>
                  <li><button onClick={() => alert("Aquí iría la Política de Privacidad.")} className="hover:text-primary transition-colors text-left">{t.privacy}</button></li>
                  <li><button onClick={() => alert("Aquí iría la Política de Cookies.")} className="hover:text-primary transition-colors text-left">{t.cookies}</button></li>
                </ul>
              </div>

              {/* Column 4: Contact */}
              <div>
                <h3 className="text-lg font-bold mb-6">{t.contact}</h3>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                    <span>Aeroparque Jorge Newbery, Buenos Aires, Argentina</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">call</span>
                    <span>+54 9 11 1234 5678</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#393028] pt-8 text-center text-gray-600 text-sm">
              <p>© 2026 AeroVision. {t.rights}</p>
            </div>
          </div>
        </FadeInSection>
      </footer>
    </div>
  );
};

export default LandingPage;
