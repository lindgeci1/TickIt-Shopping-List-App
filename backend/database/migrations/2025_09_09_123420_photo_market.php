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
        Schema::create('market_photos', function (Blueprint $table) {
            $table->bigIncrements('market_photo_id');
            $table->string('url');
            $table->string('public_id')->nullable();
            $table->unsignedBigInteger('market_id');

            $table->foreign('market_id')
                  ->references('market_id')
                  ->on('markets')
                  ->onDelete('cascade');

            // 🔑 e bën 1-to-1
            $table->unique('market_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_photos');
    }
};
