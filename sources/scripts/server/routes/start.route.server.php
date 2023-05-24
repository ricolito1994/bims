<?php
/* Initializes all server essenstials */
namespace server\routes\start
{
#$root = ($_SERVER["DOCUMENT_ROOT"]);
use server\classes\Connection;
use server\classes\registry as registry;

use server\classes\controller as Controller;
use server\controller\profile as Profile;


/* include your class files here */
require dirname(dirname(__FILE__))."\constants\connection.server.constants.php";

require dirname(dirname(__FILE__))."\_traits\server.trait.singleton.php";
require dirname(dirname(__FILE__))."\_traits\server.trait.response.php";
require dirname(dirname(__FILE__))."\_traits\server.trait.helper.php";

require dirname(dirname(__FILE__))."\models\server.models.asmodel.interface.php";
require dirname(dirname(__FILE__))."\models\server.models.asmodel.class.php";
require dirname(dirname(__FILE__))."\models\server.models.employee.class.php";
require dirname(dirname(__FILE__))."\models\server.models.barangay.setup.class.php";
require dirname(dirname(__FILE__))."\models\server.models.position.model.class.php";
require dirname(dirname(__FILE__))."\models\server.models.resident.class.php";

require dirname(dirname(__FILE__))."\classes\connection.server.class.php";
require dirname(dirname(__FILE__))."\classes\_registry.server.class.php";
require dirname(dirname(__FILE__))."\classes\controller.server.class.php";

require dirname(dirname(__FILE__))."\controllers\profile.controller.class.php";
require dirname(dirname(__FILE__))."\controllers\_event.controller.class.php";

require dirname(dirname(__FILE__))."\services\server.file.service.class.php";
require dirname(dirname(__FILE__))."\services\server.response.service.class.php";

$registry = registry\Registry::instantiate();
/* Register your database connection here */

/* use this for dev */
$dev_host = 'localhost';
$dev_user = 'root';
$dev_pass = '';



$registry->SET ("DB" , new Connection ( [
	"CONNECTION_OBJECT" => [
		"HOST" => $dev_host,
		"USERNAME" => $dev_user,
		"PASSWORD" => $dev_pass,
		"DB" => APP_NAME,
	],
]) );


}
?>