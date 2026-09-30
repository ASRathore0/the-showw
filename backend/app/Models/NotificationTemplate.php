<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    protected $fillable = ['name', 'code', 'subject', 'body_template', 'channel'];
}
