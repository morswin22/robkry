<?php

$fname = str_replace(' ','_',$user['name']);
$fname.= '_' . $args['year'] . '_' . $args['month'];

$days_in_month = cal_days_in_month(CAL_GREGORIAN,$args['month'],$args['year']);

$data = json_decode($user['data'],true);
if (!isset($data[$args['year']])) {
    $data[$args['year']] = json_decode('[[],[],[],[],[],[],[],[],[],[],[],[]]',true);
}
if (count($data[$args['year']][$args['month']-1]) != $days_in_month) {
    for($i = 0; $i < $days_in_month; $i++) {
        $data[$args['year']][$args['month']-1][$i] = array(
            'day' => $i+1,
            'hours' => array(
                'top' => 0,
                'bottom' => 0,
                'total' => 0
            )
        );
    }
}

require 'lib/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setCellValue('A1', 'Dzień');
$sheet->setCellValue('B1', 'Ilość godzin');
$sheet->setCellValue('D1', 'Łącznie');

$total = 0;
for($i = 0; $i < count($data[$args['year']][$args['month']-1]); $i++) {
    $sheet->setCellValue('A'. ($i+2), $i+1);
    $sheet->setCellValue('B'. ($i+2), $data[$args['year']][$args['month']-1][$i]['hours']['total']);
    $total += $data[$args['year']][$args['month']-1][$i]['hours']['total'];
}

$sheet->setCellValue('D2', $total);

$writer = new Xlsx($spreadsheet);
$writer->save('static/downloads/'.$_COOKIE['PHPSESSID'].'/'.$fname.'.xlsx');

?>