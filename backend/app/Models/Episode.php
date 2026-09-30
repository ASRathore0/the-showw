<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Episode extends Model
{
    protected $fillable = [
        'episode_no',
        'title',
        'description',
        'guest_name',
        'duration',
        'video_url',
        'thumbnail_path',
        'publish_date',
        'is_featured'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'publish_date' => 'date'
    ];
}
