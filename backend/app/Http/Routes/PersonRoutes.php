<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonController;

Route::prefix('person')->group(function () {
    Route::get('/all', [PersonController::class, 'index']);
    Route::get('/{PersonID}', [PersonController::class, 'show']);
    Route::post('/create', [PersonController::class, 'store']);
    Route::put('/update/{PersonID}', [PersonController::class, 'update']);
    Route::delete('/delete/{PersonID}', [PersonController::class, 'destroy']);
});
