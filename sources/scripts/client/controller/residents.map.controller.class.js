import { Modal } from "../classes/modal.controller.class.js"
import { GoogleMapsAPIWidget } from "../classes/google.maps.api.widget.class.js";


export class ResidentialMapController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
	}
	
	constructs(){
		let gmapsWidget = new GoogleMapsAPIWidget ({
			parent : this,
			controllerName : "GoogleMapsWidgetAPIController",
			template : `/${this.mainService.appname}/sources/templates/section/google.maps.widget.template.html`,
			modalID : "GoogleMapsWidgetAPI",
			args : {
				//API KEY
				API : 'AIzaSyDnXTIoNC48BDf-rr-GmSUjWQ1tCh-Kqhk' ,
				MAP_ID : '8eeca318d18c0ac',
				LAT : 10.632334577962883,
				LNG : 122.97630074834835,
				ZOOM : 18,
				MAP_TYPE : "roadmap",
				TILT : 45,
				SCROLLWHEEL : true,
				//DEFAULT_LOCATION : `${session_data.COMPANY_NAME} ${session_data.CITY} ${session_data.PROVINCE}`,
			},// alertoapp2018@gmail.com pw alertoapp@2023
		});
		gmapsWidget.renderDiv("residential-map-container");
	}
	
	newLocation(){
	}
	
	init(){
		
	}

}
