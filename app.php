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
        $year = intval(date('Y'));
        $month = intval(date('m'));
        $days_in_month = cal_days_in_month(CAL_GREGORIAN,$month,$year);
        $d = json_decode($row['data'], true);
        if (!isset($d[$year])) {
            $d[$year] = json_decode('[[],[],[],[],[],[],[],[],[],[],[],[]]',true);
        }
        if (count($d[$year][$month-1]) != $days_in_month) {
            for($i = 0; $i < $days_in_month; $i++) {
                $d[$year][$month-1][$i] = array(
                    'day' => $i+1,
                    'hours' => array(
                        'top' => "0",
                        'bottom' => "0",
                        'total' => "0"
                    )
                );
            }
        }
        render('employee.html', array('employee'=>$row));
        echo '<script>const year = '.$year.'; const month = '.$month.'; const daysInMonth = '.$days_in_month.'; const userId = '.$row['id'].'; const userData = '.json_encode($d).';</script>';
    } else {
        error(404);
    }
});

route('/save/:id', function($args) {
    global $db;
    require_logged();
    if (isset($_POST['data'],$_POST['month'], $_POST['year'])) {
        $get = $db->query('SELECT `data` FROM `employees` WHERE `id` = '.$args['id']);
        if ($row = $get->fetch_assoc()) {
            $d = json_decode($row['data'], true);
            if (!isset($d[$_POST['year']])) {
                $d[$_POST['year']] = json_decode('[[],[],[],[],[],[],[],[],[],[],[],[]]',true);
            }
            if (isset($d[$_POST['year']][$_POST['month']-1])) {
                $d[$_POST['year']][$_POST['month']-1] = $_POST['data'];
                $query = $db->query('UPDATE `employees` SET `data`=\''.json_encode($d).'\' WHERE `id` = '.$args['id']);
                if (!$query) {
                    error(500);
                }
            } else {
                error(500);
            }
        } else {
            error(500);
        }
    } else {
        error(500);
    }
});

route('/add', function() {
    global $db;
    require_logged();
    if (isset($_POST['name']) and !empty(trim($_POST['name']))) {
        $db->query('INSERT INTO `employees`(`name`, `data`) VALUES (\''.trim($_POST['name']).'\',\'{}\')');
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

route('/logout', function() {
    if (isset($_SESSION['name'])) {
        unset($_SESSION['name']);
    }
    if (isset($_SESSION['pass'])) {
        unset($_SESSION['pass']);
    }
    redirect('/');
})

?>