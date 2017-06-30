document.write("<script type='text/javascript' src='RSA.js'></script>");
document.write("<script type='text/javascript' src='BigInt.js'></script>");
document.write("<script type='text/javascript' src='Barrett.js'></script>");
function RSAEnc(pin,publicKeyN,publicKeyE){
	setMaxDigits(131);//131 => publicKeyN的十六进制位数/2+3
	key = new RSAKeyPair(publicKeyE,"",publicKeyN);
	//console.log(key);
	var result = encryptedString(key, pin); 
	return result;
}

/**
 * 随机数生成函数
 * @param Min 最小数
 * @param Max 最大数
 * @returns 范围内的整数
 */
function GetRandomNum(Min,Max){   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return(Min + Math.round(Rand * Range));   
}   