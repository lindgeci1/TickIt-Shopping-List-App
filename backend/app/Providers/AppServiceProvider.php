<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $dbName = config('database.connections.mysql.database');

        try {
            // Connect without specifying a database
            $pdo = new \PDO(
                "mysql:host=" . config('database.connections.mysql.host'),
                config('database.connections.mysql.username'),
                config('database.connections.mysql.password')
            );

            // Create the database if it doesn't exist
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        } catch (\PDOException $e) {
            // Handle connection errors
            die("Database creation failed: " . $e->getMessage());
        }
    }

    public function register(): void
    {
        //
    }
}
