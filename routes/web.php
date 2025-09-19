<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;

// controladores de admin
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('auth.login');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de administración
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function(){
        Route::get('/dashboard',[DashboardController::class,'index'])->name('dashboard');

        // Users
        Route::resource('users', UserController::class)->names('users');

        // Roles
        Route::resource('roles', RoleController::class)->names('roles');
    });

// Registro
route::get('/register', [RegisteredUserController::class, 'create'])
    ->middleware('guest')
    ->name('register');

route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest');

require __DIR__.'/auth.php';
