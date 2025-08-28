<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MarketController;

Route::prefix('market')->group(function () {
    Route::get('/all', [MarketController::class, 'index']);
    Route::get('/{MarketID}', [MarketController::class, 'show']);
    Route::post('/create', [MarketController::class, 'store']);
    Route::put('/update/{MarketID}', [MarketController::class, 'update']);
    Route::delete('/delete/{MarketID}', [MarketController::class, 'destroy']);
});
