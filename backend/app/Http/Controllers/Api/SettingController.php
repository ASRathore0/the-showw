<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Get all platform settings as a key-value dictionary.
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'settings' => $settings
        ]);
    }

    /**
     * Update platform settings (Admin).
     */
    public function update(Request $request)
    {
        $data = $request->input('settings', $request->all());

        if (is_array($data)) {
            foreach ($data as $key => $value) {
                // Ignore non-setting keys if sent directly
                if (is_string($key)) {
                    Setting::updateOrCreate(
                        ['key' => $key],
                        ['value' => $value ?? '']
                    );
                }
            }
        }

        $updatedSettings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'message' => 'Platform settings updated successfully',
            'settings' => $updatedSettings
        ]);
    }

    /**
     * Upload media file (image/video) for settings or CMS (Admin).
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,webp,svg,mp4,webm,ogg,mov,avi|max:51200'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $path = $file->storeAs('uploads', $filename, 'public');

            $url = asset('storage/' . $path);

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'url' => $url,
                'relative_url' => '/storage/' . $path,
                'filename' => $filename
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file provided'
        ], 400);
    }
}
