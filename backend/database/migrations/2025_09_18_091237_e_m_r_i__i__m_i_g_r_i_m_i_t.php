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
        // Remove price from products
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('price');
        });

        // Add price to product_market
        Schema::table('product_market', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->after('market_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add price back to products
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->after('name');
        });

        // Remove price from product_market
        Schema::table('product_market', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
