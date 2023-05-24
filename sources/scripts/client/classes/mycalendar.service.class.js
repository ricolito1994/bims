import { Controller } from "../classes/controller.class.js";
export class CalendarService extends Controller {
	
	constructor ( params ){
		super ( 'calendar' , params.parent.mainService );
		this.params = params;
		this.parent = params.parent;
		this.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		this.service = this.parent.mainService;
		this.calendarTemplate = params.calendarTemplate;
		this.parentDiv = params.parentDiv;
		this.currentDate = this.service.getCurrentDate();
		this.splitDate = (this.currentDate).split('-');	
		this.currentDay = parseInt(this.splitDate[2]);
		this.currentMonth = parseInt(this.splitDate[1]);
		this.currentYear = parseInt(this.splitDate[0]);
		this.selectedDay = this.currentDay;
		this.selectedMonth = this.currentMonth - 1;
		this.selectedYear = this.currentYear;
		this.selectMonth = this.months[this.selectedMonth];
		this.buildCalendar();
	}
	
	buildCalendar ( ){
		this.service.loadTemplate( this.calendarTemplate ,this.parentDiv,( ) => {
			for ( let i in this.months ){
				let sel = this.months[i];
				let msl = document.querySelector('div.calendar select#calendar-months');
				let opt = document.createElement('option');
				opt.innerText = sel;
				msl.append(opt);
			}
			this.populatesy ( document.querySelector ( 'div.calendar' ).children , 'calendar' );
			this.spawnCalendar (this.selectedMonth , this.selectedYear);
			this.bindCalendar();
		}
		,false,true);
	}
	
	static isLeapYear ( year ){
		return year % 4 == 0;
	}
	
	async spawnCalendar ( month , year ){
		if (! month) month = this.selectedMonth;
		if (! year)  year = this.selectedYear;
		
		let tbodyCalendar = document.querySelector('div.calendar table tbody');
			tbodyCalendar.innerHTML="";
		let noOfDays = this.daysInMonth( month, year );
		let firstDay  = ( ( new Date(year, month) ).getDay() );
		let days = 1;
		
		this.selectedMonth = month;
		this.selectedYear = year;
		
		let m = ( month + 1 ) > 10 ? '0'+( month + 1 ) : ( month + 1 ) ;
		
		let calendarData = await this.parent.getData (`${year}-${m}-01`, `${year}-${m}-31`);
		
		for ( let i = 0 ; i < 6 ; i++ ){
			
			let row = document.createElement("tr");
			
			for ( let j = 0 ; j < 7 ;j++ ){
				let mm = '0'+(month+1);
				let dd = '0'+(days);
				
				if ( month >= 9 ){
					mm = month + 1;
				}
				if ( days >= 10 ){
					dd = days;
				}
				
				
				let thisDate = `${year}-${mm}-${dd}`;
				let cell = document.createElement('td'); 
					cell.style.verticalAlign  = "top";
				let matchTime = [];
				for ( let i in calendarData ){
					let sel = calendarData[i];
					if (sel[this.params.fields.date] == thisDate)
						matchTime.push( sel );	
				}
					
				if ( i === 0 && j < firstDay ){
					row.append(cell);
				}
				else if ( days > noOfDays ){
					break;
				}
				else{
					cell.dataset.event = "calendar.click.clickThisDate";
					cell.dataset.params = `{"thisDate":"${thisDate}","year":"${year}","day":"${days}","month":"${month+1}","dayToday":"${j}"}`;
					
					if (matchTime[0]){
						let div1 = document.createElement('div');
						div1.setAttribute('style','float:left;width:20%;');
						div1.innerHTML = days;
						cell.append(div1);
							
						let div2 = document.createElement('div');
						div2.setAttribute('style','float:right;width:80%;');
							
						for(let j in matchTime){
							let ssel = matchTime[j];
							let divs = document.createElement('div');
							divs.setAttribute('style',`background:${ssel.COLOR};padding:3%;border:1px solid red;`);
							divs.innerHTML = ssel[this.params.fields.caldesc];
							div2.append(divs);
						}
						
						let div3 = document.createElement('div');
							div3.setAttribute('style','clear:both;');
							cell.append(div2);
							cell.append(div3);
					}
					else{
						cell.innerHTML = days;
					}
					
					if (this.currentDay==days && this.currentYear == year && (this.currentMonth-1) == month){
						cell.className = "today";
					}
					row.append(cell);
					days++;
				}
			}
			tbodyCalendar.append(row);
		}
		
	}
	
	changeCalendar ( ){
		setTimeout ( ( ) => {
			this.bindChildObject(this,this.elem);
			let indexMonth = this.months.findIndex ( x => x === this.selectMonth );
			this.spawnCalendar( indexMonth , this.selectedYear );
		},500);
	}
	
	clickThisDate ( params ) {
		this.parent.clickDates ( params );
	}
	
	daysInMonth ( month , year ){
		 return 32 - new Date(year, month, 32).getDate();
	}
	
	nextMonth ( ){
		this.selectedMonth++;
		
		if ( this.selectedMonth > 11 ){
			this.selectedMonth=0;
			this.selectedYear++;
		}
		this.selectMonth = this.months[this.selectedMonth];

		this.spawnCalendar( this.selectedMonth , this.selectedYear );
		this.bindCalendar();
	}
	
	bindCalendar() {
		setTimeout(() => { 
			this.binds("calendar",this.parentDiv);
			this.bindChildObject ( this , false );
		}, 100);
	}
	
	prevMonth ( ){
		this.selectedMonth--;
		
		if ( this.selectedMonth < 0 ){
			this.selectedMonth=11;
			this.selectedYear--;
		}
		
		this.selectMonth = this.months[this.selectedMonth];

		this.spawnCalendar( this.selectedMonth , this.selectedYear );
		this.bindCalendar();
	}
	
	reset ( ){
		this.selectedDay = this.currentDay;
		this.selectedMonth = this.currentMonth - 1;
		this.selectedYear = this.currentYear;
		this.selectMonth = this.months[this.selectedMonth];
		this.spawnCalendar( this.selectedMonth , this.selectedYear );
		this.bindCalendar();
	}
	//https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d	
}