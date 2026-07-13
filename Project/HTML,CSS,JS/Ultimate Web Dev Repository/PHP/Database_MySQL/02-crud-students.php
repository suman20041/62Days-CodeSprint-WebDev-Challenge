<?php
// Database with MySQL - CRUD example using MySQLi
//
// Endpoints (single file):
// - GET  ?action=list
// - GET  ?action=show&id=1
// - POST ?action=create
// - POST ?action=delete&id=1
// - POST ?action=update&id=1
//
// NOTE:
// - This demo returns plain text/JSON-ish output for simplicity.
// - Use db_schema.sql in the same folder to create the table.

header('Content-Type: text/plain; charset=utf-8');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'webdev_demo';

function connect(): mysqli {
  global $host, $user, $pass, $dbname;
  $mysqli = new mysqli($host, $user, $pass, $dbname);
  if ($mysqli->connect_errno) {
    throw new Exception('MySQL connection failed: ' . $mysqli->connect_error);
  }
  $mysqli->set_charset('utf8mb4');
  return $mysqli;
}

function h($s) {
  return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

try {
  $mysqli = connect();

  $action = $_REQUEST['action'] ?? 'list';

  if ($action === 'list') {
    $rows = [];
    $res = $mysqli->query('SELECT id, name, email, created_at FROM students ORDER BY id ASC');
    while ($r = $res->fetch_assoc()) {
      $rows[] = $r;
    }

    echo "Students:\n";
    foreach ($rows as $r) {
      echo "- #{$r['id']} {$r['name']} ({$r['email']})\n";
    }

  } elseif ($action === 'show') {
    $id = (int)($_GET['id'] ?? 0);
    $stmt = $mysqli->prepare('SELECT id, name, email, created_at FROM students WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if (!$row) {
      echo "No student found for id={$id}.\n";
    } else {
      echo "Student #{$row['id']}\n";
      echo "Name: {$row['name']}\n";
      echo "Email: {$row['email']}\n";
      echo "Created: {$row['created_at']}\n";
    }

  } elseif ($action === 'create') {
    $name = trim((string)($_POST['name'] ?? ''));
    $email = trim((string)($_POST['email'] ?? ''));

    if ($name === '' || $email === '') {
      throw new Exception('Missing POST fields: name and/or email');
    }

    $stmt = $mysqli->prepare('INSERT INTO students (name, email) VALUES (?, ?)');
    $stmt->bind_param('ss', $name, $email);
    $stmt->execute();

    echo "Created student with id=" . $mysqli->insert_id . "\n";

  } elseif ($action === 'delete') {
    $id = (int)($_GET['id'] ?? 0);

    $stmt = $mysqli->prepare('DELETE FROM students WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();

    echo "Deleted rows: " . $stmt->affected_rows . "\n";

  } elseif ($action === 'update') {
    $id = (int)($_POST['id'] ?? ($_GET['id'] ?? 0));
    $name = trim((string)($_POST['name'] ?? ''));
    $email = trim((string)($_POST['email'] ?? ''));

    if ($name === '' || $email === '') {
      throw new Exception('Missing POST fields: name and/or email');
    }

    $stmt = $mysqli->prepare('UPDATE students SET name = ?, email = ? WHERE id = ?');
    $stmt->bind_param('ssi', $name, $email, $id);
    $stmt->execute();

    echo "Updated rows: " . $stmt->affected_rows . "\n";

  } else {
    echo "Unknown action: " . h($action) . "\n";
    echo "Valid actions: list, show, create, delete, update\n";
  }

  $mysqli->close();

} catch (Throwable $e) {
  echo 'Error: ' . $e->getMessage() . "\n";
  echo "\nTip: Ensure MySQL DB '{$dbname}' exists and run db_schema.sql first.\n";
}

