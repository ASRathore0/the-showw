<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketCategory extends Model
{
    protected $fillable = [
        'show_id',
        'name',
        'price',
        'total_seats',
        'available_seats',
        'color',
        'description',
        'sales_start',
        'sales_end'
    ];

    public function show()
    {
        return $this->belongsTo(Show::class);
    }

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }
}
