<?php

require_once "lib/router/router.php";

route('/', function() {
    render('index.html');
})
?>