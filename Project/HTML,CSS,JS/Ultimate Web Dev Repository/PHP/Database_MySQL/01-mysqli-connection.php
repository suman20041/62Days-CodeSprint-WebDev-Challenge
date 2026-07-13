<?php
// Database with MySQL - Connection example (MySQLi)

// IMPORTANT:
// - This is an example. You must set DB credentials correctly.
// - Run using a PHP-capable server with mysqli extension enabled.

header('Content-Type: text/plain; charset=utf-8');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'webdev_demo';

try {
  $mysqli = new mysqli($host, $user, $pass, $dbname);
  if ($mysqli->connect_errno) {
    throw new Exception('MySQL connection failed: ' . $mysqli->connect_error);
  }

  $mysqli->set_charset('utf8mb4');

  echo "Connected successfully to '{$dbname}'.\n";
  echo "Server version: " . $mysqli->server_info . "\n";

  $mysqli->close();
} catch (Throwable $e) {
  echo "Error: " . $e->getMessage() . "\n";
  echo "\nTip: Create the DB and run the provided schema (db_schema.sql) in this folder.";
}

