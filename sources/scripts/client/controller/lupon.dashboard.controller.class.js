import { Modal } from "../classes/modal.controller.class.js"
import { CalendarService } from "../classes/mycalendar.service.class.js";
import { EventListControllerModal } from "./events.list.controller.modal.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";

export class LuponDashboardController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
	}
	
	constructs(){
		this.calendar = new CalendarService({
			parent : this,
			calendarTemplate : '/bis/sources/templates/section/calendar.section.template.html',
			parentDiv : '#lupon-dashboard-content div',
			updateEvent : ":onUpdateCalendar",
			fields : {
				'date' : 'DATE_START',
				'caldesc' : 'BARANGAY_CASE_NUMBER',
			}
		});
	}
	
	onUpdateCalendar(){
		this.calendar.spawnCalendar();
	}
	
	init(){
		
	}
	
	getData ( fromDate , toDate ) {
		let sql = `SELECT * FROM bis.barangay_events bes INNER JOIN bis.barangay_summons bs ON bs.BARANGAY_CASE_NUMBER = bes.REF_ID WHERE bes.DATE_START BETWEEN ? AND ?`;
		return new Promise ( ( resolve, reject) => {
			let request = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : sql,
								db : 'DB',
								query_request : 'GET',
								index : 'cal_obj',
								values : [ fromDate, toDate ]
							},	
									
						]
					}
									
				}
			};
			this.mainService.serverRequest( request , ( res ) => {
				res = JSON.parse(res);
				resolve(res.cal_obj);
			},err=>{
				reject (err);
			});
		})
	}
	
	clickDates ( params ) {
		let holidayModal = new EventListControllerModal ({
			modalID :  "events-list-modal",
			controllerName : "EventListController",
			template : "/bis/sources/templates/modal/events.list.modal.template.html",
			params : {
				date : params,
				type : "Summon",
			},
			onUpdate : this.controllerName+':onUpdateCalendar',
			parent : this,
		});
		holidayModal.render();
	}
}