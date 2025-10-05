<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DbTestController extends Controller
{


    /**
 * @OA\Get(
 *     path="/api/test-db",
 *     summary="Test database connection",
 *     tags={"Database"},
 *     @OA\Response(
 *         response=200,
 *         description="Database connection successful",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string"),
 *             @OA\Property(property="dbVersion", type="string"),
 *             @OA\Property(property="currentTime", type="string"),
 *             @OA\Property(property="publicTableCount", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Database connection failed",
 *         @OA\JsonContent(type="object")
 *     )
 * )
 */

    public function testConnection()
    {
        try {
            // Database version
            $version = DB::select("SELECT version();");

            // Current time
            $time = DB::select("SELECT NOW() AS current_time;");

            // Count of public tables
            $tablesCount = DB::select("
                SELECT COUNT(*) AS table_count
                FROM information_schema.tables
                WHERE table_schema='public';
            ");

            // Get actual table names in public schema
            $tableNames = DB::select("
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema='public'
                ORDER BY table_name;
            ");

            // Convert table names to a simple array
            $tableList = array_map(fn($t) => $t->table_name, $tableNames);

            return response()->json([
                'message' => '✅ Database connection successful!',
                'dbVersion' => $version[0]->version,
                'currentTime' => $time[0]->current_time,
                'publicTableCount' => $tablesCount[0]->table_count,
                'publicTableNames' => $tableList,
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => '❌ Database connection failed',
                'error' => $ex->getMessage(),
            ], 500);
        }
    }

}
