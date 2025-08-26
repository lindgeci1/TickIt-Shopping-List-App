<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleController;

Route::prefix('vehicle')->group(function () {
    Route::get('/all', [VehicleController::class, 'index']);
    Route::get('/{VehicleID}', [VehicleController::class, 'show']);
    Route::post('/create', [VehicleController::class, 'store']);
    Route::put('/update/{VehicleID}', [VehicleController::class, 'update']);
    Route::delete('/delete/{VehicleID}', [VehicleController::class, 'destroy']);
});
