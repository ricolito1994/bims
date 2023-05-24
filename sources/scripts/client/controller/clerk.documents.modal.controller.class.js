import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";

export class ClerkDocumentsModalController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.brgyname = session_data.BARANGAY_NAME;
		this.tenYearsAgo = this.mainService.minusDays(this.mainService.getCurrentDate(),3650)
		this.isUpdate = this.modalData.isUpdate;	
		this.ISSUED_TO_NAME = this.modalData.args.ISSUED_TO_NAME ? this.modalData.args.ISSUED_TO_NAME : `${session_data.FIRSTNAME} ${session_data.LASTNAME}`;
		this.ISSUED_BY_NAME = this.modalData.args.ISSUED_BY_NAME ? this.modalData.args.ISSUED_BY_NAME : `${session_data.FIRSTNAME} ${session_data.LASTNAME}`;
		this.IS_PRK_LEADER = 1;
		this.prkvars = {
			issued_to : session_data.ID,
			issued_by : session_data.ID,
			barangay_doc_type_id : 1,
			date_issued : this.mainService.getCurrentDate(),
			description : this.mainService.documentBody [1].body,
			
		}
		
		this.tinyMceDOM = ["#clerk-doc-modal-description"];
		//console.log(modalData);
		for (let md in this.prkvars){
			let sel = this.modalData.args[md];
			if (sel){
				this.prkvars[md] = sel;
			}
		}
	
	}
	
	putInputs (){
		this.bindChildObject(this,true);
		this.initPutInputs ();
		tinymce.remove (this.tinyMceDOM[0]);
		setTimeout ( ( )=> {
			this.tinyMceInit();
			this.binds(this.controllerName,'#'+this.modalID);
			this.bindChildObject ( this , false );
		},500);
	}
	
	
	initPutInputs ( ){
		let mapObj = {};
		this.ISSUED_DATE = this.prkvars.date_issued;
		this.mainService.documentBody[this.prkvars.barangay_doc_type_id].body
		let replaceBody = this.mainService.documentBody[this.prkvars.barangay_doc_type_id].body;
		let rp = this.mainService.documentBody[this.prkvars.barangay_doc_type_id].regex;
		
		for ( let j in this.mainService.documentBody[this.prkvars.barangay_doc_type_id].replace ) { 
			let s = this.mainService.documentBody[this.prkvars.barangay_doc_type_id].replace[j];
			if ( typeof this[s] !==  "undefined" ) {
				mapObj [s] = this[s];
			}
		}
		
		replaceBody = replaceBody.replace(  rp , matched => mapObj[matched]);
		
		this.prkvars.description = replaceBody;
	}
	
	changeBrgyDocType ( ) {
		this.bindChildObject(this,true);
		this.initPutInputs ();
		tinymce.remove (this.tinyMceDOM[0]);
		setTimeout ( ( )=> {
			this.tinyMceInit();
			this.binds(this.controllerName,'#'+this.modalID);
			this.bindChildObject ( this , false );
		},100);
	}
	
	constructs(){
		// tinyMCE.get('my_editor').setContent(data).
		
		if ( !this.isUpdate )
			this.initPutInputs ();
		
		this.tinyMceInit();
		this.optionsBaranggayDocTypes();
	}
	
	tinyMceInit(){
		this.mainService.tinyMceOptions.selector = this.tinyMceDOM[0];
		this.mainService.tinyMceOptions ['init_instance_callback'] = ( ) => {
			let tm = document.querySelector(".tox.tox-tinymce.tox-tinymce--toolbar-sticky-off");
			console.log(tm);
			tm.style.height = null;
		}
		tinymce.init ( this.mainService.tinyMceOptions );
		setTimeout ( ( )=> {
			
		},1000);
	}
	
	viewMember( arg ){
	}
	
	init(){
	}
	
	
	async optionsBaranggayDocTypes ( ) {
		let docTypes = await this.getBaranggayDocTypes ( );
		let dombgydoctypes = document.getElementById ( "clerk-modal-doc-types" );
		
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
	
	searchIssueTo( ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/bps/sources/templates/modal/search.modal.template.html",
			params : {
				type : 'resident',
				action : 'link',
				controller : this.controllerName,
				evt : ':onSelectPrkLeader',
				//arg : args,
				instanceID : this.mainService.generate_id_timestamp("sm"),
			},
			parent : this,
		});
		ssm.render();
	}
	
	onSelectPrkLeader ( ...args ) {
		let res = args[0].detail.query;
		this.prkvars.issued_to = res.INC_ID;
		this.ISSUED_TO_NAME = res.FULLNAME;
		res.modal.onClose();
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.bindChildObject ( this , false );
	}
	
	removePrkLeader(){
		this.prkvars.PRK_LEADER = ``;
		this.PRK_LEADER_NAME = ``;
		this.IS_PRK_LEADER = 0;
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.bindChildObject ( this , false );
	}
	
	changebox(){
		this.bindChildObject(this,this.elem);
	}
	
	
	save(){
		this.bindChildObject(this,true);
		this.prkvars [ 'description' ] = tinymce.get("clerk-doc-modal-description").getContent();
		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(this.prkvars) , this.isUpdate ? "UPDATE" : "INSERT" ) );
		//console.log(saveparams)
		
		let sql1 = !this.isUpdate ? `INSERT INTO bis.barangay_document ${saveparams.initial} VALUES ${saveparams.seconds}` :
									`UPDATE bis.barangay_document ${saveparams.initial} where barangay_document_id = "${this.modalData.args.BDID}"`;
		
		
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						
						{
							sql : sql1,
							db : 'DB',
							query_request : "INSERT",
							values : saveparams.values
						},	
						
					]
				}
						
			}
			
		};
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			console.log(res);
			MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.onSearchEvent}` , {
				detail : {
					query : {
							
					}
				} 
			});
			this.onClose();
		} 
		, ( err ) => {
			//err
			console.log(err)
		});	
		
	}
	
}