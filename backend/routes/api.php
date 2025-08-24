<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonController;

Route::apiResource('persons', PersonController::class);
