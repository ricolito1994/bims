<?php
namespace server\classes\models;

use server\classes\models\ASModel ; 
use server\classes\Connection;

class PositionModel extends ASModel {
	protected string $tableName = APP_NAME.'.barangay_position_setting';
	protected string $databaseName = APP_NAME;
	protected string $className = 'PositionModel';
	
	public function __construct () 
	{
		parent::__construct();
	}
	
}
