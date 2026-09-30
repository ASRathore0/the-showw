<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryAlbum extends Model
{
    protected $fillable = ['title', 'category', 'description', 'cover_image'];

    public function images()
    {
        return $this->hasMany(GalleryImage::class);
    }
}
