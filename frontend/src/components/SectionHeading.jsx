import React from 'react';

const SectionHeading = ({ title, subtitle, tagline, align = 'center' }) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'}`}>
      {tagline && (
        <span className="inline-block text-xs font-bold text-[#B51D2A] uppercase tracking-widest mb-2">
          {tagline}
        </span>
      )}
      <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight uppercase leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-gray-400 max-w-2xl font-light mx-auto">
          {subtitle}
        </p>
      )}
      <div className={`h-1 w-16 bg-[#B51D2A] mt-4 ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
};

export default SectionHeading;
