<?php
// PHP Form Handling - Validation example

header('Content-Type: text/html; charset=utf-8');

$errors = [];
$submitted = false;

$username = '';
$password = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $submitted = true;
  $username = trim((string)($_POST['username'] ?? ''));
  $password = (string)($_POST['password'] ?? '');

  if ($username === '') $errors[] = 'Username is required.';
  if ($password === '') $errors[] = 'Password is required.';
  if (strlen($password) > 0 && strlen($password) < 8) $errors[] = 'Password must be at least 8 characters.';
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
  <title>PHP Form Handling - Validation</title>
  <style>
    body { font-family: system-ui, Arial; padding: 16px; }
    .error { border:1px solid #ff4d4d66; background:#ff4d4d22; padding:12px; border-radius:12px; }
    .box { border:1px solid #3333; padding: 12px; border-radius: 12px; margin-top: 12px; }
    label { display:block; margin: 10px 0; }
    input { padding: 10px; width: 100%; max-width: 420px; }
    button { padding: 10px 14px; }
  </style>
</head>
<body>
  <h1>Validation</h1>

  <form method="post" action="<?php echo h($_SERVER['PHP_SELF'] ?? ''); ?>">
    <label>
      Username
      <input name="username" type="text" value="<?php echo h($username); ?>" />
    </label>
    <label>
      Password
      <input name="password" type="password" />
    </label>
    <button type="submit">Login</button>
  </form>

  <?php if ($submitted && $errors): ?>
    <div class="error" style="margin-top:14px;">
      <h2>Errors</h2>
      <ul>
        <?php foreach ($errors as $e): ?>
          <li><?php echo h($e); ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php elseif ($submitted): ?>
    <div class="box">
      <h2>Success</h2>
      <p>Validation passed for <strong><?php echo h($username); ?></strong>.</p>
    </div>
  <?php endif; ?>
</body>
</html>

