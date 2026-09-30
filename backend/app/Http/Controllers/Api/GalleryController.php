<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GalleryAlbum;
use App\Models\GalleryImage;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryImage::with('album');

        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        $images = $query->orderBy('created_at', 'desc')->get();
        $albums = GalleryAlbum::withCount('images')->get();

        return response()->json([
            'success' => true,
            'images' => $images,
            'albums' => $albums
        ]);
    }
}
