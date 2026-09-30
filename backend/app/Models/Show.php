<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    protected $fillable = [
        'title',
        'description',
        'city',
        'venue',
        'show_date',
        'show_time',
        'status',
        'poster_path',
        'hero_path',
        'capacity',
        'is_featured'
    ];

    protected $casts = [
        'is_featured' => 'boolean'
    ];

    public function ticketCategories()
    {
        return $this->hasMany(TicketCategory::class);
    }

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function performers()
    {
        return $this->belongsToMany(Performer::class, 'show_performers')->withPivot('role');
    }
}
