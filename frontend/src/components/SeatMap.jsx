import React from 'react';
import { Armchair, CheckCircle2, AlertCircle } from 'lucide-react';

const SeatMap = ({ seats, categories, selectedSeatIds, onToggleSeat }) => {
  // Group seats by Category / Row
  const seatsByCategory = categories.map(cat => {
    const categorySeats = seats.filter(s => s.ticket_category_id === cat.id);
    const rows = [...new Set(categorySeats.map(s => s.row))];
    return {
      category: cat,
      rows: rows.map(r => ({
        rowLetter: r,
        rowSeats: categorySeats.filter(s => s.row === r).sort((a,b) => a.number - b.number)
      }))
    };
  });

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
      
      {/* Legend & Categories Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-gray-500 bg-zinc-800 flex items-center justify-center text-[10px] text-gray-400">A1</div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#B51D2A] text-white flex items-center justify-center text-[10px]">A1</div>
            <span className="font-semibold text-white">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-700 opacity-40 flex items-center justify-center text-[10px] text-gray-600">X</div>
            <span className="text-gray-500">Booked</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="font-semibold text-white">{cat.name}:</span>
              <span className="text-[#D6A84F]">₹{cat.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Visual Indicator */}
      <div className="w-full mb-12 flex flex-col items-center">
        <div className="w-3/4 max-w-xl h-8 bg-gradient-to-b from-[#B51D2A]/30 to-transparent border-t-2 border-[#B51D2A] rounded-t-full flex items-center justify-center text-xs font-bold text-gray-300 uppercase tracking-widest">
          STAGE / PERFORMER AREA
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">All Eyes This Way</div>
      </div>

      {/* Grid of Seats grouped by Categories & Rows */}
      <div className="space-y-8 max-w-4xl mx-auto overflow-x-auto pb-4">
        {seatsByCategory.map(({ category, rows }) => (
          <div key={category.id} className="space-y-4">
            {/* Category Banner */}
            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-gray-300 border-b border-white/5 pb-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span>{category.name} Section - ₹{category.price}</span>
            </div>

            {/* Row Layout */}
            {rows.map(({ rowLetter, rowSeats }) => (
              <div key={rowLetter} className="flex items-center justify-center gap-3 min-w-[500px]">
                <div className="w-8 text-center text-xs font-bold text-gray-500">
                  {rowLetter}
                </div>

                <div className="flex items-center gap-2">
                  {rowSeats.map(seat => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isBooked = seat.status === 'booked';

                    return (
                      <button
                        key={seat.id}
                        disabled={isBooked}
                        onClick={() => onToggleSeat(seat)}
                        className={`w-9 h-9 rounded-md text-xs font-semibold flex flex-col items-center justify-center transition-all duration-200 ${
                          isBooked 
                            ? 'bg-zinc-900 border border-zinc-800 text-zinc-700 cursor-not-allowed opacity-50' 
                            : isSelected 
                              ? 'bg-[#B51D2A] text-white border-2 border-white shadow-lg scale-105' 
                              : 'bg-zinc-800 border border-zinc-700 text-gray-300 hover:border-[#B51D2A] hover:bg-zinc-700'
                        }`}
                        title={`${seat.seat_code} - ₹${seat.price} (${seat.status})`}
                      >
                        <span>{seat.number}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="w-8 text-center text-xs font-bold text-gray-500">
                  {rowLetter}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default SeatMap;
