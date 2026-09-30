<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditionSchedule extends Model
{
    protected $fillable = [
        'audition_application_id',
        'judge_id',
        'scheduled_date',
        'scheduled_time',
        'location',
        'notes',
        'attendance_status'
    ];

    public function application()
    {
        return $this->belongsTo(AuditionApplication::class, 'audition_application_id');
    }

    public function judge()
    {
        return $this->belongsTo(User::class, 'judge_id');
    }
}
