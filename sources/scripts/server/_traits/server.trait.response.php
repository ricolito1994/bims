<?php
namespace server\traits;

trait Response {	
	public static function response($content = [], $httpCode = 200)
    {
		header('Content-Type: application/json');
        http_response_code($httpCode);
		
        if (is_array($content)) {
            echo json_encode($content);
        } else {
            echo $content;
        }
        
        //http_response_code($httpCode);
        die;
    }
	/* public static function jsonResponse($content = '', $httpCode = 200)
    {
        header('Content-Type: application/json');
        http_response_code($httpCode);

        switch (true) {
            case $content instanceof Collection:
            case $content instanceof Model;
                $content = $content->toArray();
                break;
        }
        
        if (is_array($content)) {
            $content = arrayToUtf8($content);
        }
        
        echo json_encode($content);
        die;
    } */
}