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
        // Update products table
        Schema::table('products', function (Blueprint $table) {
            $table->string('status')->nullable()->after('category'); // add status
            $table->dropColumn('description'); // drop description
        });

        // Update shopping_list_items table
        Schema::table('shopping_list_items', function (Blueprint $table) {
            $table->dropColumn('status'); // drop status
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback products table changes
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('status'); // remove status
            $table->string('description')->nullable()->after('name'); // restore description
        });

        // Rollback shopping_list_items table changes
        Schema::table('shopping_list_items', function (Blueprint $table) {
            $table->string('status')->after('name')->nullable(); // restore status
        });
    }
};
