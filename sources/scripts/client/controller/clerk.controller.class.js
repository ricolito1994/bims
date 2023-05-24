// Service classes
import { Controller } from "../classes/controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SideMenuBar } from "../classes/side.menu.bar.class.js"; 
// import your controller class here
import { ClerkDashboardController } from "./clerk.dashboard.controller.class.js"; 
import { ClerkDocumentsController } from "./clerk.documents.controller.class.js"; 

export class ClerkController extends Controller {
	
	constructor ( controller , service , elem ){
		super ( controller , service , elem );
		
		this.subpages = [
			{
				object : new ClerkDashboardController({
					modalID :  "clerk-dashboard",
					controllerName : "ClerkDashboardController",
					template : "/bis/sources/templates/section/clerk.dashboard.template.html",
					parent : this,
					isUpdate : true,
				}),
				isRendered : false,
			},
			{
				object : new ClerkDocumentsController({
					modalID :  "clerk-documents",
					controllerName : "ClerkDocumentsController",
					template : "/bis/sources/templates/section/clerk.documents.template.html",
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
			oppositeDiv : "main-content-clerk",
			menuParentDiv : "#sidebar-clerk",
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
					{
						name : "Documents",
						icon : {
							isClass : false,
							value : "📃",
						},
						func : "",
						isActive : true,
						page : this.subpages[1],
						width : "4.5vh",
					},
					
				]
			}
		} );
		smb.renderDiv("sidebar-clerk");
	}
	
	report ( args ){
	}
}