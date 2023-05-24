import { Controller } from "../classes/controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";


export class LoginPage extends Controller {
	
	constructor ( controllerName , service , elem ){
		super ( controllerName , service , elem );
		console.log (this.mainService);
		this[controllerName] = { 
			username : "" , 
			password : "" 
		};	
		
		//console.log("AA");
		this.binds (controllerName,elem);
		this.bindChildObject(this,false);
	}
	
	login_on_enter ( ...arg ){
		let enter = arg[1]['key'] == 'Enter';
		if ( enter ) this.login();
	}
	
	
	login (  ){
		this.bindChildObject(this,true);
		//console.log(this.username , this.password);
		
		let login_request = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'get_login_auth',
					/*REQUEST_QUERY : [
						{
							sql : `SELECT *,u.ID as ID FROM bis.barangay_emp_setup as u 
							INNER JOIN bis.barangay_setup c  
							ON u.BARANGAY_ID = c.BARANGAY_ID 
							INNER JOIN bis.barangay_res_setup p 
							ON u.RESIDENT_ID = p.RESIDENT_ID 
							LEFT JOIN bis.barangay_position_setting ps 
							ON u.POSITION = ps.ID 
							WHERE u.USERNAME = ? and u.PASSWORD = ?`,
							query_request : 'GET',
							index : 'login',
							values : {
								username : escape (this.username),
								password : escape (this.password)
							}
						}
					]*/
					values : {
						username : escape (this.username),
						password : escape (this.password)
					}
				}
						
			}
		};
		
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : `/${this.mainService.appname}/sources/templates/modal/loading.modal.template.html`,
			parent : this,
		});
		
		
		load.render();
		//console.log(login_request);
		this.mainService.serverRequest( login_request , ( res ) => {
			setTimeout ( ( ) => {
				if ( res.res ) {
					res['SESSION_ID_DATA'] = this.mainService.makeid(24);
					this.mainService.serverRequest( {
						type: "POST",
						url : this.mainService.urls["auth"]['url'],
						data : {
							data : {
								request : 'login',
								login_data : res,
							}
						}
					}, ( res ) => {
						location.reload();
						
					}, (err) => {
						console.error(err);
					});
				} else {
					load.onClose();
					document.querySelector("#login-errmsg").className="alert alert-danger";
					return;
				}
				load.onClose();
			},100); 
			
		} 
		, ( res ) => {
			//err
			console.error(res);
		}); 
	}
	
}