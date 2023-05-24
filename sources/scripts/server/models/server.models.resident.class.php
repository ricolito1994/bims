<?php
namespace server\classes\models;
use server\classes\models\ASModel ; 
use server\classes\Connection;

class ResidentModel extends ASModel {
	protected string $tableName = APP_NAME.".barangay_res_setup";
	protected string $databaseName = APP_NAME;
	protected string $className = 'ResidentsModel';
	
	public function __construct () 
	{
		parent::__construct( );
	}
	
}
