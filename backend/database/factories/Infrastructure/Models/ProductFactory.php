<?php

namespace Database\Factories\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Infrastructure\Models\Product;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'category' => 'TestCategory',
            'is_favorite' => false,
            'status' => 'active',  // assuming you need something in 'status'
            'product_id' => $this->faker->unique()->numberBetween(1, 999),
        ];
    }
}
