<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Infrastructure\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FetchProductsTest extends TestCase
{
    use RefreshDatabase; // automatically migrates DB

    public function test_fetch_products_returns_data()
    {
        // Seed database with fake products
        Product::factory()->count(3)->create();

        // Call the API route internally
        $response = $this->getJson('/api/product/all');

        // Assert response
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }
}
