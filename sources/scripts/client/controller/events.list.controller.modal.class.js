import { Modal } from "../classes/modal.controller.class.js";
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { MainService } from "../classes/main.service.class.js";
// controllers
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { LuponSummonModalController } from "./lupon.summon.modal.controller.js";

export class EventListControllerModal extends Modal {

	constructor ( modalData ){
		super ( modalData );
		this.date = this.modalData.params.date.thisDate;
		this.type = this.modalData.params.type;
		this.eventTypes = {
			"Summon" : {
				"ref_id" : "barangay_summons",
				"dataTable" : {
					"query" : {
						"sql" : `SELECT 
									bs.BARANGAY_CASE_NUMBER, 
									bs.SUMMON_ID,
									bs.CASE_TYPE,
									bs.ISSUED_BY,
									bs.ISSUED_DATE,
									bs.DESCRIPTION,
									bs.HAS_SETTLEMENT_AGREED,
									bs.HAS_ATTENDED_HEARING,
									bs.DATE_ENCODED,
									bs.TIME_ENCODED,
									bs.CAPTAIN,
									be.ID,
									be.EVENT_DESCRIPTION, 
									be.DATE_START, 
									be.TIME_START, 
									be.TIME_END,
									be.REF_ID,
									be.REF_TABLE,
									be.EVENT_DESCRIPTION,
									be.PLACE,
									be.COLOR,
									CONCAT(be.TIME_START,'-',be.TIME_END) AS TIME_ALOT,
									CONCAT(brs.FIRSTNAME,' ',brs.LASTNAME) AS ISSUED_BY_NAME 
									FROM bis.barangay_events be 
									INNER JOIN bis.barangay_summons bs ON bs.BARANGAY_CASE_NUMBER = be.REF_ID 
									LEFT JOIN bis.barangay_emp_setup bes ON bes.ID = bs.ISSUED_BY 
									LEFT JOIN bis.barangay_res_setup brs ON brs.RESIDENT_ID = bes.RESIDENT_ID WHERE be.DATE_START = ?;`,
						"values" : [this.date],
					},
					"dataTableFields" : [
						{
							head : "CASE NO",
							sort : {
								asc : ['emplast'],
								dsc : ['-emplast'],
							},
							sortBy : 'asc',
							elements : [
								{
									createElement : "b",
									attributes : [
										{
											attribute : "innerText",
											value : ( selData ) => {
												return selData['BARANGAY_CASE_NUMBER'];
											},
										}
									]
								}
							]
						},
						{
							head : "DATE",
							elements : [
								{
									createElement : "span",
									attributes : [
										{
											attribute : "innerText",
											value : ( selData ) => {
												return selData['DATE_START'];
											},
										}
									]
								}
							]
						},
						
						{
							head : "TIME START",
							elements : [
								{
									createElement : "span",
									attributes : [
										{
											attribute : "innerText",
											value : ( selData ) => {
												return selData['TIME_START'];
											},
										}
									]
								}
							]
						},
						
						{
							head : "TIME END",
							elements : [
								{
									createElement : "span",
									attributes : [
										{
											attribute : "innerText",
											value : ( selData ) => {
												return selData['TIME_END'];
											},
										}
									]
								}
							]
						},
						
						{
							head : "ISSUED BY",
							elements : [
								{
									createElement : "span",
									attributes : [
										{
											attribute : "innerText",
											value : ( selData ) => {
												return selData['ISSUED_BY_NAME'];
											},
										}
									]
								}
							]
						},
						{
							head : "ACTION",
							elements : [
								{	
									createElement : "a",
									attributes : [
										{
											attribute: "href",
											value : "javascript:void(0);",
										},
										{
											attribute: "className",
											value : "btn btn-primary",
										},
										{
											type : "event",
											attribute : "click",
											value : ( args ) => {
												this.newEventModal(args);
											},
										}
									],
									children : [
										{
											createElement : "i",
											attributes : [
												{
													attribute: "className",
													value : "icon-search",
												}
											]
										}
									]
								},
								{	
									createElement : "span",
									attributes:[
										{
											attribute:"innerHTML",
											value : "&nbsp;"
										}
									]
								},
								
								{	
									createElement : "span",
									attributes:[
										{
											attribute:"innerHTML",
											value : "&nbsp;"
										}
									]
								},
								
							]
						},
					],
				},
				"newEventModal" : ( params ) => {
					params['isUpdate'] = typeof params['SUMMON_ID'] !== 'undefined';
					let luponModal = new LuponSummonModalController ({
						modalID :  "lupon-modal",
						controllerName : "LuponSummonModalController",
						template : "/bis/sources/templates/modal/lupon.summon.modal.template.html",
						params : params,
						parent : this,
						onUpdate : `${this.controllerName}:onUpdate`,
					});
					luponModal.render();
				},
			}
		}
	}
	
	init () {
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : this.eventTypes[this.type].dataTable.query.sql,
							values : this.eventTypes[this.type].dataTable.query.values,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
						},	
					]
				}
						
			}
		};
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			setTimeout( ( ) => {
				let stds = (JSON.parse(res))['result'];
				let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
				this.dataTable.setTableData(stds);
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
			},110);
		} 
		, ( res ) => {
			console.log(res);
		});	
	}
	
	newEventModal ( paramsFromSearch ) {
		this.eventTypes[this.type].newEventModal(!paramsFromSearch['SUMMON_ID'] ? this.modalData.params.date : paramsFromSearch);
	}
	
	onUpdate ( args ) {
		this.init();
		MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.onUpdate}`, {
			detail : {
				query : {
				}
			} 
		});
	}
	
	constructs () {
		this.dataTable = new DataTableService({
			template : "/bis/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".events-table-container",
			filterElems : [],
			fields : this.eventTypes[this.type].dataTable.dataTableFields,

		});
		this.init();
	}
}