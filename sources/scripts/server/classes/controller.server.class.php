<?php
namespace server\classes\controller;

use server\classes\registry as registry;
use server\classes\Connection;
use server\traits\Response;
use server\traits\Singleton;

abstract class Controller { 
	use Response, Singleton;

	protected string $QUERY_TYPE;
	public $data;
	public $connection;
	public $databases;
	
	public function __construct( $data ){
		$this -> data = $data;
		$this -> databases = []; 
		$dbs = registry\Registry::instantiate()->objects;
		foreach ( $dbs  as $k => $v ){
			$this -> databases [ $k ] = $v;
		}
	}
		
	public function generic_query ( )
	{
		ini_set('display_errors', 1);
		$response = array ( );
		foreach ( $this->data ['REQUEST_QUERY' ] as $k => $v ){
			$connection = $this -> databases['DB'];
			
			if ( isset ( $v['db'] ) ){
				$connection = $this -> databases[ $v['db'] ];
			}
			#$req = $this->connection->execute( $v['sql'] , $v['values'] , \PDO :: FETCH_ASSOC );
			$req = $connection->execute( $v['sql'] , $v['values'] , \PDO :: FETCH_ASSOC );
			
			if ( $v['query_request'] == 'GET' ){
				if ( !isset($v['fetch_method']) ) 
					$response [$v['index']] = $req -> fetchAll ( );
				else if ( $v['fetch_method'] == 'FETCH' ){
					$response [$v['index']] = $req -> fetch ( );
				}
			}
			//sleep(1);
		}
		return ($response);
	}
	
	public function queryBuilder (Array $params = [])
	{
	}
	
	public function create () 
	{
		$this->QUERY_TYPE = 'CREATE';
		return $this;
	}
	public function read () 
	{
		$this->QUERY_TYPE = 'READ';
		return $this;
	}
	public function update ()
	{
		$this->QUERY_TYPE = 'UPDATE';
		return $this;
	}
	public function delete ()
	{
		$this->QUERY_TYPE = 'DELETE';
		return $this;
	}
		
}

?>