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
    Schema::create('markets', function (Blueprint $table) {
        $table->bigIncrements('market_id');
        $table->string('name');
        $table->string('location')->nullable();
    });

    Schema::create('products', function (Blueprint $table) {
        $table->bigIncrements('product_id');
        $table->string('name');
        $table->string('description')->nullable();
        $table->float('price')->nullable();
        $table->boolean('is_favorite')->default(false);
        $table->string('category');
    });

    Schema::create('product_market', function (Blueprint $table) {
        $table->bigIncrements('product_market_id');
        $table->unsignedBigInteger('product_id');
        $table->unsignedBigInteger('market_id');

        $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        $table->foreign('market_id')->references('market_id')->on('markets')->onDelete('cascade');
    });

    Schema::create('shopping_list_items', function (Blueprint $table) {
        $table->bigIncrements('shopping_list_item_id');
        $table->unsignedBigInteger('product_id');
        $table->string('status');
        $table->timestamp('added_at')->nullable();
        $table->timestamp('bought_at')->nullable();

        $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
    });
}


    public function down(): void
    {
        Schema::dropIfExists('shopping_list_items');
        Schema::dropIfExists('product_market');
        Schema::dropIfExists('products');
        Schema::dropIfExists('markets');
    }

};
