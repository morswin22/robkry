<?php

require_once "lib/router/router.php";

$logged = false;
if(isset($_SESSION['name'], $_SESSION['pass'])) {
    $logged = true;
}

function require_logged() {
    global $logged;
    if (!$logged) {
        error(403);
    }
}

route('/', function() {
    require_logged();
    render('index.html');
});

route('/login', function() {
    if (isset($_POST['email'],$_POST['pass'])) {
        $_SESSION['name'] = $_POST['email'];
        $_SESSION['pass'] = $_POST['pass'];
    }
    redirect('/');
});

?>