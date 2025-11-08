<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\MathHelper;

class MathHelperTest extends TestCase
{
    public function test_add_function_adds_numbers_correctly()
    {
        $result = MathHelper::add(4, 6);
        $this->assertEquals(5, $result);
    }
}
