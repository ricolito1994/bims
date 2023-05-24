<?php

namespace server\traits;

trait Singleton {
	public static $instance;
	
	public static function class()
	{
		$className = get_called_class();
		/*if(!self::$instance)
		{
		  self::$instance = new $className;
		}
		return self::$instance;*/
		return new $className;
	}
}