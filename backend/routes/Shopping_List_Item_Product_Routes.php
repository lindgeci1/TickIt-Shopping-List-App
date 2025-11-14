<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shopping_List_Item_Product_Controller;

Route::prefix('product-shopping-list-item')->group(function () {

    Route::post('/assign', [Shopping_List_Item_Product_Controller::class, 'assign']);
    Route::delete('/remove', [Shopping_List_Item_Product_Controller::class, 'remove']);
    Route::put('/update', [Shopping_List_Item_Product_Controller::class, 'update']);
});
