<?php

require_once "lib/router/router.php";

$db = new mysqli('localhost','p.janiak','99988877p','robkry');

$logged = false;
if(isset($_SESSION['name'], $_SESSION['pass'])) {
    $query = $db->query('SELECT * FROM `users` WHERE `email` = \''.$_SESSION['name'].'\'');
    if ($user = $query->fetch_assoc()) {
        if ($user['pass'] == $_SESSION['pass']) {
            $logged = true;
        }
    }
}

function require_logged() {
    global $logged;
    if (!$logged) {
        error(403);
    }
}

$employees = array(
    array(
        'id' => 0,
        'name' => 'Jan Kowalski'
    ),
    array(
        'id' => 1,
        'name' => 'Adam Mickiewicz'
    ),
    array(
        'id' => 2,
        'name' => 'Juliusz Słowacki'
    )
);

route('/', function() {
    global $employees;
    require_logged();
    render('index.html', array('employees'=>$employees));
});

route('/employee/:id', function($args) {
    global $employees;
    if (isset($employees[$args['id']])) {
        render('employee.html', array('employee'=>$employees[$args['id']]));
    } else {
        error(404);
    }
});

route('/login', function() {
    if (isset($_POST['email'],$_POST['pass'])) {
        $_SESSION['name'] = $_POST['email'];
        $_SESSION['pass'] = $_POST['pass'];
    }
    redirect('/');
});

?>