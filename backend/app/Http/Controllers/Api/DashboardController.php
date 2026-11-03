<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Application;

class DashboardController extends Controller
{
    public function stats()
    {
        $applications = Application::where('user_id', auth()->id());

        return response()->json([
            'total' => $applications->count(),

            'pending' => (clone $applications)
                ->where('status', 'pending')
                ->count(),

            'interview' => (clone $applications)
                ->where('status', 'interview')
                ->count(),

            'accepted' => (clone $applications)
                ->where('status', 'accepted')
                ->count(),

            'rejected' => (clone $applications)
                ->where('status', 'rejected')
                ->count(),
        ]);
    }
}
