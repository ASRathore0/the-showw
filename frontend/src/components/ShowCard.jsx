import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Ticket } from 'lucide-react';

const ShowCard = ({ show }) => {
  const minPrice = show.ticket_categories?.length 
    ? Math.min(...show.ticket_categories.map(c => Number(c.price)))
    : 499;

  return (
    <div className="cinematic-card rounded-xl overflow-hidden flex flex-col h-full group">
      {/* Poster Image Container */}
      <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden bg-zinc-900">
        <img 
          src={show.poster_path || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'} 
          alt={show.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        
        {/* City Tag */}
        <div className="absolute top-3 left-3 bg-[#B51D2A] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
          {show.city}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 text-xs font-medium px-3 py-1 rounded-md text-white">
          Starts <span className="text-[#D6A84F] font-bold text-sm">₹{minPrice}</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white font-heading leading-snug group-hover:text-[#B51D2A] transition-colors mb-2">
            {show.title}
          </h3>
          <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {show.description}
          </p>

          <div className="space-y-2 text-xs text-gray-300 border-t border-white/5 pt-3 mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#B51D2A]" />
              <span>{show.show_date} ({show.show_time})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span className="truncate">{show.venue}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <Link 
            to={`/shows/${show.id}`} 
            className="btn-outline py-2 text-xs text-center justify-center border-white/20"
          >
            VIEW SHOW
          </Link>
          <Link 
            to={`/shows/${show.id}/seats`} 
            className="btn-primary py-2 text-xs text-center justify-center"
          >
            <Ticket className="w-3.5 h-3.5" />
            BOOK SEATS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
