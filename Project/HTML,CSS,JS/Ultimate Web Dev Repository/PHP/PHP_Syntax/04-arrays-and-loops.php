<?php
// PHP Syntax - Arrays & Loops

$users = [
  ['id' => 1, 'name' => 'Ava'],
  ['id' => 2, 'name' => 'Noah'],
  ['id' => 3, 'name' => 'Mia'],
];

// foreach
$names = [];
foreach ($users as $u) {
  $names[] = $u['name'];
}

// while
$i = 1;
$squares = [];
while ($i <= 5) {
  $squares[] = $i * $i;
  $i++;
}

header('Content-Type: text/plain; charset=utf-8');

echo "Users: " . implode(', ', $names) . "\n";
echo "Squares(1..5): " . implode(', ', $squares) . "\n";

