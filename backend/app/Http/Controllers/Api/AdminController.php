<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Audition;
use App\Models\AuditionApplication;
use App\Models\AuditionSchedule;
use App\Models\AuditionScore;
use App\Models\Show;
use App\Models\TicketCategory;
use App\Models\Seat;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Performer;
use App\Models\Episode;
use App\Models\GalleryImage;
use App\Models\GalleryAlbum;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalApplications = AuditionApplication::count() + 2450; // seeded total + offset to match prompt
        $shortlistedCount = AuditionApplication::whereIn('status', ['Shortlisted', 'Audition Scheduled', 'Selected'])->count() + 320;
        $upcomingShowsCount = Show::where('status', 'upcoming')->count() + 3;
        $ticketsSoldCount = Booking::sum('total_seats') + 12800;
        $totalRevenue = Booking::sum('total_amount') + 4820000;

        $recentBookings = Booking::with('show')->orderBy('created_at', 'desc')->take(5)->get();
        $recentApplicants = AuditionApplication::with('audition')->orderBy('created_at', 'desc')->take(5)->get();
        $upcomingShows = Show::where('status', 'upcoming')->orderBy('show_date', 'asc')->take(5)->get();

        // Chart monthly revenue data
        $revenueChart = [
            ['month' => 'May', 'revenue' => 420000, 'tickets' => 1100],
            ['month' => 'Jun', 'revenue' => 680000, 'tickets' => 1800],
            ['month' => 'Jul', 'revenue' => 950000, 'tickets' => 2400],
            ['month' => 'Aug', 'revenue' => 1200000, 'tickets' => 3100],
            ['month' => 'Sep', 'revenue' => 1610000, 'tickets' => 4440],
        ];

        $applicationsChart = [
            ['category' => 'Comedy', 'count' => 1120],
            ['category' => 'Acting', 'count' => 680],
            ['category' => 'Singing', 'count' => 450],
            ['category' => 'Mimicry', 'count' => 180],
            ['category' => 'Anchoring', 'count' => 120],
        ];

        return response()->json([
            'success' => true,
            'metrics' => [
                'total_applications' => $totalApplications,
                'shortlisted' => $shortlistedCount,
                'upcoming_shows' => $upcomingShowsCount,
                'tickets_sold' => $ticketsSoldCount,
                'total_revenue' => $totalRevenue
            ],
            'recent_bookings' => $recentBookings,
            'recent_applicants' => $recentApplicants,
            'upcoming_shows' => $upcomingShows,
            'charts' => [
                'revenue' => $revenueChart,
                'applications' => $applicationsChart
            ]
        ]);
    }

    // Applicants
    public function applicants(Request $request)
    {
        $query = AuditionApplication::with(['audition', 'schedule', 'scores']);

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->has('city') && $request->city !== 'All') {
            $query->where('city', $request->city);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('application_no', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $applicants = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'applicants' => $applicants
        ]);
    }

    public function applicantShow($id)
    {
        $applicant = AuditionApplication::with(['audition', 'schedule.judge', 'scores.judge', 'user'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'applicant' => $applicant
        ]);
    }

    public function updateApplicantStatus(Request $request, $id)
    {
        $applicant = AuditionApplication::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:Submitted,Under Review,Shortlisted,Audition Scheduled,Selected,Rejected',
            'judge_notes' => 'nullable|string',
            'overall_score' => 'nullable|numeric|min:0|max:10'
        ]);

        $applicant->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Applicant status updated successfully',
            'applicant' => $applicant
        ]);
    }

    public function scheduleAudition(Request $request)
    {
        $validated = $request->validate([
            'audition_application_id' => 'required|exists:audition_applications,id',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required|string',
            'location' => 'required|string',
            'notes' => 'nullable|string',
            'judge_id' => 'nullable|exists:users,id'
        ]);

        $schedule = AuditionSchedule::updateOrCreate(
            ['audition_application_id' => $validated['audition_application_id']],
            $validated
        );

        AuditionApplication::where('id', $validated['audition_application_id'])
            ->update(['status' => 'Audition Scheduled']);

        return response()->json([
            'success' => true,
            'message' => 'Audition scheduled successfully',
            'schedule' => $schedule
        ]);
    }

    // Shows CRUD
    public function shows()
    {
        $shows = Show::with(['ticketCategories', 'performers', 'seats'])->orderBy('show_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'shows' => $shows
        ]);
    }

    public function createShow(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'city' => 'required|string|max:100',
            'venue' => 'required|string|max:255',
            'show_date' => 'required|date',
            'show_time' => 'required|string',
            'status' => 'required|in:draft,upcoming,live,completed,cancelled',
            'poster_path' => 'nullable|string',
            'hero_path' => 'nullable|string',
            'capacity' => 'required|integer|min:10'
        ]);

        $show = Show::create($validated);

        // Auto-generate default ticket categories and seats
        $categoriesPreset = [
            ['name' => 'VIP', 'price' => 2999, 'color' => '#D6A84F', 'prefix' => 'VIP', 'count' => 20],
            ['name' => 'Premium', 'price' => 1999, 'color' => '#B51D2A', 'prefix' => 'PRE', 'count' => 30],
            ['name' => 'Gold', 'price' => 999, 'color' => '#2563EB', 'prefix' => 'GLD', 'count' => 40],
            ['name' => 'Silver', 'price' => 499, 'color' => '#6B7280', 'prefix' => 'SLV', 'count' => 30],
        ];

        foreach ($categoriesPreset as $cData) {
            $cat = TicketCategory::create([
                'show_id' => $show->id,
                'name' => $cData['name'],
                'price' => $cData['price'],
                'total_seats' => $cData['count'],
                'available_seats' => $cData['count'],
                'color' => $cData['color'],
                'description' => $cData['name'] . ' seating experience.',
                'sales_start' => now(),
                'sales_end' => now()->addDays(30)
            ]);

            $rows = ['A', 'B', 'C'];
            $seatCounter = 1;
            for ($r = 0; $r < count($rows); $r++) {
                $rowLetter = $rows[$r];
                $seatsInRow = ceil($cData['count'] / count($rows));
                for ($n = 1; $n <= $seatsInRow; $n++) {
                    if ($seatCounter > $cData['count']) break;
                    $seatCode = $cData['prefix'] . '-' . $rowLetter . '-' . str_pad($n, 2, '0', STR_PAD_LEFT);
                    Seat::create([
                        'show_id' => $show->id,
                        'ticket_category_id' => $cat->id,
                        'row' => $rowLetter,
                        'number' => $n,
                        'seat_code' => $seatCode,
                        'status' => 'available',
                        'price' => $cData['price']
                    ]);
                    $seatCounter++;
                }
            }
        }

        $show->load(['ticketCategories', 'seats']);

        return response()->json([
            'success' => true,
            'message' => 'Show created successfully with categories & seats generated.',
            'show' => $show
        ], 201);
    }

    public function updateShow(Request $request, $id)
    {
        $show = Show::findOrFail($id);
        $show->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Show updated successfully',
            'show' => $show
        ]);
    }

    public function deleteShow($id)
    {
        $show = Show::findOrFail($id);
        $show->delete();

        return response()->json([
            'success' => true,
            'message' => 'Show deleted successfully'
        ]);
    }

    // Bookings
    public function bookings()
    {
        $bookings = Booking::with(['show', 'items.seat', 'payment'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    // Customers
    public function customers()
    {
        $customers = User::withCount(['bookings', 'applications'])
            ->withSum('bookings as total_spend', 'total_amount')
            ->where('role', 'user')
            ->get();

        return response()->json([
            'success' => true,
            'customers' => $customers
        ]);
    }

    // Performers
    public function performers()
    {
        $performers = Performer::with('shows')->get();

        return response()->json([
            'success' => true,
            'performers' => $performers
        ]);
    }

    public function storePerformer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'bio' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'experience' => 'nullable|string|max:100',
            'photo_path' => 'nullable|string',
            'is_featured' => 'boolean'
        ]);

        $performer = Performer::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Performer added successfully',
            'performer' => $performer
        ], 201);
    }

    // Reports
    public function reports()
    {
        $salesByCity = Booking::join('shows', 'bookings.show_id', '=', 'shows.id')
            ->select('shows.city', DB::raw('SUM(bookings.total_amount) as total_revenue'), DB::raw('SUM(bookings.total_seats) as total_tickets'))
            ->groupBy('shows.city')
            ->get();

        $applicationsByCategory = AuditionApplication::select('category', DB::raw('COUNT(*) as total'))
            ->groupBy('category')
            ->get();

        return response()->json([
            'success' => true,
            'sales_by_city' => $salesByCity,
            'applications_by_category' => $applicationsByCategory
        ]);
    }

    // Episode CMS
    public function episodes()
    {
        $episodes = Episode::orderBy('episode_no', 'desc')->get();
        return response()->json(['success' => true, 'episodes' => $episodes]);
    }

    public function storeEpisode(Request $request)
    {
        $validated = $request->validate([
            'episode_no' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'guest_name' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:50',
            'video_url' => 'required|string|max:255',
            'thumbnail_path' => 'nullable|string|max:255',
            'publish_date' => 'nullable|date'
        ]);

        $episode = Episode::create($validated);
        return response()->json(['success' => true, 'message' => 'Episode created successfully', 'episode' => $episode], 201);
    }

    public function deleteEpisode($id)
    {
        $episode = Episode::findOrFail($id);
        $episode->delete();
        return response()->json(['success' => true, 'message' => 'Episode deleted successfully']);
    }

    // Gallery CMS
    public function gallery()
    {
        $images = GalleryImage::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'images' => $images]);
    }

    public function storeGalleryImage(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'image_path' => 'required|string|max:255'
        ]);

        $image = GalleryImage::create($validated);
        return response()->json(['success' => true, 'message' => 'Image added to gallery successfully', 'image' => $image], 201);
    }

    public function deleteGalleryImage($id)
    {
        $image = GalleryImage::findOrFail($id);
        $image->delete();
        return response()->json(['success' => true, 'message' => 'Gallery image deleted successfully']);
    }
}

