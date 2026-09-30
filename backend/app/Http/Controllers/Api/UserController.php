<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\AuditionApplication;
use App\Models\ContactMessage;

class UserController extends Controller
{
    public function dashboard(Request $request)
    {
        $userId = $request->user()->id;

        $upcomingBooking = Booking::with(['show', 'items.seat', 'tickets'])
            ->where('user_id', $userId)
            ->where('booking_status', 'confirmed')
            ->orderBy('created_at', 'desc')
            ->first();

        $ticketsCount = Booking::where('user_id', $userId)->sum('total_seats');

        $auditionsCount = AuditionApplication::where('user_id', $userId)->count();

        $recentAuditions = AuditionApplication::with('audition')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'upcoming_booking' => $upcomingBooking,
            'tickets_count' => $ticketsCount,
            'auditions_count' => $auditionsCount,
            'recent_auditions' => $recentAuditions
        ]);
    }

    public function tickets(Request $request)
    {
        $bookings = Booking::with(['show', 'items.seat', 'items.ticketCategory', 'payment', 'tickets'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    public function auditions(Request $request)
    {
        $applications = AuditionApplication::with(['audition', 'schedule', 'scores'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'applications' => $applications
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $contact = ContactMessage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully! Our team will contact you shortly.',
            'contact' => $contact
        ], 201);
    }
}
