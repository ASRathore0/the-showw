<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    protected $fillable = [
        'show_id',
        'ticket_category_id',
        'row',
        'number',
        'seat_code',
        'status',
        'price'
    ];

    public function show()
    {
        return $this->belongsTo(Show::class);
    }

    public function ticketCategory()
    {
        return $this->belongsTo(TicketCategory::class);
    }
}
