<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'user_id',
        'transaction_id',
        'payment_method',
        'amount',
        'status',
        'gateway_response'
    ];

    protected $casts = [
        'gateway_response' => 'array'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
