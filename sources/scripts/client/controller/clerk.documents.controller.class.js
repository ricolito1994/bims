import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { ClerkDocumentsModalController } from "./clerk.documents.modal.controller.class.js"

export class ClerkDocumentsController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.brgyname = session_data.BARANGAY_NAME;
		this.PRK_NAME = "";
		this.PRK_LEADER = "";
		this.CLERK_DOC_TYPE = "";
		this.CLERK_DOC_DATE_ISSUED = this.mainService.getCurrentDate();
	}
	
	constructs(){
		this.dataTable = new DataTableService({
			template : "/bis/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".resident-table-container",
			filterElems : [],
			fields : [
				{
					head : "ISSUED TO",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['ISSUED_TO_NAME'];
									},
								}
							]
						}
					]
				},
				{
					head : "DOCUMENT TYPE",
					sort : {
						asc : ['barangay_document'],
						dsc : ['-barangay_document'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return `${selData['barangay_document']}`;
									},
								}
							]
						}
					]
				},
				{
					head : "DATE ISSUED",
					sort : {
						asc : ['date_issued'],
						dsc : ['-date_issued'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return `${selData['date_issued']}`;
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
										//this.openitem(arg);
										//this.openwarehouse(arg);
										this.openPurok(args);
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

		});
		this.optionsBaranggayDocTypes();
		this.init();
	}
	
	changeFilter(){
		this.bindChildObject(this,this.elem);
		this.init();
	}
	
	onUpdateTable(){
		this.changeFilter()
	}
	
	openPurok(args){
		let usm = new ClerkDocumentsModalController({
			modalID :  "clerk-documents-modal",
			controllerName : "ClerkDocumentsModalController",
			template : "/bis/sources/templates/modal/clerk.documents.modal.template.html",
			parent : this,
			isUpdate : args.BDID ? true : false,
			args : args.BDID ? args : {},
			instanceID : this.mainService.generate_id_timestamp("res"),
			onSearchEvent : `${this.controllerName}:onUpdateTable`,
		});
		usm.render();
	}
	
	onLinkPL ( arg ){
		let args =arg.detail.query;
		this.PRK_LEADER = args.RESIDENT_ID
		this.PRK_LEADER_NAME = args.FULLNAME;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
		args.modal.onClose();
	}
	
	removePurokLeader(){
		this.PRK_LEADER = ``
		this.PRK_LEADER_NAME = ``;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
	}
	
	choosePurokLeader( arg ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/bps/sources/templates/modal/search.modal.template.html",
			params : {
				type :  'resident',
				action : 'link',
				controller : this.controllerName,
				evt : ':onLinkPL',
				//arg : args,
				instanceID : this.mainService.generate_id_timestamp("sm"),
			},
			parent : this,
		});
		ssm.render();
	}
	
	async optionsBaranggayDocTypes ( ) {
		let docTypes = await this.getBaranggayDocTypes ( );
		let dombgydoctypes = document.getElementById ( "clerk-documents-type" );
		let opt0 = document.createElement("option");
			opt0.value = "";
			opt0.innerText = "ALL TYPES";
		dombgydoctypes.appendChild(opt0);	
		
		for ( let i in docTypes ) {
			let d = docTypes[i];
			let opt = document.createElement("option");
				opt.value = d.barangay_doc_id;
				opt.innerText = d.barangay_document;
			dombgydoctypes.appendChild(opt);	
		}
	}
	
	getBaranggayDocTypes ( ) { 
		return new Promise ( ( resolve , reject ) => { 
			let dataQuery = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : `SELECT * FROM bis.barangay_document_types where ?`,
								db : 'DB',
								query_request : 'GET',
								index : 'result',
								values : [1]
							},	
						]
					}
							
				}
				
			};
			
			this.mainService.serverRequest( dataQuery , ( res ) => {
				resolve (JSON.parse(res).result);
			} 
			, ( res ) => {
				//err
				console.log(res);
			});		
		});
	}
	
	
	init(){
		//console.log(this.PRK_NAME)
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT *,BD.barangay_document_id as BDID,
							BD.date_issued date_issued,
							IF( ISNULL(BUS.ID) , CONCAT (BRS.FIRSTNAME,' ',BRS.LASTNAME) , BUS.BUS_NAME) AS ISSUED_TO_NAME ,
							CONCAT (BRSS.FIRSTNAME,' ',BRSS.LASTNAME) AS ISSUED_BY_NAME 
							FROM bis.barangay_document BD 
							INNER JOIN bis.barangay_document_types BDT ON BD.barangay_doc_type_id = BDT.barangay_doc_id 
							LEFT JOIN bis.barangay_res_setup BRS ON BRS.ID = BD.issued_to 
							LEFT JOIN bis.barangay_emp_setup BES ON BES.ID = BD.issued_by 
							LEFT JOIN bis.barangay_res_setup BRSS ON BRSS.RESIDENT_ID = BES.RESIDENT_ID  
							LEFT JOIN bis.barangay_bus_setup BUS ON BUS.ID = BD.issued_to  
							where ? ORDER BY BD.barangay_document_id DESC`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [1]
						},	
					]
				}
						
			}
			
		};
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			
			setTimeout( ( ) => {
				let stds = (JSON.parse(res))['result'];
				
				let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
				console.log(stds);
				this.dataTable.setTableData(stds);
				
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
				//load.onClose();
			
			},300);
		} 
		, ( res ) => {
			//err
			console.log(res);
		});	
	}

}
	