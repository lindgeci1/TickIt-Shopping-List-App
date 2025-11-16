<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shopping_list_item_product_market', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('shopping_list_item_product_market_id');

            // Foreign keys
            $table->unsignedBigInteger('shopping_list_item_product_id'); // FK to shopping_list_item_product
            $table->unsignedBigInteger('product_market_id'); // FK to product_market

            // Optional override price
            $table->decimal('selected_price', 10, 2)->nullable();

            // Foreign key constraints
            $table->foreign('shopping_list_item_product_id')
                ->references('shopping_list_item_product_id')
                ->on('shopping_list_item_product')
                ->onDelete('cascade');

            $table->foreign('product_market_id')
                ->references('product_market_id')
                ->on('product_market')
                ->onDelete('cascade');

            // Prevent duplicate entries
            $table->unique(['shopping_list_item_product_id', 'product_market_id'], 'shopping_list_item_product_market_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shopping_list_item_product_market');
    }
};
