<?php
// PHP Form Handling - Sanitize & Escape example

header('Content-Type: text/html; charset=utf-8');

$submitted = false;
$comment = '';
$safeComment = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $submitted = true;
  $comment = (string)($_POST['comment'] ?? '');

  // Remove leading/trailing whitespace.
  $comment = trim($comment);

  // Escape output to prevent XSS.
  $safeComment = htmlspecialchars($comment, ENT_QUOTES, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PHP Form Handling - Sanitize & Escape</title>
  <style>
    body { font-family: system-ui, Arial; padding: 16px; }
    .box { border:1px solid #3333; padding: 12px; border-radius: 12px; margin-top: 12px; }
    label { display:block; margin: 10px 0; }
    textarea { width:100%; max-width: 520px; min-height: 110px; padding: 10px; }
    button { padding: 10px 14px; }
  </style>
</head>
<body>
  <h1>Sanitize & Escape</h1>
  <p>
    Enter a comment containing HTML (like <code><script></code>) and see how escaping prevents execution.
  </p>

  <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF'] ?? '', ENT_QUOTES, 'UTF-8'); ?>">
    <label>
      Comment
      <textarea name="comment" required><?php echo htmlspecialchars($comment, ENT_QUOTES, 'UTF-8'); ?></textarea>
    </label>
    <button type="submit">Post</button>
  </form>

  <?php if ($submitted): ?>
    <div class="box">
      <h2>Escaped Output</h2>
      <div>
        <?php echo $safeComment; // safe to echo because it is escaped ?>
      </div>
    </div>
  <?php endif; ?>
</body>
</html>

