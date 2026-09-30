import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import { Award, Users, Star, Mic, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto text-center border-b border-white/10">
        <span className="text-xs font-bold text-[#B51D2A] uppercase tracking-widest block mb-2">
          {settings.about_tagline || "ABOUT THE SHOW"}
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-heading tracking-tight mb-4">
          MORE THAN A SHOW.
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl font-light max-w-3xl mx-auto leading-relaxed">
          {settings.about_quote || '"The JP Yadav Show brings together comedy, conversations, music, talent and unforgettable live experiences."'}
        </p>
      </div>

      {/* Editorial Split Layout */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold font-heading uppercase text-white leading-snug">
              {settings.about_heading || "CRAFTING A NEW BENCHMARK IN LIVE & DIGITAL ENTERTAINMENT"}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {settings.about_p1 || "Founded by JP Yadav, the platform emerged as a premier cultural powerhouse. Moving away from low-budget generic tropes, The JP Yadav Show represents sophisticated production values, state-of-the-art stage lighting, crisp acoustics, and relatable observational humor."}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings.about_p2 || "Whether performing before packed auditoriums in Patna, Varanasi, Lucknow, and Delhi or reaching millions across OTT and video streaming, our mission is simple: inspire laughter, foster genuine talent, and elevate Bhojpuri performance art."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="cinematic-card p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-[#D6A84F] font-heading">50+</div>
                <div className="text-xs text-gray-400">Sold-Out Live Events</div>
              </div>
              <div className="cinematic-card p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-[#B51D2A] font-heading">2,500+</div>
                <div className="text-xs text-gray-400">Talent Applications Evaluated</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="cinematic-card rounded-2xl overflow-hidden p-2 border border-white/10 shadow-2xl">
              <img 
                src={settings.about_image_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000"} 
                alt="Live Concert Stage"
                className="w-full h-[400px] object-cover rounded-xl" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* Production Values */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <SectionHeading 
          tagline="OUR STANDARD"
          title="THE PRODUCTION PHILOSOPHY"
          subtitle="Built on artistic integrity, modern technology, and audience comfort."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="cinematic-card p-8 rounded-2xl border border-white/10">
            <Sparkles className="w-10 h-10 text-[#D6A84F] mb-4" />
            <h3 className="text-xl font-bold font-heading mb-2">Cinematic Elegance</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every detail—from visual stage lighting to broadcast audio—is meticulously crafted for high-end entertainment.
            </p>
          </div>

          <div className="cinematic-card p-8 rounded-2xl border border-white/10">
            <Mic className="w-10 h-10 text-[#B51D2A] mb-4" />
            <h3 className="text-xl font-bold font-heading mb-2">Grassroots Talent Spotting</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Transparent multi-stage auditioning system providing raw artists a direct pathway to mainstream stage fame.
            </p>
          </div>

          <div className="cinematic-card p-8 rounded-2xl border border-white/10">
            <Users className="w-10 h-10 text-[#D6A84F] mb-4" />
            <h3 className="text-xl font-bold font-heading mb-2">Seamless Ticketing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Real-time interactive seat selection, instant QR tickets, and hassle-free venue entry.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
