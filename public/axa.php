<?php

$a0 = '1' + '2';

for($u = 0 ; $u < 1000 ; $u++){
	$x = ax($a0);
	$a1 = xa($x);
	if($a1 != $a0){
		echo $x.'<br>';
		echo $a1.'<br>';	
		echo '<br><br>';
	}//end if
}//end for

function ax($a){
	$b = rand(2,9).rand(2,9).rand(2,9);
	$k = 0;
	$h = '';
	for($i = 0 ; $i < strlen($a) ; $i++){
		$d = ord(substr($a,$i,1));			
		$h .= dechex($d);
		$k += $d;
	}//end for
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
		$x .= (isset($t[$j+2]) ? $t[$j+2] : '');
		$x .= (isset($t[$j+1]) ? $t[$j+1] : '');		
		$x .= $t[$j];
	}//end for	
	$x = $b.$x;
	return $x;
}//end function

function xa($x){
	$b = substr($x,0,3);
	$x = substr($x,3);
	$s = array();
	$i = 2;
	while($x != ''){
		$r = substr($x,0,substr($b,$i,1));
		$s[] = strrev($r);
		$x = substr($x,substr($b,$i,1));
		$i = ($i == 0 ? 2 : $i - 1);
	}//end while
	$h = '';
	for($j = 0 ; $j < count($s) ; $j+=3){
		$h .= (!empty($s[$j+2]) ? $s[$j+2] : '');
		$h .= (!empty($s[$j+1]) ? $s[$j+1] : '');
		$h .= $s[$j];
	}//end for
	$k  = substr($h,-3);
	$h = substr($h,0,count($h)-4);
	$a = '';
	$l = 0;
	for($i = 0 ; $i < strlen($h) ; $i+=2){
		$d = hexdec(substr($h,$i,2));
		$l += $d;
		$a .= chr($d);		
	}//end for
	$a = ($k == substr($l,0,3) ? $a : '');
	return $a;
}//end function
?>