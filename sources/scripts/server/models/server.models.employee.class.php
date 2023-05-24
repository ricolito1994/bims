<?php
namespace server\classes\models;

use server\classes\models\ASModel; 
use server\classes\Connection;

use server\classes\models\BarangaySetup;
use server\classes\models\PositionModel;
use server\classes\models\ResidentModel;

class EmployeeModel extends ASModel {
	
	protected string $tableName = APP_NAME.'.barangay_emp_setup';
	protected string $databaseName = APP_NAME;
	protected string $className = 'EmployeeModel';
	
	public function __construct () 
	{
		parent::__construct();
	}
	
	public function getEmployees ()
	{
		return $this->select([],true);
	}
	
	public function position () 
	{
		return $this->join('INNER', 'c', BarangaySetup::class(), ['u.BARANGAY_ID', '=', 'c.BARANGAY_ID']);
	}
	
	public function resident () 
	{
		return $this->join('INNER', 'p', ResidentModel::class(), ['u.RESIDENT_ID', '=', 'p.RESIDENT_ID']);
	}
	
	public function barangay () 
	{
		return $this->join('INNER', 'ps', PositionModel::class(), ['u.POSITION', '=', 'ps.ID']);
	}
		
}
