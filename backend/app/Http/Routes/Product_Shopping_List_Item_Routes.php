<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product_Shopping_List_Item_Controller;

Route::prefix('product-shopping-list-item')->group(function () {

    Route::post('/assign', [Product_Shopping_List_Item_Controller::class, 'assign']);
    Route::delete('/remove', [Product_Shopping_List_Item_Controller::class, 'remove']);
    Route::put('/update', [Product_Shopping_List_Item_Controller::class, 'update']);
});
