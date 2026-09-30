<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditionDocument extends Model
{
    protected $fillable = ['audition_application_id', 'title', 'file_path', 'file_type'];

    public function application()
    {
        return $this->belongsTo(AuditionApplication::class, 'audition_application_id');
    }
}
