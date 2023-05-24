<?php
namespace server\traits;

trait Helper {

    public static function getConstant (string $constantName) 
    {
        return APPLICATION_CONSTANTS [$constantName];
    }

}