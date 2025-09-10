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
        // Create the join table
        Schema::create('shopping_list_item_product', function (Blueprint $table) {
            $table->bigIncrements('shopping_list_item_product_id');

            $table->unsignedBigInteger('shopping_list_item_id');
            $table->unsignedBigInteger('product_id');

            // Foreign keys
            $table->foreign('shopping_list_item_id')
                  ->references('shopping_list_item_id')
                  ->on('shopping_list_items')
                  ->onDelete('cascade');

            $table->foreign('product_id')
                  ->references('product_id')
                  ->on('products')
                  ->onDelete('cascade');

            // Optional: avoid duplicate entries
            $table->unique(['shopping_list_item_id', 'product_id']);
        });

        // Optional: remove old product_id from shopping_list_items if exists
        if (Schema::hasColumn('shopping_list_items', 'product_id')) {
            Schema::table('shopping_list_items', function (Blueprint $table) {
                $table->dropColumn('product_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop join table
        Schema::dropIfExists('shopping_list_item_product');

        // Optionally, you could add product_id back to shopping_list_items
        Schema::table('shopping_list_items', function (Blueprint $table) {
            if (!Schema::hasColumn('shopping_list_items', 'product_id')) {
                $table->unsignedBigInteger('product_id')->nullable();
            }
        });
    }
};
