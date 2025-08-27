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
        // Products table
        Schema::create('products', function (Blueprint $table) {
            $table->id('ProductID');
            $table->string('Name');
            $table->text('Description')->nullable();
            $table->float('Price')->nullable();
            $table->boolean('IsFavorite')->default(false);
            $table->string('Category')->nullable();
        });

        // Markets table
        Schema::create('markets', function (Blueprint $table) {
            $table->id('MarketID');
            $table->string('Name');
            $table->string('Location')->nullable();
        });

        // ProductMarket (junction table)
        Schema::create('product_market', function (Blueprint $table) {
            $table->id('ProductMarketID');
            $table->foreignId('ProductID')->constrained('products', 'ProductID')->onDelete('cascade');
            $table->foreignId('MarketID')->constrained('markets', 'MarketID')->onDelete('cascade');
        });

        // ShoppingListItems table
        Schema::create('shopping_list_items', function (Blueprint $table) {
            $table->id('ShoppingListItemID');
            $table->foreignId('ProductID')->constrained('products', 'ProductID')->onDelete('cascade');
            $table->enum('Status', ['ToBuy', 'Bought']);
            $table->timestamp('AddedAt')->nullable();
            $table->timestamp('BoughtAt')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopping_list_items');
        Schema::dropIfExists('product_market');
        Schema::dropIfExists('markets');
        Schema::dropIfExists('products');
    }
};
