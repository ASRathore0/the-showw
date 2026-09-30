<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditionScore extends Model
{
    protected $fillable = [
        'audition_application_id',
        'judge_id',
        'performance_score',
        'originality_score',
        'stage_presence_score',
        'comedy_score',
        'language_score',
        'total_score',
        'comments'
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
