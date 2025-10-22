<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');

Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class,'index'])->name('admin.dashboard');
});
