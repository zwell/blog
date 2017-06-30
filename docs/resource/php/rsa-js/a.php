<?php

    file_put_contents('test.cookie', '');

    require_once 'rsa.php';
	$rsa = new biRSAKeyPair($publicKeyE, '0', strtolower($publicKeyN));
	$pinvalue = strtoupper($rsa->biEncryptedString($pass));

	$plaintext = strlen($CARDNBR).$CARDNBR.$pinvalue.rand(0,999);
	$rsa = new biRSAKeyPair($rsaPublicKeyE, '0', strtolower($rsaPublicKeyN));
	$encPin = strtoupper($rsa->biEncryptedString($plaintext));

	$url = "×";
    $header = ['Accept-Language: zh-CN,zh;q=0.8,en;q=0.6', 'Accept-Encoding: gzip, deflate, br', 'Content-Type: application/json', 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3135.4 Safari/537.36', 'Host: onlineuat.cupdata.com:50005', 'Connection: keep-alive'];
    $result = request($url, 'POST', json_encode(['encPin' => $encPin]), $header);
    print_r($result);exit;

    function request($url, $type, $data, $header = [])
    {
        $cookie_jar = "test.cookie";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $type);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_PROXY, '192.168.8.155:8888');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        if (parse_url($url, PHP_URL_HOST) == "onlineuat.cupdata.com") {
            if (file_get_contents($cookie_jar)) {
                curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_jar);
            } else {
                curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_jar);
            }
        }
        if ($type == 'POST' || $type == 'PUT') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        $result = curl_exec($ch);
        if (($err_no = curl_errno($ch))) {
            $result = [
                'code'=>-1,
                'message'=>'CURL请求失败,CURL ERR NO：'.$err_no
            ];
        }
        curl_close($ch);
        echo "\n".$url."\n";
        print_r($data);
        print_r($result);
        return $result;
    }