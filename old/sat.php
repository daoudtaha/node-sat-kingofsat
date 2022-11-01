<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<?php

//if(isset($_GET['tp'])){

	//$tp=$_GET['tp'];
	$link='http://fr.kingofsat.net/pos-19.2E.php';
	$link='http://fr.kingofsat.net/pos-7W.php';
	$link='http://fr.kingofsat.net/pos-19.2E_fra.php';
	//$link='http://fr.kingofsat.net/tp.php?tp='.$tp;

	require_once('simple_html_dom.php');
	$res=array();
	
	$nb=5;
	
	//echo '=== File ====</br>';
	//$html =  file_get_contents('./192fr.html');
	//echo '= nbr : '.strlen($html).'</br>';
	//echo '= Start : |'.substr($html,0,$nb).'|</br>';
	//echo '= End : |'.substr($html,-$nb).'|</br>';
	
	/*
	echo '=== Lien ====</br>';
	$html = file_get_html('http://fr.kingofsat.net/pos-19.2E_fra.php');
	echo '= nbr : '.strlen($html).'</br>';
	echo '= Start : |'.substr($html,0,$nb).'|</br>';
	echo '= End : |'.substr($html,-$nb).'|</br>';
	
	*/

	//$html = file_get_contents('./7W.html');
	//$html = file_get_contents('./192fr.html');
	//echot(strlen($html));
	
	
	echo '=== File ====</br>';
	$html =  file_get_contents('./test.html');
	echo '= nbr : '.strlen($html).'</br>';
	echo '= Start : |'.substr($html,0,$nb).'|</br>';
	echo '= End : |'.substr($html,-$nb).'|</br>';
	
	

	
	//if(is_object($html)){

		//echot(strlen($html));
		$ret = $html->find('table.frq tr[bgcolor=#D2D2D2] .pos');
		
		foreach($ret as $e) {
			$res['FREQ']['POS']=$e->innertext;
		}

		$ret = $html->find('table.frq tr[bgcolor=#D2D2D2] .bld');
		foreach($ret as $k => $e) {
		$res['FREQ']['F'.$k]=$e->innertext;
		}

		$ret = $html->find('*[id^=m] table tr'); 
		foreach($ret as $e) {
			//echot( $e->find(".ch",0)->innertext );
			if(sizeof($e->find("td.ch a.A3"))>0){
				$res['CHAINE'][]=array(
					//'SIZE' => sizeof($e->find("td.ch a.A3")),
					//'NOM' => $e->find("td.ch a.A3",0)->innertext,
					'NOM' => $e->find("td.ch a.A3",0)->innertext,
					'PAYS' => $e->find("td.pays",0)->innertext,
					'GENRE' => $e->find("td.genre",0)->innertext,
					'BQ' => $e->find("td.bq",0)->innertext,
					'MPEG4' => check($e->find("td.mpeg4 a img",0),'src'),
					'CR' => (strtoupper($e->find("td.cr",0)->innertext)=='CLAIR' ? 'CLAIR' :'GSHARE'),
					'SON' => check($e->find("td a font[color=blue]",0),'innertext').check($e->find("td a font[color=blue]",1),'innertext').check($e->find("td a font[color=blue]",2),'innertext'),
					//'B' => $e->find(".ch",0)->innertext ,
				);
			}

		}

		echot($res);
	
	//}else{
	//	echo 'non object';
	//}

/*}else{
	echo 'error tp';
}*/


function check($obj,$txt){
	if(isset($obj)){
		return '/'.str_replace('/','',str_replace('.gif','',$obj->{$txt}));
	}else{
		return '';
	}
}

//echot ( sizeof($ret) );
//echot ( $ret );

// Find all images
//foreach($html->find('div') as $e1) {
	//if($e1->id[0]=='m'){
	//if($e1->id=='m1'){
		//echot($e1);
		//echot($e1->attr);
		//echot($e1->children);
		/*$e2=$e1->find('tr');
		echo $e1->id.' : '.sizeof($e2).'<br>';
		if( sizeof($e2)>0 ){
			foreach($e2 as $e3) {
				//echot(TRcanal($e3));
			}
		}*/
	//}
    //echo $element->id . '<br>';
//}

// Find all links
/*foreach($html->find('a') as $element) 
       echo $element->href . '<br>';*/

// Translate whole document to plain text
//echo file_get_html($link)->plaintext; 


function TRcanal($e){
	$res=array();
	return $e->find('.ch');
}

function echot($d){
	echo '<pre>';
	print_r($d);
	echo '</pre>';
}

