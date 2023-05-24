import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";

export class LuponSummonModalController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.init();
	}
	
	init (modalData) {
		this.modalData = modalData ? modalData : this.modalData;
		this.isUpdate = this.modalData.params.isUpdate;
		this.month = this.modalData.params.month;
		this.day = this.modalData.params.day;
		this.year = !this.modalData.params.year ? this.mainService.getCurrentYear() : this.modalData.params.year;
		let mcaseno = this.month < 10 ? `0${this.month}` : this.month;
		this.summonData = {
			BARANGAY_CASE_NUMBER : `${this.year.slice(-2)}-${mcaseno}-0001`,
			CASE_TYPE : '',
			ISSUED_BY : session_data.ID,
			ISSUED_DATE : this.mainService.getCurrentDate(),
			DESCRIPTION : '',
			HAS_SETTLEMENT_AGREED : 0,
			HAS_ATTENDED_HEARING : 0,
			DATE_ENCODED : '',
			TIME_ENCODED : '',
			CAPTAIN : session_data.BARANGAY_CAPTAIN,
			SUMMON_ID : MainService.MAKE_ID(15),
		}
		this.eventsData = {
			EVENT_DESCRIPTION : 'Complaint',
			DATE_START : !this.isUpdate ? this.modalData.params.thisDate : this.modalData.params.DATE_START,
			DATE_END : !this.isUpdate ? this.modalData.params.thisDate : '',
			TIME_START : '08:00:00',
			TIME_END : '09:00:00',
			COLOR : '#ccc',
			REF_TABLE : 'barangay_summons',
			REF_ID : `${this.year.slice(-2)}-${mcaseno}-0001`,
			PLACE : 'BRGY MANSILINGAN',
			ID : !this.isUpdate ? '' : this.modalData.params.ID,
		};
		if (!this.isUpdate) delete this.eventsData['ID'];
		
		for ( let j in this.modalData.params ) {
			let sel = this.modalData.params[j];
			if (this.eventsData[j]){ 
				this.eventsData[j] = sel;
			} 
			if (this.summonData[j]){ 
				this.summonData[j] = sel;
			} 	
		}
		
		console.log( this.summonData)
		this.BRGY_CAPTAIN_NAME = '';
		this.DURATION = this.mainService.diffTime (this.eventsData.TIME_START, this.eventsData.TIME_END);
		this.CASE_TYPE_NAME = '';
		this.complainants = [];
		this.against = [];
		this.initAsyncVars ();
	}
	
	async initAsyncVars () {
		let bcaptain = await this.mainService.getBrgyEmployee(this.summonData.CAPTAIN);
		let bemployee = await this.mainService.getBrgyEmployee(this.summonData.ISSUED_BY);
		let datas = await this.getDataOnUpdate();
		
		for (let i in datas) {
			let sel1 = datas[i];
			for (let j in sel1) {
				let sel2 = sel1[j];
				this[i].push ({
					"fname" : sel2.fname,
					"gender" : sel2.GENDER == 1 ? 'M' : 'F',
					"todb" : {
						"AGE" : sel2.AGE,
						"GENDER" : sel2.GENDER,
						"RESIDENT_ID" : sel2.RESIDENT_ID,
						"SUMMON_ID" : sel2.SUMMON_ID,
						"IS_COMPLAINANT" : sel2.IS_COMPLAINANT,
					}
				});
			}
		}
		this.BRGY_CAPTAIN_NAME = bcaptain.FNAME;
		this.ISSUED_BY_NAME = bemployee.FNAME;
		//this.bindMe();
		this.enumerateInvolves ( 'against' );
		this.enumerateInvolves ( 'complainants' );
	}
	
	getDataOnUpdate( ) {
		return new Promise ( (resolve, reject) => {
			let data = {
				type: "POST",
				url : this.mainService.urls["generic"].url,
				data : {
					data : {
						request : 'generic',
						REQUEST_QUERY : [
							{
								sql : `SELECT si.*,CONCAT(res.FIRSTNAME,' ',res.LASTNAME) as fname 
										FROM bis.barangay_summon_involves si 
										INNER JOIN bis.barangay_res_setup res 
										ON res.RESIDENT_ID = si.RESIDENT_ID 
										WHERE si.IS_COMPLAINANT = ? and si.SUMMON_ID = ?`,
								db : 'DB',
								index : 'complainants',
								query_request : 'GET',
								values : [1, this.summonData.SUMMON_ID]
							},	
							{
								sql : `SELECT si.*,CONCAT(res.FIRSTNAME,' ',res.LASTNAME) as fname 
										FROM bis.barangay_summon_involves si 
										INNER JOIN bis.barangay_res_setup res 
										ON res.RESIDENT_ID = si.RESIDENT_ID 
										WHERE si.IS_COMPLAINANT = ? and si.SUMMON_ID = ?`,
								db : 'DB',
								query_request : 'GET',
								index : 'against',
								values : [0, this.summonData.SUMMON_ID]
							},
						]
					}			
				}	
			};
		
			this.mainService.serverRequest( data , ( res ) => {
				resolve (JSON.parse(res));
			} 
			, ( err ) => {
				console.log(err);
			});	
		});
	}
	
	changeBrgyCaseNum () {
		this.bindChildObject ( this , true );
		this.eventsData.REF_ID = this.summonData.BARANGAY_CASE_NUMBER;
		this.bindMe();
	}
	
	durationChange ( ) {
		this.bindChildObject ( this , true );
		this.DURATION = this.mainService.diffTime (this.eventsData.TIME_START, this.eventsData.TIME_END);
		this.bindMe();
	}
	
	addInvolve ( args ) {
		this[args.involvementType].push({
			"fname" : '',
			"gender" : 'M',
			"todb" : {
				"AGE" : 0,
				"gender" : 1,
			}
		});
		this.enumerateInvolves(args.involvementType);
	}
	
	removeInvolve ( args ) {
		let involvementType = args.involvementType;
		let index = args.i;
		this[args.involvementType].splice(index,1);
		this.enumerateInvolves(involvementType);
	}
	
	enumerateInvolves ( involvementType ) {
		let i;
		let listhtml = '';
		let selInvolvementList = this[involvementType];
		let invDOM = document.querySelector (`#${involvementType}-list-container`);
			invDOM.innerHTML = '';
		for ( i in selInvolvementList ) {
			let involve = selInvolvementList[i];
			listhtml += 
				`<div style="width:100%;padding-bottom:0.5rem;">
					<div style="float:left;padding-left:.33%;width:60%">
						<input data-valuectrl='${involvementType}.${i}.fname' data-event='LuponSummonModalController.click.searchInvolved' data-params='{"involvementType":"${involvementType}","i":"${i}"}' type='text' class='form-control' />
					</div>
					<div style="float:left;padding-left:1.33%;width:12%">
						<input data-valuectrl='${involvementType}.${i}.gender' disabled type='text' class='form-control' />
					</div>
					<div style="float:left;padding-left:1.33%;width:12%">
						<input data-valuectrl='${involvementType}.${i}.todb.AGE' disabled type='text' class='form-control' />
					</div>
					<div style="float:left;width:16%">
						<div style='float:right;'>
							<button class='btn btn-danger' data-event='LuponSummonModalController.click.removeInvolve' data-params='{"involvementType":"${involvementType}","i":"${i}"}'>
								<i class='icon-remove'></i>
							</button> 
							<button class='btn btn-primary'>
								<i class='icon-search' style="font-size:0.9rem"></i>
							</button> 
						</div>
					</div>
					<div style="clear:both"></div>
				</div>`;
		}
		invDOM.insertAdjacentHTML('beforeend', listhtml);
		this.bindMe();
		
	}
	
	constructs () {
	}
	
	searchInvolved ( args ) {
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/bps/sources/templates/modal/search.modal.template.html",
			params : {
				type : 'resident',
				action : 'link',
				controller : this.controllerName,
				evt : ':onAddInvolved',
				arg : args,
				instanceID : this.mainService.generate_id_timestamp("sm"),
			},
			parent : this,
		});
		ssm.render();
	}
	
	onAddInvolved ( args ) {
		let dataparams = args.detail.query;
		let modal = dataparams.modal;
		let mparam = modal.modalData.params.arg;
		this[mparam.involvementType][mparam.i] = {
			"fname" : dataparams.FULLNAME,
			"gender" : dataparams.GENDER,
			"todb" : {
				"AGE" : dataparams.AGE,
				"GENDER" : dataparams.AGENDER,
				"RESIDENT_ID" : dataparams.RESIDENT_ID,
				"SUMMON_ID" : this.summonData.SUMMON_ID,
				"IS_COMPLAINANT" : mparam.involvementType == 'complainants' ? 1 : 0,
			}
		};
		modal.onClose();
		this.bindMe();
	}
	
	save () {
		this.bindChildObject(this,true);
		alert(this.summonData.SUMMON_ID)
		let saveparamsEvents = ( ServerRequest.queryBuilder( this.mainService.object2array(this.eventsData) , this.isUpdate ? "UPDATE" : "INSERT" ) );
		let saveparamsSummon = ( ServerRequest.queryBuilder( this.mainService.object2array(this.summonData) , this.isUpdate ? "UPDATE" : "INSERT" ) );
		let sqlEvents =  !this.isUpdate ? `INSERT INTO bis.barangay_events ${saveparamsEvents.initial} VALUES ${saveparamsEvents.seconds}` : `UPDATE bis.barangay_events ${saveparamsEvents.initial} where ID = ${this.eventsData.ID}`;
		let sqlSummon =  !this.isUpdate ? `INSERT INTO bis.barangay_summons ${saveparamsSummon.initial} VALUES ${saveparamsSummon.seconds}` : `UPDATE bis.barangay_summons ${saveparamsSummon.initial} where SUMMON_ID = '${this.summonData.SUMMON_ID}'`;
		let data = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : sqlEvents,
							db : 'DB',
							query_request : this.isUpdate ? "UPDATE" : "INSERT",
							values : saveparamsEvents.values
						},	
						{
							sql : sqlSummon,
							db : 'DB',
							query_request : this.isUpdate ? "UPDATE" : "INSERT",
							values : saveparamsSummon.values
						},
						{
							sql : `DELETE FROM bis.barangay_summon_involves WHERE SUMMON_ID = ?`,
							query_request : 'DELETE',
							db : 'DB',
							values : [this.summonData.SUMMON_ID]
						}
					]
				}			
			}	
		};
		let arrInv = ['against', 'complainants'];
		for ( let i in  arrInv ){
			let inv = arrInv[i];
			let arrInvolves = this[inv];
			for ( let j in arrInvolves ) {
				let sel = arrInvolves[j];
				let saveInvParams = ( ServerRequest.queryBuilder( this.mainService.object2array(sel.todb) ,  "INSERT" ) );
				data.data.data.REQUEST_QUERY.push ({
					sql : `INSERT INTO bis.barangay_summon_involves ${saveInvParams.initial} VALUES ${saveInvParams.seconds}`,
					db : 'DB',
					query_request :  "INSERT",
					values : saveInvParams.values
				});
			}
		} 
		console.log(data);
		this.mainService.serverRequest( data , ( res ) => {
			MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.onUpdate}`, {
				detail : {
					query : {
					}
				} 
			});
			alert("success!");
			//this.init(this.modalData);
			this.onClose();
		} 
		, ( res ) => {
			console.log(err);
		});	
	}
	
	
}