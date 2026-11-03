<?php

namespace App\Http\Controllers\Api;
use App\Http\Resources\ApplicationResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
 public function index(Request $request)
{
    $request->validate([
        'status' => 'sometimes|in:pending,interview,accepted,rejected',
        'search' => 'sometimes|string|max:255',
    ]);

    $applications = Application::where('user_id', auth()->id());

    if ($request->filled('search')) {
        $search = $request->search;

        $applications->where(function ($query) use ($search) {
            $query->where('company', 'LIKE', "%{$search}%")
                  ->orWhere('position', 'LIKE', "%{$search}%");
        });
    }

    if ($request->filled('status')) {
        $applications->where('status', $request->status);
    }

    return ApplicationResource::collection(
        $applications->latest()->paginate(10)
    );
}
    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
{
    $validated = $request->validate([
        'company' => 'required|string|max:255',
        'position' => 'required|string|max:255',
        'location' => 'nullable|string|max:255',
        'application_date' => 'required|date',
        'status' => 'nullable|in:pending,interview,accepted,rejected',
        'job_url' => 'nullable|url|max:255',
        'notes' => 'nullable|string',
    ]);

    $application = $request->user()->applications()->create($validated);

    return (new ApplicationResource($application))
        ->response()
        ->setStatusCode(201);
}

    /**
     * Display the specified resource.
     */
  public function show(string $id)
{
    $application = Application::where('user_id', auth()->id())
        ->findOrFail($id);

    return new ApplicationResource($application);
}
    /**
     * Update the specified resource in storage.
     */
    
public function update(Request $request, string $id)
{
    $application = $request->user()->applications()->findOrFail($id);

    $validated = $request->validate([
        'company' => 'sometimes|required|string|max:255',
        'position' => 'sometimes|required|string|max:255',
        'location' => 'sometimes|nullable|string|max:255',
        'application_date' => 'sometimes|required|date',
        'status' => 'sometimes|in:pending,interview,accepted,rejected',
        'job_url' => 'sometimes|nullable|url|max:255',
        'notes' => 'sometimes|nullable|string',
    ]);

    $application->update($validated);

    return new ApplicationResource($application);
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    $application = auth()->user()->applications()->findOrFail($id);

    $application->delete();

    return response()->json([
        'message' => 'Application deleted successfully'
    ]);
}
}
