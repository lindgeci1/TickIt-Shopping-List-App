<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Infrastructure\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Infrastructure\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),       // simple random word
            'category' => 'TestCategory',         // fixed minimal category
            'is_favorite' => false,               // fixed for minimal test
            'price' => null,                       // API returns null
            'product_id' => $this->faker->unique()->numberBetween(1, 999),
            'photos' => ['https://example.com/photo.jpg'], // fixed single photo
        ];
    }
}
