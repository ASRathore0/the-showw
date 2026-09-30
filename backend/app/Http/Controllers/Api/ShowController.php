<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Show;
use App\Models\TicketCategory;
use App\Models\Seat;

class ShowController extends Controller
{
    public function index(Request $request)
    {
        $query = Show::with(['ticketCategories', 'performers']);

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        $shows = $query->orderBy('show_date', 'asc')->get();

        return response()->json([
            'success' => true,
            'shows' => $shows
        ]);
    }

    public function show($id)
    {
        $show = Show::with(['ticketCategories', 'performers', 'seats'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'show' => $show
        ]);
    }

    public function seats($id)
    {
        $show = Show::findOrFail($id);
        $ticketCategories = TicketCategory::where('show_id', $id)->get();
        $seats = Seat::where('show_id', $id)->orderBy('row')->orderBy('number')->get();

        return response()->json([
            'success' => true,
            'show' => $show,
            'ticket_categories' => $ticketCategories,
            'seats' => $seats
        ]);
    }
}
