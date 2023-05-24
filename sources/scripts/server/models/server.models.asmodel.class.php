<?php
// ELOQUENT PATTERN OF DATABASE QUERY
namespace server\classes\models;

use server\interfaces\ASModelInterface;
use server\classes\Connection;
use server\traits\Singleton;

abstract class ASModel implements ASModelInterface {
	use Singleton;
	
	protected string $tableName;
	protected string $databaseName;
	protected string $joinString;
	protected string $joinCondition;
	protected string $sqlString ;
	protected string $conditionString;
	protected string $limit;
	protected string $sortBy;
	protected string $groupBy;
	protected array $values = [];
	protected array $links = [];
	protected Connection $connection;
	protected $query;
	//public static $instance;
	
	public function __construct()
	{
		/* MUST BE A CONSTANT */
		$dev_host = constant('DEV_HOST');
		$dev_user = constant('DEV_USER');
		$dev_pass = constant('DEV_PASS');
		$app_name = constant('APP_NAME');
		
		$this->conditionString = "";
		$this->connection = new Connection ( [
			"CONNECTION_OBJECT" => [
				"HOST" => $dev_host,
				"USERNAME" => $dev_user,
				"PASSWORD" => $dev_pass,
				"DB" => $app_name,
			],
		]);
		$this->joinString = '';
		$this->sqlString = '';
	}
	
	public function join(string $joinType = 'JOIN', string $alias = '', $model, Array $joinArray = [])
	{
		$this->joinCondition = "";
		foreach ( $joinArray as $v ) {
			if ( is_array ( $v ) ) {
				foreach ( $v as $w ) {
					$cond .= $v[$w].' ';
					$this->joinCondition .= $cond ;
				}
			}
			else {
				$this->joinCondition .= " $v ";
			}
		}
		$tblName = $model->tableName;
		$this->joinString .= "$joinType JOIN $tblName as $alias ON $this->joinCondition";
		$this->links[] = $model;
		return $this;
	}
	
	
	public function select(Array $updateArray = [])
	{
		$conditions = "?";
		$alias = '';
		$values = [1];
		$fields = "*";
		
		if (isset ($updateArray["condition"])) {
			$this->conditionString = "where ".$this->conditionBuilder($updateArray["condition"]);
		}
		
		if (isset ($updateArray["fields"])) {
			$fields = "";
			foreach($updateArray["fields"] as $value) {
				$fields .= "$value,";
			}
			$fields = rtrim($fields,',');
		}
		
		if (isset ($updateArray["alias"])) {
			$alias = $updateArray["alias"];
		}
		
		
		
		$this->sqlString .= "SELECT $fields from $this->tableName $alias $this->joinString $this->conditionString";
		//var_dump($this->sqlString, $this->values);
		return $this;
	}

	protected function conditionBuilder (array $conditions = [], string $conditionString = "") {
		$conditionString .= "(";
		$i = 0;
		for (; $i < count ($conditions) ;$i++) {
			$condition = $conditions[$i];
			$conditionObjects = $condition['values'];
			$cond = $condition['cond']." ";
			$agg = isset ($condition['agg']) ? $condition['agg'] : false;
			$next = isset ($condition['next']) ? $condition['next'].'' : "";
			$ccount = count ($conditionObjects);
			$j = 0;
			$conditionString .= "(";
			foreach ($conditionObjects as $conditionKey => $conditionValue) {
				$operator = $conditionValue[0];
				if ($j == $ccount - 1) {
					$cond = "";
				}
				if ($agg) {
					$aggf = $agg['F'];
					$aggt = $agg['T'];

					if ($j == $ccount - 1) {
						$aggf = '';
						$aggt = '';
					}
					
					$conditionString .= "$aggt $aggf $operator $cond";
				}
				else {
					$conditionString .= "$conditionKey $operator $cond";
				}

				$this->values[] = $conditionValue[1];

				if ($j == $ccount - 1) {
					$conditionString .= ") $next";
					if (isset($condition['next_cond'])) {
						$conditionString = $this->conditionBuilder($condition['next_cond'], $conditionString);
					}
				}
				$j++;
			}
		}
		$conditionString .= ") ";
		return $conditionString;
	}

	public function subQuery(array $subQuery)
	{
	}

	public function has(ASModel $model)
	{
		return $model->join('join','', $this,[]);
	}

	public function first()
	{
	}

	public function last ()
	{
	}

	public function get()
	{	
	}

	public function orderBy (string $field, string $orderBy = 'ASC') 
	{
		$this->orderBy = " ORDER BY `$field` $orderBy";
		$this->sqlString .= $this->orderBy;
		return $this;
	}

	public function groupBy (string $field) 
	{
		$this->groupBy = " GROUP BY `$field`";
		$this->sqlString .= $this->groupBy;
		return $this;
	}

	public function limit (string $limit = '1') 
	{
		$this->limit = " LIMIT $limit ";
		$this->sqlString .= $this->limit;
		return $this;
	}

	
	public function update(Array $updateArray = [])
	{
		$sql = "UPDATE";
		return $this;
	}
	
	public function create(Array $updateArray = [])
	{
		return $this;
	}
	
	public function delete(Array $updateArray = [])
	{
		return $this;
	}
	
	public function fetch() 
	{
		$this->processQuery();
		return $this->query->fetch();
	}
	
	public function fetchAll() 
	{
		$this->processQuery();
		return $this->query->fetchAll();
	}
	
	/*
	 * GET ALL FIELDS/COLUMNS of specified database
	 *
	*/
	protected function fields ()
	{
		$sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '$this->databaseName' AND TABLE_NAME = '$this->tableName'";
	}

	protected function processQuery ()
	{
		$this->query = $this->connection->execute($this->sqlString, $this->values, \PDO::FETCH_ASSOC);
	}
}