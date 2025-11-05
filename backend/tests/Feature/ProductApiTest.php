<?php

namespace Tests\Feature;

use Tests\TestCase;

class ProductApiTest extends TestCase
{
    public function test_get_all_products()
    {
        $response = $this->get('/api/product/all');

        $response->assertStatus(200);

        // Match the actual API keys
        $response->assertJsonStructure([
            '*' => ['ProductID', 'Name', 'Price', 'IsFavorite', 'Category', 'Photos']
        ]);
    }
}
