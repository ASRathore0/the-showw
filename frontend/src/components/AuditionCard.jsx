import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, ArrowRight } from 'lucide-react';

const AuditionCard = ({ audition }) => {
  return (
    <div className="cinematic-card rounded-xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#B51D2A]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#B51D2A]/20 transition-all" />

      <div>
        {/* Category Pill */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-md border border-white/10">
            {audition.category}
          </span>
          <span className="text-xs text-[#D6A84F] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Active Hunt
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white font-heading mb-3 group-hover:text-[#B51D2A] transition-colors leading-snug">
          {audition.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6">
          {audition.description}
        </p>
      </div>

      <div>
        {/* Meta Info */}
        <div className="space-y-2 text-xs text-gray-300 border-t border-white/10 pt-4 mb-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-[#B51D2A]" /> Audition City:
            </span>
            <span className="font-semibold text-white">{audition.city}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-[#D6A84F]" /> Apply Deadline:
            </span>
            <span className="font-semibold text-white">{audition.end_date}</span>
          </div>
        </div>

        {/* Apply CTA Button */}
        <Link 
          to={`/auditions/${audition.id}/apply`}
          className="btn-primary w-full py-2.5 text-xs text-center justify-center font-bold tracking-wider uppercase group-hover:bg-[#d12332]"
        >
          APPLY FOR AUDITION
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default AuditionCard;
