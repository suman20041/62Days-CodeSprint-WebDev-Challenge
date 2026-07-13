<?php
// PHP Syntax - Variables & Types

$name = 'Neon';
$count = 42;
$pi = 3.14;
$isCool = true;
$nothing = null;

$notAssigned = null; // defaulted to null for demonstration

header('Content-Type: text/plain; charset=utf-8');

echo "name = {$name}\n";

echo "count = {$count} (gettype: " . gettype($count) . ")\n";

echo "pi = {$pi} (gettype: " . gettype($pi) . ")\n";

echo "isCool = " . ($isCool ? 'true' : 'false') . " (gettype: " . gettype($isCool) . ")\n";

echo "nothing = " . var_export($nothing, true) . " (gettype: " . gettype($nothing) . ")\n";

echo "notAssigned = " . var_export($notAssigned, true) . " (gettype: " . gettype($notAssigned) . ")\n";

