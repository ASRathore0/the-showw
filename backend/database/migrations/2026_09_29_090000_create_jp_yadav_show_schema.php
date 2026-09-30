<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Roles & Permissions
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->string('group')->default('general');
            $table->timestamps();
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->primary(['role_id', 'user_id']);
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->primary(['permission_id', 'role_id']);
        });

        // Extend Users table columns if needed via schema modification
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('city')->nullable()->after('phone');
            $table->string('avatar')->nullable()->after('city');
            $table->string('role')->default('user')->after('avatar');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('role');
        });

        // 2. Performers
        Schema::create('performers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // Comedy, Acting, Singing, Mimicry, Anchoring, etc.
            $table->text('bio')->nullable();
            $table->string('city')->nullable();
            $table->string('experience')->nullable();
            $table->string('photo_path')->nullable();
            $table->json('social_media')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // 3. Auditions & Applications
        Schema::create('auditions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('city');
            $table->string('venue')->nullable();
            $table->enum('status', ['draft', 'open', 'closed', 'completed'])->default('open');
            $table->integer('max_applicants')->default(500);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('audition_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_no')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('audition_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->date('dob')->nullable();
            $table->string('gender')->nullable();
            $table->string('mobile');
            $table->string('email');
            $table->string('city');
            $table->string('state');
            $table->string('category');
            $table->string('experience')->nullable();
            $table->string('languages')->nullable();
            $table->text('bio')->nullable();
            $table->string('performance_title')->nullable();
            $table->text('performance_description')->nullable();
            $table->string('duration')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('video_path')->nullable();
            $table->enum('status', ['Submitted', 'Under Review', 'Shortlisted', 'Audition Scheduled', 'Selected', 'Rejected'])->default('Submitted');
            $table->decimal('overall_score', 4, 2)->nullable();
            $table->text('judge_notes')->nullable();
            $table->timestamps();
        });

        Schema::create('audition_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audition_application_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('file_path');
            $table->string('file_type')->nullable();
            $table->timestamps();
        });

        Schema::create('audition_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audition_application_id')->constrained()->onDelete('cascade');
            $table->foreignId('judge_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('scheduled_date');
            $table->string('scheduled_time');
            $table->string('location');
            $table->text('notes')->nullable();
            $table->enum('attendance_status', ['scheduled', 'present', 'absent', 'rescheduled'])->default('scheduled');
            $table->timestamps();
        });

        Schema::create('audition_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audition_application_id')->constrained()->onDelete('cascade');
            $table->foreignId('judge_id')->constrained('users')->onDelete('cascade');
            $table->integer('performance_score')->default(0); // 1-10
            $table->integer('originality_score')->default(0); // 1-10
            $table->integer('stage_presence_score')->default(0); // 1-10
            $table->integer('comedy_score')->default(0); // 1-10
            $table->integer('language_score')->default(0); // 1-10
            $table->decimal('total_score', 4, 2)->default(0);
            $table->text('comments')->nullable();
            $table->timestamps();
        });

        // 4. Shows, Seats & Bookings
        Schema::create('shows', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('city');
            $table->string('venue');
            $table->date('show_date');
            $table->string('show_time');
            $table->enum('status', ['draft', 'upcoming', 'live', 'completed', 'cancelled'])->default('upcoming');
            $table->string('poster_path')->nullable();
            $table->string('hero_path')->nullable();
            $table->integer('capacity')->default(100);
            $table->boolean('is_featured')->default(true);
            $table->timestamps();
        });

        Schema::create('show_performers', function (Blueprint $table) {
            $table->foreignId('show_id')->constrained()->onDelete('cascade');
            $table->foreignId('performer_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('Main Cast');
            $table->primary(['show_id', 'performer_id']);
        });

        Schema::create('ticket_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('show_id')->constrained()->onDelete('cascade');
            $table->string('name'); // VIP, Premium, Gold, Silver
            $table->decimal('price', 10, 2);
            $table->integer('total_seats');
            $table->integer('available_seats');
            $table->string('color')->default('#D6A84F');
            $table->text('description')->nullable();
            $table->dateTime('sales_start')->nullable();
            $table->dateTime('sales_end')->nullable();
            $table->timestamps();
        });

        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('show_id')->constrained()->onDelete('cascade');
            $table->foreignId('ticket_category_id')->constrained()->onDelete('cascade');
            $table->string('row');
            $table->integer('number');
            $table->string('seat_code'); // e.g. VIP-A-01
            $table->enum('status', ['available', 'reserved', 'booked'])->default('available');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_no')->unique(); // e.g. JPS-2026-000123
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('show_id')->constrained()->onDelete('cascade');
            $table->integer('total_seats');
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->enum('booking_status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('qr_code')->nullable();
            $table->timestamps();
        });

        Schema::create('booking_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('seat_id')->constrained()->onDelete('cascade');
            $table->foreignId('ticket_category_id')->constrained()->onDelete('cascade');
            $table->decimal('price', 10, 2);
            $table->string('seat_code');
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('transaction_id')->unique();
            $table->string('payment_method')->default('UPI'); // UPI, Card, Net Banking
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('completed');
            $table->json('gateway_response')->nullable();
            $table->timestamps();
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_item_id')->constrained()->onDelete('cascade');
            $table->string('ticket_no')->unique();
            $table->string('qr_code')->nullable();
            $table->boolean('is_used')->default(false);
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamps();
        });

        // 5. Episodes & Gallery
        Schema::create('episodes', function (Blueprint $table) {
            $table->id();
            $table->integer('episode_no');
            $table->string('title');
            $table->text('description');
            $table->string('guest_name')->nullable();
            $table->string('duration')->nullable();
            $table->string('video_url');
            $table->string('thumbnail_path')->nullable();
            $table->date('publish_date')->nullable();
            $table->boolean('is_featured')->default(true);
            $table->timestamps();
        });

        Schema::create('gallery_albums', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // Shows, Auditions, Behind The Scenes, Audience
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
        });

        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_album_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title')->nullable();
            $table->string('image_path');
            $table->string('category')->default('Shows');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // 6. Notifications, Contact, Audit Logs & Settings
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info');
            $table->boolean('is_read')->default(false);
            $table->json('data')->nullable();
            $table->timestamps();
        });

        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('subject');
            $table->text('body_template');
            $table->enum('channel', ['email', 'sms', 'whatsapp', 'push'])->default('email');
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->enum('status', ['new', 'read', 'replied'])->default('new');
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action');
            $table->string('entity_type')->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('payload')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('notification_templates');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('gallery_images');
        Schema::dropIfExists('gallery_albums');
        Schema::dropIfExists('episodes');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('booking_items');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('seats');
        Schema::dropIfExists('ticket_categories');
        Schema::dropIfExists('show_performers');
        Schema::dropIfExists('shows');
        Schema::dropIfExists('audition_scores');
        Schema::dropIfExists('audition_schedules');
        Schema::dropIfExists('audition_documents');
        Schema::dropIfExists('audition_applications');
        Schema::dropIfExists('auditions');
        Schema::dropIfExists('performers');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'city', 'avatar', 'role', 'status']);
        });
    }
};
