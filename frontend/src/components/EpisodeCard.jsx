import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, User, Calendar } from 'lucide-react';

const EpisodeCard = ({ episode }) => {
  return (
    <div className="cinematic-card rounded-xl overflow-hidden group flex flex-col h-full">
      {/* Episode Thumbnail with Play Overlay */}
      <div className="relative aspect-video bg-zinc-900 overflow-hidden">
        <img 
          src={episode.thumbnail_path || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'} 
          alt={episode.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100" 
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#B51D2A] text-white flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
        </div>

        {/* Episode Number Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white px-2.5 py-1 rounded">
          EPISODE {episode.episode_no}
        </div>

        {/* Duration Tag */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-xs text-gray-200 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-[#D6A84F]" />
          {episode.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {episode.guest_name && (
            <div className="text-xs text-[#D6A84F] font-semibold mb-1 flex items-center gap-1">
              <User className="w-3 h-3" /> Special Guest: {episode.guest_name}
            </div>
          )}
          <h3 className="text-base font-bold text-white font-heading line-clamp-2 group-hover:text-[#B51D2A] transition-colors leading-snug mb-2">
            {episode.title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3 mt-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            {episode.publish_date || 'Sept 2026'}
          </span>
          <Link 
            to={`/episodes/${episode.id}`} 
            className="text-[#B51D2A] font-semibold hover:underline flex items-center gap-1"
          >
            Watch Now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
