<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop table if it exists
        Schema::dropIfExists('shopping_list_item_product_market');

        // Create table
        Schema::create('shopping_list_item_product_market', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('shopping_list_item_product_market_id');

            // Foreign keys
            $table->unsignedBigInteger('shopping_list_item_id'); // FK to shopping_list_items
            $table->unsignedBigInteger('product_id');            // FK to products
            $table->unsignedBigInteger('market_id');             // FK to markets

            // Optional override price
            $table->decimal('selected_price', 10, 2)->nullable();

            // Foreign key constraints
            $table->foreign('shopping_list_item_id')
                ->references('shopping_list_item_id')
                ->on('shopping_list_items')
                ->onDelete('cascade');

            $table->foreign('product_id')
                ->references('product_id')
                ->on('products')
                ->onDelete('cascade');

            $table->foreign('market_id')
                ->references('market_id')
                ->on('markets')
                ->onDelete('cascade');

            // Prevent duplicate entries for same combination
            $table->unique(['shopping_list_item_id', 'product_id', 'market_id'], 'shopping_list_item_product_market_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shopping_list_item_product_market');
    }
};
