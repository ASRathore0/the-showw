<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Performer extends Model
{
    protected $fillable = [
        'name',
        'category',
        'bio',
        'city',
        'experience',
        'photo_path',
        'social_media',
        'status',
        'is_featured'
    ];

    protected $casts = [
        'social_media' => 'array',
        'is_featured' => 'boolean'
    ];

    public function shows()
    {
        return $this->belongsToMany(Show::class, 'show_performers')->withPivot('role');
    }
}
