<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Delete the vehicles table
        Schema::dropIfExists('vehicles');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate the vehicles table in case of rollback
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->float('pricePerDay');
            $table->unsignedBigInteger('person_id');
            $table->timestamps();

            // If you have a foreign key to persons table
            $table->foreign('person_id')->references('id')->on('persons')->onDelete('cascade');
        });
    }
};
