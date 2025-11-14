<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DbTestController;


Route::get('/test-db', [DbTestController::class, 'testConnection']);
