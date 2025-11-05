<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    /** @test */
    public function public_api_returns_posts()
    {
        // Make a request to a public API
        $response = Http::get('https://jsonplaceholder.typicode.com/posts');

        // Assert HTTP 200 OK
        $this->assertEquals(200, $response->status());

        // Assert we got a non-empty array
        $data = $response->json();
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);

        // Assert the first post has expected keys
        $this->assertArrayHasKey('userId', $data[0]);
        $this->assertArrayHasKey('id', $data[0]);
        $this->assertArrayHasKey('title', $data[0]);
        $this->assertArrayHasKey('body', $data[0]);
    }
}
