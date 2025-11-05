<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase; // resets DB for each test

    /** @test */
    public function can_fetch_all_products()
    {
        // If you have factories, you can seed some data
        // Product::factory()->count(3)->create();

        $response = $this->getJson('/api/product/all');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'name',
                         'is_favorite',
                         'category',
                         'Photos'
                     ]
                 ]);
    }
}
