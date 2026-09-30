<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Performer;
use App\Models\Audition;
use App\Models\AuditionApplication;
use App\Models\AuditionSchedule;
use App\Models\AuditionScore;
use App\Models\Show;
use App\Models\TicketCategory;
use App\Models\Seat;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Payment;
use App\Models\Ticket;
use App\Models\Episode;
use App\Models\GalleryAlbum;
use App\Models\GalleryImage;
use App\Models\NotificationTemplate;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $adminRole = Role::create([
            'name' => 'admin',
            'display_name' => 'Super Administrator',
            'description' => 'Full control over the platform'
        ]);

        $userRole = Role::create([
            'name' => 'user',
            'display_name' => 'Audience / Applicant',
            'description' => 'Public user account'
        ]);

        $judgeRole = Role::create([
            'name' => 'judge',
            'display_name' => 'Audition Judge',
            'description' => 'Can review and score audition applications'
        ]);

        // 2. Users
        $admin = User::create([
            'name' => 'JP Yadav Admin',
            'email' => 'admin@example.com',
            'phone' => '+91 9876543210',
            'city' => 'Patna',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
            'role' => 'admin',
            'status' => 'active',
            'password' => Hash::make('password')
        ]);
        $admin->roles()->attach($adminRole);

        $demoUser = User::create([
            'name' => 'Rahul Sharma',
            'email' => 'demo@example.com',
            'phone' => '+91 9123456789',
            'city' => 'Varanasi',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
            'role' => 'user',
            'status' => 'active',
            'password' => Hash::make('password')
        ]);
        $demoUser->roles()->attach($userRole);

        $judge = User::create([
            'name' => 'Pankaj Tripathi (Guest Judge)',
            'email' => 'judge@example.com',
            'phone' => '+91 9988776655',
            'city' => 'Lucknow',
            'role' => 'judge',
            'status' => 'active',
            'password' => Hash::make('password')
        ]);
        $judge->roles()->attach($judgeRole);

        // 3. Performers
        $performersData = [
            [
                'name' => 'JP Yadav',
                'category' => 'Host & Comedy Lead',
                'bio' => 'The face of Bhojpuri comedy entertainment, renowned for sharp observational humor and audience connect.',
                'city' => 'Patna',
                'experience' => '12+ Years',
                'photo_path' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500',
                'is_featured' => true,
                'social_media' => ['youtube' => 'https://youtube.com', 'instagram' => 'https://instagram.com']
            ],
            [
                'name' => 'Mani Bhattacharya',
                'category' => 'Special Guest Artist',
                'bio' => 'Celebrated actress and performer featured in top Bhojpuri blockbuster comedy episodes.',
                'city' => 'Kolkata',
                'experience' => '8+ Years',
                'photo_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500',
                'is_featured' => true,
                'social_media' => ['instagram' => 'https://instagram.com']
            ],
            [
                'name' => 'Khushi Kakkar',
                'category' => 'Singer & Performer',
                'bio' => 'Versatile playback singer known for high-energy live music and theatrical performances.',
                'city' => 'Varanasi',
                'experience' => '6+ Years',
                'photo_path' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=500',
                'is_featured' => true,
                'social_media' => ['youtube' => 'https://youtube.com']
            ],
            [
                'name' => 'Ajeet Aanand',
                'category' => 'Mimicry & Stand-up',
                'bio' => 'Master of voice modulations, celebrity mimicry, and side-splitting comedy sketches.',
                'city' => 'Gorakhpur',
                'experience' => '7+ Years',
                'photo_path' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500',
                'is_featured' => false,
                'social_media' => []
            ],
            [
                'name' => 'Shivesh Mishra',
                'category' => 'Musical Comedy Lead',
                'bio' => 'Harmonium maestro combining classical rhythms with hilarious theatrical banter.',
                'city' => 'Buxar',
                'experience' => '10+ Years',
                'photo_path' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=500',
                'is_featured' => true,
                'social_media' => []
            ]
        ];

        $createdPerformers = [];
        foreach ($performersData as $p) {
            $createdPerformers[] = Performer::create($p);
        }

        // 4. Auditions
        $auditionsData = [
            [
                'title' => 'Bhojpuri Comedy Hunt 2026 - Season 3',
                'category' => 'Comedy',
                'description' => 'Showcase your stand-up, funny anecdotes, and comedic stage timing. Winner gets featured in Episode 25 of The JP Yadav Show!',
                'requirements' => '2 to 3 minutes solo performance video. Must be in Bhojpuri, Hindi, or Maithili.',
                'start_date' => '2026-10-01',
                'end_date' => '2026-11-15',
                'city' => 'Patna',
                'venue' => 'Bhartiya Nritya Kala Mandir, Patna',
                'status' => 'open',
                'max_applicants' => 500,
                'created_by' => $admin->id
            ],
            [
                'title' => 'Bhojpuri Acting & Character Drama Auditions',
                'category' => 'Acting',
                'description' => 'Looking for theatrical actors for upcoming live stage comedy dramas and TV episodes.',
                'requirements' => '1 monologues script provided or original performance.',
                'start_date' => '2026-10-05',
                'end_date' => '2026-11-20',
                'city' => 'Lucknow',
                'venue' => 'Sangeet Natak Akademi, Lucknow',
                'status' => 'open',
                'max_applicants' => 300,
                'created_by' => $admin->id
            ],
            [
                'title' => 'Voice Mimicry & Parody Talent Search',
                'category' => 'Mimicry',
                'description' => 'Do you sound like famous politicians or movie stars? Show your voice magic on our big stage!',
                'requirements' => 'Minimum 3 distinct voice imitations within 2 minutes.',
                'start_date' => '2026-10-10',
                'end_date' => '2026-11-25',
                'city' => 'Varanasi',
                'venue' => 'Town Hall Auditorium, Varanasi',
                'status' => 'open',
                'max_applicants' => 200,
                'created_by' => $admin->id
            ],
            [
                'title' => 'Folk & Pop Vocal Audition Patna',
                'category' => 'Singing',
                'description' => 'Singers who can blend traditional folk notes with modern show entertainment.',
                'requirements' => 'Clean vocal track audio/video recording without auto-tune.',
                'start_date' => '2026-09-15',
                'end_date' => '2026-10-30',
                'city' => 'Patna',
                'venue' => 'Mona Cinema Hall Complex, Patna',
                'status' => 'open',
                'max_applicants' => 400,
                'created_by' => $admin->id
            ],
            [
                'title' => 'Stage Anchoring & Co-Host Hunt',
                'category' => 'Anchoring',
                'description' => 'Seeking dynamic, witty live event hosts with quick stage responses and charming personality.',
                'requirements' => 'Host intro pitch video (60-90 seconds).',
                'start_date' => '2026-10-15',
                'end_date' => '2026-12-01',
                'city' => 'Delhi',
                'venue' => 'Kamani Auditorium, New Delhi',
                'status' => 'open',
                'max_applicants' => 250,
                'created_by' => $admin->id
            ]
        ];

        $createdAuditions = [];
        foreach ($auditionsData as $a) {
            $createdAuditions[] = Audition::create($a);
        }

        // 5. Seed Applications for Auditions
        $applicantNames = [
            'Amit Kumar', 'Ritu Raj', 'Suresh Pandey', 'Pooja Verma', 'Vikas Ojha',
            'Manish Tiwari', 'Sneha Singh', 'Rohan Gupta', 'Kavita Rai', 'Deepak Yadav',
            'Sunil Kumar', 'Anjali Srivastava', 'Pankaj Mishra', 'Divya Bharti', 'Ravi Prakash',
            'Sanjay Yadav', 'Neelam Devi', 'Alok Ranjan', 'Megha Upadhyay', 'Abhinav Singh',
            'Rajesh Pathak', 'Sonam Kumari', 'Kundan Kumar', 'Sarita Sinha', 'Nitin Dubey',
            'Bikram Prasad', 'Geeta Chaurasia', 'Tarun Bhatt', 'Shweta Jha', 'Prem Chand'
        ];

        $categories = ['Comedy', 'Acting', 'Singing', 'Mimicry', 'Anchoring'];
        $statuses = ['Submitted', 'Under Review', 'Shortlisted', 'Audition Scheduled', 'Selected', 'Rejected'];

        foreach ($applicantNames as $idx => $name) {
            $audition = $createdAuditions[$idx % count($createdAuditions)];
            $appNo = 'JPA-' . (2026000 + $idx + 1);
            $status = $statuses[$idx % count($statuses)];
            $score = rand(65, 98) / 10;

            $app = AuditionApplication::create([
                'application_no' => $appNo,
                'user_id' => $demoUser->id,
                'audition_id' => $audition->id,
                'full_name' => $name,
                'dob' => '1998-05-15',
                'gender' => $idx % 2 == 0 ? 'Male' : 'Female',
                'mobile' => '+91 98765' . str_pad($idx, 5, '0', STR_PAD_LEFT),
                'email' => strtolower(str_replace(' ', '.', $name)) . '@example.com',
                'city' => $audition->city,
                'state' => 'Bihar',
                'category' => $audition->category,
                'experience' => (2 + ($idx % 5)) . ' Years',
                'languages' => 'Bhojpuri, Hindi',
                'bio' => 'Passionate performer performing live comedy acts and stage theater since college days.',
                'performance_title' => 'Gramin Panchayat Standup Comedy Act',
                'performance_description' => 'A hilarious take on village life, weddings, and local gossip.',
                'duration' => '3 mins',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'instagram_url' => 'https://instagram.com/performer',
                'status' => $status,
                'overall_score' => $score,
                'judge_notes' => 'Great voice control and stage presence. Sharp punchlines.'
            ]);

            if ($status === 'Audition Scheduled' || $status === 'Shortlisted') {
                AuditionSchedule::create([
                    'audition_application_id' => $app->id,
                    'judge_id' => $judge->id,
                    'scheduled_date' => '2026-10-18',
                    'scheduled_time' => '11:00 AM',
                    'location' => $audition->venue,
                    'notes' => 'Bring original photo ID and performance track CD/USB.',
                    'attendance_status' => 'scheduled'
                ]);

                AuditionScore::create([
                    'audition_application_id' => $app->id,
                    'judge_id' => $judge->id,
                    'performance_score' => 9,
                    'originality_score' => 8,
                    'stage_presence_score' => 9,
                    'comedy_score' => 9,
                    'language_score' => 8,
                    'total_score' => $score,
                    'comments' => 'Clear accent, energetic presentation. Recommended for final round.'
                ]);
            }
        }

        // 6. Live Shows
        $showsData = [
            [
                'title' => 'The JP Yadav Show Live - Patna Grand Gala',
                'description' => 'Experience the biggest live Bhojpuri comedy & musical spectacle in Patna! Special celebrity guest appearances, non-stop laughter, and interactive audience seats.',
                'city' => 'Patna',
                'venue' => 'SK Memorial Hall, Gandhi Maidan, Patna',
                'show_date' => '2026-10-12',
                'show_time' => '07:00 PM',
                'status' => 'upcoming',
                'poster_path' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
                'hero_path' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
                'capacity' => 120,
                'is_featured' => true
            ],
            [
                'title' => 'The JP Yadav Show - Varanasi Cultural Dhamaka',
                'description' => 'A magical evening of comedy and folk musical banter along the banks of the Ganges.',
                'city' => 'Varanasi',
                'venue' => 'International Cooperation & Convention Centre (Rudraksh), Varanasi',
                'show_date' => '2026-10-25',
                'show_time' => '06:30 PM',
                'status' => 'upcoming',
                'poster_path' => 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
                'hero_path' => 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200',
                'capacity' => 100,
                'is_featured' => true
            ],
            [
                'title' => 'The JP Yadav Show - Lucknow Comedy Extravaganza',
                'description' => 'Nawabi shaan meets Bhojpuri laughter! Join JP Yadav and star performers live in Lucknow.',
                'city' => 'Lucknow',
                'venue' => 'Indira Gandhi Pratishthan, Gomti Nagar, Lucknow',
                'show_date' => '2026-11-08',
                'show_time' => '07:00 PM',
                'status' => 'upcoming',
                'poster_path' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
                'hero_path' => 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=1200',
                'capacity' => 100,
                'is_featured' => true
            ],
            [
                'title' => 'The JP Yadav Show - Delhi Capital Edition',
                'description' => 'Connecting Purvanchal to the National Capital with a packed stadium laughter riot.',
                'city' => 'Delhi',
                'venue' => 'Talkatora Indoor Stadium, New Delhi',
                'show_date' => '2026-11-22',
                'show_time' => '06:00 PM',
                'status' => 'upcoming',
                'poster_path' => 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800',
                'hero_path' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
                'capacity' => 100,
                'is_featured' => false
            ],
            [
                'title' => 'The JP Yadav Show - Mumbai Star Special',
                'description' => 'Bhojpuri film stars and JP Yadav ensemble perform live at Shanmukhananda Hall.',
                'city' => 'Mumbai',
                'venue' => 'Shanmukhananda Hall, Sion, Mumbai',
                'show_date' => '2026-12-10',
                'show_time' => '07:30 PM',
                'status' => 'upcoming',
                'poster_path' => 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800',
                'hero_path' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
                'capacity' => 100,
                'is_featured' => false
            ]
        ];

        $categoriesPreset = [
            ['name' => 'VIP', 'price' => 2999, 'color' => '#D6A84F', 'prefix' => 'VIP', 'count' => 20],
            ['name' => 'Premium', 'price' => 1999, 'color' => '#B51D2A', 'prefix' => 'PRE', 'count' => 30],
            ['name' => 'Gold', 'price' => 999, 'color' => '#2563EB', 'prefix' => 'GLD', 'count' => 40],
            ['name' => 'Silver', 'price' => 499, 'color' => '#6B7280', 'prefix' => 'SLV', 'count' => 30],
        ];

        foreach ($showsData as $sIndex => $sData) {
            $show = Show::create($sData);

            // Attach performers
            foreach ($createdPerformers as $perf) {
                $show->performers()->attach($perf->id, ['role' => $perf->category]);
            }

            // Create Ticket Categories & Seats
            foreach ($categoriesPreset as $cData) {
                $cat = TicketCategory::create([
                    'show_id' => $show->id,
                    'name' => $cData['name'],
                    'price' => $cData['price'],
                    'total_seats' => $cData['count'],
                    'available_seats' => $cData['count'],
                    'color' => $cData['color'],
                    'description' => $cData['name'] . ' seating with premium stage view and complimentary refreshments.',
                    'sales_start' => now(),
                    'sales_end' => now()->addDays(30)
                ]);

                // Create individual seats
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

            // Create 4 Demo Bookings for first 2 shows
            if ($sIndex < 2) {
                $vipCat = $show->ticketCategories()->where('name', 'VIP')->first();
                $availSeats = Seat::where('show_id', $show->id)->where('ticket_category_id', $vipCat->id)->where('status', 'available')->take(2)->get();
                
                if ($availSeats->count() === 2) {
                    $bookingNo = 'JPS-2026-' . (100100 + $sIndex);
                    $totalAmt = $vipCat->price * 2;

                    $booking = Booking::create([
                        'booking_no' => $bookingNo,
                        'user_id' => $demoUser->id,
                        'show_id' => $show->id,
                        'total_seats' => 2,
                        'total_amount' => $totalAmt,
                        'payment_status' => 'completed',
                        'booking_status' => 'confirmed',
                        'customer_name' => $demoUser->name,
                        'customer_email' => $demoUser->email,
                        'customer_phone' => $demoUser->phone,
                        'qr_code' => 'QR-' . $bookingNo
                    ]);

                    foreach ($availSeats as $seat) {
                        $seat->update(['status' => 'booked']);
                        $item = BookingItem::create([
                            'booking_id' => $booking->id,
                            'seat_id' => $seat->id,
                            'ticket_category_id' => $vipCat->id,
                            'price' => $seat->price,
                            'seat_code' => $seat->seat_code
                        ]);

                        Ticket::create([
                            'booking_id' => $booking->id,
                            'booking_item_id' => $item->id,
                            'ticket_no' => 'TCK-' . $bookingNo . '-' . $seat->seat_code,
                            'qr_code' => 'QR-TCK-' . $seat->seat_code,
                            'is_used' => false
                        ]);
                    }

                    Payment::create([
                        'booking_id' => $booking->id,
                        'user_id' => $demoUser->id,
                        'transaction_id' => 'TXN_' . strtoupper(bin2hex(random_bytes(6))),
                        'payment_method' => 'UPI',
                        'amount' => $totalAmt,
                        'status' => 'completed',
                        'gateway_response' => ['status' => 'SUCCESS', 'gateway' => 'MOCK_RAZORPAY']
                    ]);

                    $vipCat->decrement('available_seats', 2);
                }
            }
        }

        // 7. Episodes
        $episodesData = [
            [
                'episode_no' => 18,
                'title' => 'The JP Yadav Show - Episode 18 ft. Shivesh Mishra & Special Comedy Ensemble',
                'description' => 'Musical laughter riot with Shivesh Mishra, Panchayati banter, and special guest acts.',
                'guest_name' => 'Shivesh Mishra',
                'duration' => '54:46',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
                'publish_date' => '2026-09-20',
                'is_featured' => true
            ],
            [
                'episode_no' => 17,
                'title' => 'The JP Yadav Show - Episode 17 ft. Anupama Yadav & Neha Nishtha',
                'description' => 'Double entertainment special with Anupama Yadav and Neha Nishtha live on stage.',
                'guest_name' => 'Anupama Yadav & Neha Nishtha',
                'duration' => '1:11:26',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
                'publish_date' => '2026-09-12',
                'is_featured' => true
            ],
            [
                'episode_no' => 16,
                'title' => 'The JP Yadav Show - Episode 16 ft. Khushi Kakkar & Ajeet Aanand',
                'description' => 'Voice mimicry extravaganza and classical vocal showdown.',
                'guest_name' => 'Khushi Kakkar & Ajeet Aanand',
                'duration' => '1:08:11',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600',
                'publish_date' => '2026-09-05',
                'is_featured' => true
            ],
            [
                'episode_no' => 14,
                'title' => 'The JP Yadav Show - Episode 14 Season 2 Grand Finale ft. Mani Bhattacharya',
                'description' => 'Season 2 blockbuster finale featuring actress Mani Bhattacharya and top comedy talent.',
                'guest_name' => 'Mani Bhattacharya',
                'duration' => '1:04:09',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',
                'publish_date' => '2026-08-28',
                'is_featured' => true
            ]
        ];

        foreach ($episodesData as $ep) {
            Episode::create($ep);
        }

        // 8. Gallery Albums & Images
        $album = GalleryAlbum::create([
            'title' => 'Live Shows & Stage Moments 2026',
            'category' => 'Shows',
            'description' => 'Unforgettable moments captured during live shows across Bihar and UP.',
            'cover_image' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'
        ]);

        $galleryPhotos = [
            ['title' => 'JP Yadav Grand Opening Act', 'image_path' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800', 'category' => 'Shows'],
            ['title' => 'Full House Audience Patna', 'image_path' => 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', 'category' => 'Audience'],
            ['title' => 'Audition Shortlist Celebrations', 'image_path' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', 'category' => 'Auditions'],
            ['title' => 'Behind The Scenes Green Room', 'image_path' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800', 'category' => 'Behind The Scenes'],
            ['title' => 'Musical Ensemble Live', 'image_path' => 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800', 'category' => 'Shows'],
            ['title' => 'Audience Laughs & Cheers', 'image_path' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800', 'category' => 'Audience']
        ];

        foreach ($galleryPhotos as $g) {
            GalleryImage::create([
                'gallery_album_id' => $album->id,
                'title' => $g['title'],
                'image_path' => $g['image_path'],
                'category' => $g['category'],
                'is_featured' => true
            ]);
        }

        // 9. Notification Templates
        NotificationTemplate::create([
            'name' => 'Audition Submitted',
            'code' => 'AUDITION_SUBMITTED',
            'subject' => 'Application Received - The JP Yadav Show Auditions',
            'body_template' => 'Dear {{name}}, your application {{application_no}} for {{category}} has been submitted successfully.',
            'channel' => 'email'
        ]);

        NotificationTemplate::create([
            'name' => 'Ticket Booking Confirmed',
            'code' => 'TICKET_CONFIRMED',
            'subject' => 'Your Tickets Are Confirmed! - The JP Yadav Show',
            'body_template' => 'Hi {{name}}, your booking {{booking_no}} for {{show_title}} on {{date}} at {{venue}} is confirmed.',
            'channel' => 'email'
        ]);

        // 10. Settings
        $settingsData = [
            ['key' => 'site_title', 'value' => 'THE JP YADAV SHOW', 'group' => 'general'],
            ['key' => 'logo_url', 'value' => '/assets/images/jp-yadav-show-logo.png', 'group' => 'branding'],
            ['key' => 'support_phone', 'value' => '+91 9876543210', 'group' => 'contact'],
            ['key' => 'support_email', 'value' => 'contact@jpyadavshow.com', 'group' => 'contact'],

            // Hero Section Settings
            ['key' => 'hero_title', 'value' => 'THE JP YADAV SHOW', 'group' => 'hero'],
            ['key' => 'hero_tagline', 'value' => 'जहाँ हँसी भी है, हुनर भी है।', 'group' => 'hero'],
            ['key' => 'hero_subtitle', 'value' => 'Comedy. Talent. Stories. Live Entertainment.', 'group' => 'hero'],
            ['key' => 'hero_video_url', 'value' => '/assets/videos/jp-yadav-show-hero.mp4', 'group' => 'hero'],
            ['key' => 'hero_next_city', 'value' => 'Patna', 'group' => 'hero'],
            ['key' => 'hero_next_date', 'value' => '12 October 2026', 'group' => 'hero'],
            ['key' => 'hero_next_time', 'value' => '7:00 PM', 'group' => 'hero'],

            // About Section Settings
            ['key' => 'about_tagline', 'value' => 'MORE THAN A SHOW', 'group' => 'about'],
            ['key' => 'about_heading', 'value' => 'WHERE COMEDY MEETS REAL TALENT', 'group' => 'about'],
            ['key' => 'about_quote', 'value' => '"The JP Yadav Show brings together comedy, conversations, music, talent and unforgettable live experiences."', 'group' => 'about'],
            ['key' => 'about_p1', 'value' => 'Designed as a premier OTT and live entertainment platform, we celebrate the vibrant spirit of Bhojpuri culture through top-tier standup, mimicry, storytelling, and musical performances.', 'group' => 'about'],
            ['key' => 'about_p2', 'value' => 'Whether performing before packed auditoriums in Patna, Varanasi, Lucknow, and Delhi or reaching millions across OTT and video streaming, our mission is simple: inspire laughter, foster genuine talent, and elevate Bhojpuri performance art.', 'group' => 'about'],
            ['key' => 'about_image_url', 'value' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000', 'group' => 'about'],

            // Experience Pillars Settings
            ['key' => 'pillar1_title', 'value' => 'Comedy', 'group' => 'experience'],
            ['key' => 'pillar1_desc', 'value' => 'Observational stand-up and punchy rural panchayat acts.', 'group' => 'experience'],
            ['key' => 'pillar1_image', 'value' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600', 'group' => 'experience'],

            ['key' => 'pillar2_title', 'value' => 'Talent', 'group' => 'experience'],
            ['key' => 'pillar2_desc', 'value' => 'Discovering mimicry artists, poets, and actors.', 'group' => 'experience'],
            ['key' => 'pillar2_image', 'value' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600', 'group' => 'experience'],

            ['key' => 'pillar3_title', 'value' => 'Music', 'group' => 'experience'],
            ['key' => 'pillar3_desc', 'value' => 'High-octane folk tracks and acoustic ensemble solos.', 'group' => 'experience'],
            ['key' => 'pillar3_image', 'value' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600', 'group' => 'experience'],

            ['key' => 'pillar4_title', 'value' => 'Live Audience', 'group' => 'experience'],
            ['key' => 'pillar4_desc', 'value' => 'Unfiltered cheer, applause, and interactive stage seats.', 'group' => 'experience'],
            ['key' => 'pillar4_image', 'value' => 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600', 'group' => 'experience'],
        ];

        foreach ($settingsData as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }
    }
}

