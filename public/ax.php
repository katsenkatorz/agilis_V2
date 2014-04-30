<?php

$a = '111' . chr(13).  '222';

$x = ax($a);
echo $x.'<br>';

function ax($a){
echo $a;
echo '</br>';	
	$b = rand(2,9).rand(2,9).rand(2,9);
	$k = 0;
	$h = '';
	for($i = 0 ; $i < strlen($a) ; $i++){
		$d = ord(substr($a,$i,1));		
		$h .= substr('0'.dechex($d),-2);
		$k += $d;
echo $d.' ';		
	}//end for
echo '</br>';
echo $h.' ';
echo '</br>';
	$k = substr($k,0,3);
	$h .= $k;
	$i = 0 ; $j = 0;
	$t = array();
	while($h != ''){
		$r = substr($h,0,substr($b,$i,1));
		$s = strrev($r);
		$t[$j++] = $s;
		$h = substr($h,substr($b,$i,1),strlen($h));
		$i = ($i + 1) % 3;
	}//end while
	$x = '';
	for($j = 0 ; $j < count($t) ; $j += 3){
		$x .= (!empty($t[$j+2]) ? $t[$j+2] : '');
		$x .= (!empty($t[$j+1]) ? $t[$j+1] : '');		
		$x .= $t[$j];
	}//end for	
	$x = $b.$x;
	return $x;
}//end function