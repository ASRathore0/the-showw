<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Show;
use App\Models\Seat;
use App\Models\TicketCategory;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Payment;
use App\Models\Ticket;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'show_id' => 'required|exists:shows,id',
            'seat_ids' => 'required|array|min:1',
            'seat_ids.*' => 'exists:seats,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'payment_method' => 'required|string'
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $show = Show::findOrFail($validated['show_id']);
            $seats = Seat::whereIn('id', $validated['seat_ids'])->where('show_id', $show->id)->get();

            // Check seat availability
            foreach ($seats as $seat) {
                if ($seat->status !== 'available') {
                    return response()->json([
                        'success' => false,
                        'message' => "Seat {$seat->seat_code} is no longer available. Please select another seat."
                    ], 422);
                }
            }

            $totalAmount = $seats->sum('price');
            $bookingNo = 'JPS-' . date('Y') . '-' . sprintf("%06d", rand(1, 999999));
            $userId = auth()->check() ? auth()->id() : 2;

            $booking = Booking::create([
                'booking_no' => $bookingNo,
                'user_id' => $userId,
                'show_id' => $show->id,
                'total_seats' => count($seats),
                'total_amount' => $totalAmount,
                'payment_status' => 'completed',
                'booking_status' => 'confirmed',
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'qr_code' => 'QR-' . $bookingNo
            ]);

            $tickets = [];
            foreach ($seats as $seat) {
                // Mark seat as booked
                $seat->update(['status' => 'booked']);

                // Decrement category available seats
                TicketCategory::where('id', $seat->ticket_category_id)->decrement('available_seats');

                $item = BookingItem::create([
                    'booking_id' => $booking->id,
                    'seat_id' => $seat->id,
                    'ticket_category_id' => $seat->ticket_category_id,
                    'price' => $seat->price,
                    'seat_code' => $seat->seat_code
                ]);

                $ticket = Ticket::create([
                    'booking_id' => $booking->id,
                    'booking_item_id' => $item->id,
                    'ticket_no' => 'TCK-' . $bookingNo . '-' . $seat->seat_code,
                    'qr_code' => 'QR-TCK-' . $seat->seat_code,
                    'is_used' => false
                ]);

                $tickets[] = $ticket;
            }

            // Record Mock Payment
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $userId,
                'transaction_id' => 'TXN_' . strtoupper(bin2hex(random_bytes(6))),
                'payment_method' => $validated['payment_method'],
                'amount' => $totalAmount,
                'status' => 'completed',
                'gateway_response' => [
                    'status' => 'SUCCESS',
                    'gateway' => 'MOCK_PAYMENT_SERVICE',
                    'timestamp' => now()->toIso8601String()
                ]
            ]);

            $booking->load(['show', 'items.seat', 'payment', 'tickets']);

            return response()->json([
                'success' => true,
                'message' => 'Booking created and confirmed successfully!',
                'booking' => $booking
            ], 201);
        });
    }

    public function show($id)
    {
        $booking = Booking::with(['show', 'items.seat', 'items.ticketCategory', 'payment', 'tickets'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'booking' => $booking
        ]);
    }
}
