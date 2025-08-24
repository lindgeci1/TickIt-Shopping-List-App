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
        Schema::table('vehicles', function (Blueprint $table) {
            // Add person_id as a foreign key
            $table->unsignedBigInteger('person_id')->after('id');

            $table->foreign('person_id')
                  ->references('id')
                  ->on('people') // assuming your table is "people"
                  ->onDelete('cascade'); // delete vehicle if person is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropForeign(['person_id']);
            $table->dropColumn('person_id');
        });
    }
};
