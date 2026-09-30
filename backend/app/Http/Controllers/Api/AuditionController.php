<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Audition;
use App\Models\AuditionApplication;
use Illuminate\Support\Str;

class AuditionController extends Controller
{
    public function index(Request $request)
    {
        $query = Audition::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        $auditions = $query->where('status', 'open')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'auditions' => $auditions
        ]);
    }

    public function show($id)
    {
        $audition = Audition::with('creator')->findOrFail($id);

        return response()->json([
            'success' => true,
            'audition' => $audition
        ]);
    }

    public function apply(Request $request, $id)
    {
        $audition = Audition::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'mobile' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'experience' => 'nullable|string|max:100',
            'languages' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'performance_title' => 'nullable|string|max:255',
            'performance_description' => 'nullable|string',
            'duration' => 'nullable|string|max:50',
            'youtube_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'video' => 'nullable|file|mimes:mp4,mov,avi,mkv|max:51200'
        ]);

        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('auditions/videos', 'public');
        }

        $appNo = 'JPA-' . date('Y') . '-' . strtoupper(Str::random(6));
        $userId = auth()->check() ? auth()->id() : 2; // fallback to demo user ID if guest

        $application = AuditionApplication::create([
            'application_no' => $appNo,
            'user_id' => $userId,
            'audition_id' => $audition->id,
            'full_name' => $validated['full_name'],
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'mobile' => $validated['mobile'],
            'email' => $validated['email'],
            'city' => $validated['city'],
            'state' => $validated['state'],
            'category' => $validated['category'],
            'experience' => $validated['experience'] ?? null,
            'languages' => $validated['languages'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'performance_title' => $validated['performance_title'] ?? null,
            'performance_description' => $validated['performance_description'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'youtube_url' => $validated['youtube_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'video_path' => $videoPath,
            'status' => 'Submitted'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Audition application submitted successfully!',
            'application' => $application
        ], 201);
    }
}
