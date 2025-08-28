<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::prefix('product')->group(function () {
    Route::get('/all', [ProductController::class, 'index']);
    Route::get('/{ProductID}', [ProductController::class, 'show']);
    Route::post('/create', [ProductController::class, 'store']);
    Route::put('/update/{ProductID}', [ProductController::class, 'update']);
    Route::delete('/delete/{ProductID}', [ProductController::class, 'destroy']);

    Route::post('/{ProductID}/attach-markets', [ProductController::class, 'attachMarkets']);
});

