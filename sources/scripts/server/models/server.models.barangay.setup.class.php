<?php
namespace server\classes\models;

use server\classes\models\ASModel; 
use server\classes\Connection as Conn;

class BarangaySetup extends ASModel {
	protected string $tableName = APP_NAME.'.barangay_setup';
	protected string $databaseName = APP_NAME;
	protected string $className = 'BarangaySetup';
	
	public function __construct () 
	{
		parent::__construct( );
	}
	
}
