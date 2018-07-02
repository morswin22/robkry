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

route('/', function() {
    global $db;
    require_logged();
    $query = $db->query('SELECT * FROM `employees`');
    $employees = array();
    while($row = $query->fetch_assoc()) {
        $employees[] = $row;
    }
    render('index.html', array('employees'=>$employees));
});

route('/employee/:id', function($args) {
    global $db;
    require_logged();
    $query = $db->query('SELECT * FROM `employees` WHERE `id` = '.$args['id']);
    if ($query and $row = $query->fetch_assoc()) {
        render('employee.html', array('employee'=>$row));
    } else {
        error(404);
    }
});

route('/add', function() {
    global $db;
    require_logged();
    if (isset($_POST['name']) and !empty(trim($_POST['name']))) {
        $db->query('INSERT INTO `employees`(`name`, `data`) VALUES (\''.trim($_POST['name']).'\',\'[]\')');
    }
    redirect('/');
});

route('/delete/:id', function($args) {
    global $db;
    $db->query('DELETE FROM `employees` WHERE `id` = '.$args['id']);
    redirect('/');
});

route('/login', function() {
    if (isset($_POST['email'],$_POST['pass'])) {
        $_SESSION['name'] = $_POST['email'];
        $_SESSION['pass'] = $_POST['pass'];
    }
    if (isset($_POST['redir'])) {
        redirect($_POST['redir']);
    } else {
        redirect('/');
    }
});

?>