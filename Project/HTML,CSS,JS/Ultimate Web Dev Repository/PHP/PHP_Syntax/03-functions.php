<?php
// PHP Syntax - Functions

function add(int|float $a, int|float $b): int|float {
  return $a + $b;
}

function format_money(float $amount): string {
  return '$' . number_format($amount, 2);
}

function repeat(string $text, int $times = 2): string {
  return str_repeat($text, $times);
}

header('Content-Type: text/plain; charset=utf-8');

echo "add(2, 3) = " . add(2, 3) . "\n";
echo "add(2.5, 1.2) = " . add(2.5, 1.2) . "\n\n";

echo "format_money(19.99) = " . format_money(19.99) . "\n";
echo "repeat('ha', 4) = " . repeat('ha', 4) . "\n";

