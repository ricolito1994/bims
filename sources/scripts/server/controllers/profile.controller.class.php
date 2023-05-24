<?php
namespace server\classes\controller;

use server\classes\controller\Controller;
use server\classes\models\EmployeeModel ;
use server\traits\Helper;

class Profile extends Controller 
{
	use Helper;

	public function __construct( $data )
	{
		parent::__construct( $data );
	}
	
	public function getUserAuthProfile () 
	{
		if ($this->QUERY_TYPE !== 'READ') {
			throw new \Exception ("You can't chain other query type!");
		}
		try{
			$query = 
				EmployeeModel::class()
					->barangay()
					->resident()
					->position()
					->select([
						"alias" => 'u',
						"condition" => [
							[
								"cond" => 'AND',
								"values" =>[
									"username" => ['=?',$this->data['values']['username']],
									"password" => ['=?',$this->data['values']['password']],
								],
							],
						],
						"fields" => [
							'*','u.ID as ID'
						],
					])
					->fetch();
			self::response (['res' => $query], 200);
		}
		catch (\Exception $e) {
			self::response (['res' => $e], 400);
		} 
	}

	public function getConstant(string $constant) 
	{
		self::response (['res' => constant($constant)], 200);
	}

	public function getSessionData() 
	{
		session_start();
		self::response (['res' => $_SESSION], 200);
	}

	public function getIpAddress()
	{
		$ip_address = "";
		$protocol = "";
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
			$ip_address = $_SERVER['HTTP_CLIENT_IP'];
		}
		//whether ip is from proxy
		elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
		}
		//whether ip is from remote address
		else {
			$ip_address = $_SERVER['REMOTE_ADDR'];
		}
		#echo $ip_address ;
		if( isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ) 
			$link = "https"; 
		else
			$link = "http"; 
	
		self::response (
			[
				'ip_address' => $ip_address == '::1' ? 'localhost' : $ip_address, 
			 	'protocol' => $link,
				'app_name' => constant('APP_NAME'),
			], 200);
	}
}
