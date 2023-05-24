// Service classes
import { Controller } from "../classes/controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SideMenuBar } from "../classes/side.menu.bar.class.js"; 
// import your controller class here
import { LuponDashboardController } from "./lupon.dashboard.controller.class.js";

export class LuponController extends Controller {
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this.subpages = [
			{
				object : new LuponDashboardController({
					modalID :  "lupon-dashboard",
					controllerName : "LuponDashboardController",
					template : "/bis/sources/templates/section/lupon.dashboard.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			
		];
		
		setTimeout(()=>{
			this.initialize();
			this.binds (controller,elem);
			this.bindChildObject(this,false);
		},100);
	}
	
	initialize(){
		let smb = new SideMenuBar ( {
			modalID :  "side-menu-bar",
			controllerName : "SideMenuBar",
			template : "/bis/sources/templates/section/side.menu.bar.section.template.html",
			parent : this,
			isUpdate : true,
			isRestored : true,
			oppositeDiv : "main-content-lupon",
			menuParentDiv : "#sidebar-lupon",
			defaultIndex : 0,
			args : {
				menus : [
					{
						name : "Dashboard",
						icon : {
							isClass : false,
							value : "&#127968;",
						},
						func : "",
						isActive : true,
						page : this.subpages[0],
						width : "4.5vh",
					},
						
				]
			}
		} );
		smb.renderDiv("sidebar-lupon");
	}
	
	report ( args ){
		
	}
}