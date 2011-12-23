<?php
$m1=microtime();
for($i=0;$i<100000;$i++) {
	$h=md5('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'.$i);
}
$m2=microtime();

$m1=explode(' ',$m1);
$m1=intval($m1[1].substr($m1[0],2,3));
$m2=explode(' ',$m2);
$m2=intval($m2[1].substr($m2[0],2,3));
echo($m2-$m1);

?>