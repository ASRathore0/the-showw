<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Episode;

class EpisodeController extends Controller
{
    public function index()
    {
        $episodes = Episode::orderBy('episode_no', 'desc')->get();

        return response()->json([
            'success' => true,
            'episodes' => $episodes
        ]);
    }

    public function show($id)
    {
        $episode = Episode::findOrFail($id);

        return response()->json([
            'success' => true,
            'episode' => $episode
        ]);
    }
}
