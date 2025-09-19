<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;

class DashboardController extends Controller
{
    public function index()
    {
        $usersCount = User::count();
        $activeUsersCount = User::where('status', true)->count();
        $rolesCount = Role::count();
        $adminCount = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->count();
        $recentUsers = User::with('role')->latest()->take(5)->get();

        return view('admin.dashboard', compact(
            'usersCount',
            'activeUsersCount', 
            'rolesCount',
            'adminCount',
            'recentUsers'
        ));
    }
}