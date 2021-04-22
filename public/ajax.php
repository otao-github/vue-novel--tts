<?php

$url = $_POST['url'];
$re = $_POST['re'];
$idx = 0;
if (isset($_POST['i'])) {
    $idx = intval($_POST['i']);
}
// $auth = $_POST['auth'];
// $query = $_POST['q'];
// $timeStr = strval(time());
// if ($url && $auth && md5($url . 'otao_auth' . substr($timeStr, 0, strlen($timeStr) - 2)) === $auth) {
//     // die();
// }
$html = file_get_contents($url);
preg_match('/charset="?([a-z0-9-]+)"?/im', $html, $matches);
$encode = strtolower($matches[1]);

if ($encode !== 'utf-8') {
    $html = iconv($encode, "utf-8//IGNORE", $html);
}

preg_match_all($re, $html, $matches);

header("Content-Type:application/json");

echo json_encode(['matches' => $matches[$idx]], JSON_UNESCAPED_UNICODE);
die();