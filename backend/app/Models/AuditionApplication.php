<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditionApplication extends Model
{
    protected $fillable = [
        'application_no',
        'user_id',
        'audition_id',
        'full_name',
        'dob',
        'gender',
        'mobile',
        'email',
        'city',
        'state',
        'category',
        'experience',
        'languages',
        'bio',
        'performance_title',
        'performance_description',
        'duration',
        'youtube_url',
        'instagram_url',
        'video_path',
        'status',
        'overall_score',
        'judge_notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function audition()
    {
        return $this->belongsTo(Audition::class);
    }

    public function documents()
    {
        return $this->hasMany(AuditionDocument::class);
    }

    public function schedule()
    {
        return $this->hasOne(AuditionSchedule::class);
    }

    public function scores()
    {
        return $this->hasMany(AuditionScore::class);
    }
}
