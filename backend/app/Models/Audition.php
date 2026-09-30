<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audition extends Model
{
    protected $fillable = [
        'title',
        'category',
        'description',
        'requirements',
        'start_date',
        'end_date',
        'city',
        'venue',
        'status',
        'max_applicants',
        'created_by'
    ];

    public function applications()
    {
        return $this->hasMany(AuditionApplication::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
