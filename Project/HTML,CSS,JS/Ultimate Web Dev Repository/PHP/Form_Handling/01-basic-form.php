<?php
// PHP Form Handling - Basic Form + Handling
// Save this file as index.php and open via a PHP-capable server.

header('Content-Type: text/html; charset=utf-8');

$submitted = false;
$name = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $submitted = true;
  $name = trim((string)($_POST['name'] ?? ''));
  $email = trim((string)($_POST['email'] ?? ''));
}

function h(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PHP Form Handling - Basic</title>
  <style>
    body { font-family: system-ui, Arial; padding: 16px; }
    .box { border:1px solid #3333; padding: 12px; border-radius: 12px; margin-top: 12px; }
    label { display:block; margin: 10px 0; }
    input { padding: 10px; width: 100%; max-width: 420px; }
    button { padding: 10px 14px; }
  </style>
</head>
<body>
  <h1>Basic Form Handling</h1>
  <p>POSTs to the same file.</p>

  <form method="post" action="<?php echo h($_SERVER['PHP_SELF'] ?? ''); ?>">
    <label>
      Name
      <input name="name" type="text" value="<?php echo h($name); ?>" required />
    </label>
    <label>
      Email
      <input name="email" type="email" value="<?php echo h($email); ?>" required />
    </label>
    <button type="submit">Submit</button>
  </form>

  <?php if ($submitted): ?>
    <div class="box">
      <h2>Submitted!</h2>
      <p><strong>Name:</strong> <?php echo h($name); ?></p>
      <p><strong>Email:</strong> <?php echo h($email); ?></p>
    </div>
  <?php endif; ?>
</body>
</html>

