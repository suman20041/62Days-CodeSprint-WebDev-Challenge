<?php
// PHP Syntax - Control Structures

$score = 78;

$status = 'F';
if ($score >= 90) {
  $status = 'A';
} elseif ($score >= 80) {
  $status = 'B';
} elseif ($score >= 70) {
  $status = 'C';
} elseif ($score >= 60) {
  $status = 'D';
}

// switch example (true/boolean conditions)
$day = 'Mon';
$label = '';

switch (true) {
  case $day === 'Sat' || $day === 'Sun':
    $label = 'Weekend';
    break;
  default:
    $label = 'Weekday';
}

// loop example
$numbers = [];
for ($i = 1; $i <= 5; $i++) {
  $numbers[] = $i * $i;
}

header('Content-Type: text/plain; charset=utf-8');

echo "score = {$score}\n";
echo "grade = {$status}\n\n";

echo "day = {$day}\n";
echo "label = {$label}\n\n";

echo "squares(1..5) = " . implode(', ', $numbers) . "\n";

