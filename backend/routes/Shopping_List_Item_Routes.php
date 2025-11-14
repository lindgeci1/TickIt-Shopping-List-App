<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shopping_List_Item_Controller;

Route::prefix('shopping-list')->group(function () {
    Route::get('/all', [Shopping_List_Item_Controller::class, 'index']);
    Route::get('/{Shopping_List_ItemID}', [Shopping_List_Item_Controller::class, 'show']);
    Route::post('/create', [Shopping_List_Item_Controller::class, 'store']);
    Route::put('/update/{Shopping_List_ItemID}', [Shopping_List_Item_Controller::class, 'update']);
    Route::delete('/delete/{Shopping_List_ItemID}', [Shopping_List_Item_Controller::class, 'destroy']);
});
