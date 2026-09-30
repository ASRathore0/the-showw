<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'booking_id',
        'booking_item_id',
        'ticket_no',
        'qr_code',
        'is_used',
        'checked_in_at'
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'checked_in_at' => 'datetime'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function item()
    {
        return $this->belongsTo(BookingItem::class, 'booking_item_id');
    }
}
