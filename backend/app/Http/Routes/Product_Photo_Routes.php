<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product_Photo_Controller;

Route::prefix('product-photo')->group(function () {
    Route::post('/add', [Product_Photo_Controller::class, 'store']);
    Route::delete('/delete/{ProductID}', [Product_Photo_Controller::class, 'destroy']);
});
