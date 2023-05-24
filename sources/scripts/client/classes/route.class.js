import { ControllerModule } from "../controller/controller.module.class.js";
import { MainService } from "./main.service.class.js";

export class Route{
	
	constructor ( ){
		let ipAdd = this.ipAdd();
		ipAdd.then ( (res) => {
			console.log(res);
			let prot = res.prot;
			let ipaddress = res.ipadd;
			let appname = res.appname;
			let baseUrl = `${prot}://${ipaddress}/${appname}`;
			this.cm = new ControllerModule();
			this.routes = {
				"" : {
					url : `${baseUrl}/sources/templates/pages/dashboard.page.template.html`,
				},
				
				"settings" : {
					url : `${baseUrl}/sources/templates/pages/settings.page.template.html`,
				},
				
				"residents" : {
					url : `${baseUrl}/sources/templates/pages/residents.page.template.html`,
				},
				
				"clerk" : {
					url : `${baseUrl}/sources/templates/pages/clerk.page.template.html`,
				},
				
				"lupon" : {
					url : `${baseUrl}/sources/templates/pages/lupon.page.template.html`,
				},
			
				"hr" : {
					url : `${baseUrl}/sources/templates/pages/hr.page.template.html`,
				},
				
				"projects" : {
					url : `${baseUrl}/templates/pages/projects.page.template.html`,
				},
				
				"healthcenter" : {
					url : `${baseUrl}/templates/pages/health.center.page.template.html`,
				},
				
			}
		});
	}

	async ipAdd () {
		let ipadd = await MainService.getIpAddress();
		let prot = ipadd.protocol;
		let ipaddress = ipadd.ip_address;
		let appname = ipadd.app_name;
		return new Promise ( (resolve, reject) => {
			resolve ({
				prot : prot,
				ipadd : ipaddress,
				appname : appname,
			})
		} )
	}
	
	load ( e ) {
		
		setTimeout (()=>{
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function (e) { 
				if (xhr.readyState == 4 && xhr.status == 200) {	
					if (document.getElementById("container-pages")){
						document.getElementById("container-pages").innerHTML = "";
						document.getElementById("container-pages").innerHTML = xhr.responseText;
					}
					
					ControllerModule.initializeControllers();
				}
			}
			xhr.open("GET", this.routes[e].url, true);
			xhr.setRequestHeader("Cache-Control", "no-cache");
			xhr.setRequestHeader("Pragma", "no-cache");
			xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
			xhr.send();
		},100);
	}
	
}