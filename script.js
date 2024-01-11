

document.addEventListener('DOMContentLoaded', () =>{

    //dom loaded -> +1 of side loads (locally)
    localStorageCounter();

//button to count clicks 
    document.getElementById("addButton").addEventListener("click", add);
    
//button to update time & progress
    update();
    document.getElementById("update").addEventListener("click", update);

}); //domloaded end


//////////////////////////////////////////////////////////////////////7///
//FUNCTION SECTION
//////////////////////////////////////////////////////////////////////////

function update(){
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
        let currentDate = new Date();
        let firstDate = new Date(start);
        let lastDate = new Date(end);
        let maxDateDiff = (lastDate - firstDate) /1000/60/60/24;
        let currentDateDiff = (lastDate - currentDate) /1000/60/60/24;
        let adapterNumber = 100 /maxDateDiff; 
        let progressDays = (maxDateDiff - currentDateDiff)*adapterNumber;
        let totalDaysDone = Math.round(maxDateDiff - currentDateDiff); 
        let oneDayMilliseconds = (24*60*60*1000);

        let dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        //total schoolhours per day in minutes
        let schoolDayMinutes = [0, (10*50), (9*50), (8*50), (10*50), (5*50), 0];    
        let totalSchoolHours = 0;
        let totalSchoolHoursUntilCurrent = 0;
        let currentDateFormat = "last update: " + dayOfWeek[currentDate.getDay()] + " "+ currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear() + " - " + currentDate.getHours() + ":" +  currentDate.getMinutes()  + ":" + currentDate.getSeconds();
    //functions bc readability - all of them are defined of the update function
        updateTotalDays();

        

    function updateTotalDays(){
            document.getElementById("progressTotalDays").style.width = progressDays+"%";
            document.getElementById("progressTotalDays").innerText = totalDaysDone + " days";
            document.getElementById("totalDays").innerText = "of " + maxDateDiff + " days";
            document.getElementById("lastUpdate").innerHTML = currentDateFormat;
            document.getElementById("feedback").innerHTML = "You have survived about " + totalDaysDone + " days!";
    }
    
    // getAllDaysOfTheTimespanWithoutWeekend(){
          //days without weekend update
    let holidays = [new Date("2024-01-01"), new Date("2023-12-08")];
    for(winter = new Date("2023-12-24"); winter <= new Date("2024-01-06"); winter = new Date(winter.getTime()+oneDayMilliseconds)){
        holidays.push(winter);
        //console.log(winter);
    }

    let totalSchooldays = 0;
    for(let date = firstDate; date <= lastDate; date = new Date(date.getTime() + oneDayMilliseconds)){ 
        
        if(holidays.some(holiday => holiday.toDateString() == date.toDateString())) { //Array.prototype.includes()
            //This code uses the some() method to check if any element in the holidays array matches the currentDate by comparing their string representations (using toDateString()). If a match is found, it logs a message indicating that the date exists in the holidays array.
            //console.log("Holiday:" + date);
            continue;
        }
        else if(date.getDay() != 0 && date.getDay() != 6 ){
            totalSchooldays+= 1;
            totalSchoolHours+= Math.round((schoolDayMinutes[(date.getDay())])/60*100)/100;
        }
    }
    
  

    

// getAllSchoolDaysWithoutHolidays(){
    
        let adapt = 100 / totalSchooldays;
        let currentSchoolDays = 0;
        for(let date = firstDate; date <= currentDate; date = new Date(date.getTime() + oneDayMilliseconds)){ 
            
            if(holidays.some(holiday => holiday.toDateString() == date.toDateString())) { //Array.prototype.includes()
                //This code uses the some() method to check if any element in the holidays array matches the currentDate by comparing their string representations (using toDateString()). If a match is found, it logs a message indicating that the date exists in the holidays array.
                //console.log("Holiday current:" + date);
                continue;
            }
            else if(date.getDay() != 0 && date.getDay() != 6 ){
                currentSchoolDays+= 1;
                if(date != currentDate){
                    totalSchoolHoursUntilCurrent+= Math.round((schoolDayMinutes[(date.getDay())])/60*100)/100;
                }
                else if(date == currentDate){
                    //todaysHours(currentDate);
                }
               
            }
        }

        let currentSchoolDaysPercent = currentSchoolDays * (100/totalSchooldays);

    
    
        document.getElementById("progressSchoolDays").style.width = currentSchoolDaysPercent+"%";
        document.getElementById("progressSchoolDays").innerText = currentSchoolDays + " days";
        document.getElementById("totalSchoolDays").innerText = "of " + totalSchooldays + " days";
    
        

        document.getElementById("hoursTotal").style.width = (totalSchoolHoursUntilCurrent *(100/ totalSchoolHours))+"%";
        document.getElementById("hoursTotal").innerText = totalSchoolHoursUntilCurrent + " hours";
        document.getElementById("totalHours").innerText = "of " + totalSchoolHours + " school hours";

    today(currentDate);
    let exampleTest = new Date(currentDate.getTime()-(12*60*60*1000));
    //console.log(exampleTest.getTime());
    //today(exampleTest);


    
 

function today(today){
    let currentHoursInSec = today.getHours()*60*60;
    let currentMinutesInSec = today.getMinutes()*60;
    let currentTimeInSec = currentHoursInSec + currentMinutesInSec + today.getSeconds();
    let currentWeekDay = today.getDay();

    console.log("h "+currentHoursInSec/60/60);
    console.log("min" +currentMinutesInSec/60);
    console.log("time now in seconds" + currentTimeInSec);

    let breakStartsInSec =   [(10*60+10)*60, (15*60+25)*60,];
    
    //let breakMinutesInSec =   [15*60, 10*60];


    //check if not weekend and add breaks from plan
    if(currentWeekDay !=0 && currentWeekDay !=6 ){
        console.log(currentWeekDay)
        //if(breakStartsInSec.length != 1){ //not nessecary since it gets resetet every time
            addBreaksFromUnitplan(currentWeekDay);
            //comment check content
            for(pos of breakStartsInSec){
                console.log("Break:"+pos);
            }
       // }       
    }
    else{
        console.log("No unitplan available for weekends");
    }

    //not lets find out when the next break starts
    let nextBreakSec = 0; //time of break
       
    for(let pos of breakStartsInSec){
        if(pos < currentTimeInSec){
            console.log("Break in the past: " +pos);
            continue;
        }
        else if(pos > currentTimeInSec){
            console.log(pos);
             if(nextBreakSec == 0 || nextBreakSec > pos){
                nextBreakSec = pos;
             }            
        }
    }
    console.log("Next break is at: " + nextBreakSec);
       if(nextBreakSec == 0){
           document.getElementById("break").innerHTML = "There are no more breaks today!";
       }
       else{
        let timeDiffSec = nextBreakSec -currentTimeInSec;
            let hCountDownToBreak = Math.floor(timeDiffSec/60/60);
            let minCountdownToBreak = Math.floor((timeDiffSec/60)-hCountDownToBreak*60);
            let secCountdownToBreak = Math.round((timeDiffSec/60 - minCountdownToBreak)*60 -hCountDownToBreak*60*60);
            document.getElementById("break").innerHTML = "Your next break starts in: " +hCountDownToBreak + "h " + minCountdownToBreak+"min " + secCountdownToBreak + "sec";
            //countDown(nextBreakSec);
       }
       
    //Function to iterate over timeplan and add breaks
    function addBreaksFromUnitplan(weekday){
        
        let unitStartsSec =   [
            (7*60+40)*60,
            (8*60+30)*60,
            (9*60+20)*60,
            (10*60+25)*60,
            (11*60+15)*60,
            (12*60+5)*60,
            (12*60+55)*60,
            (13*60+45)*60,
            (14*60+35)*60,
            (15*60+35)*60,
            (16*60+25)*60
            ]
        let unitPlan = [
            [true, true, true, true, true, false, true, true, true, true, true, false], //mon
            [true, true, true, true, true, true, false, true, true, true, false, false], //tue
            [true, true, true, true, true, false, true, true, true, false, false, false], //wed
            [true, true, true, true, true, false, true, true, true, true, true, false], //thu
            [true, true, true, true, true, false, false, false, false, false, false, false] //fri
        ]
        console.log(unitPlan);
        let indexOfBool = 0;
        console.log(weekday-1)
        for(bool of unitPlan[weekday-1]){
             if(bool == false){
                 breakStartsInSec.push(unitStartsSec[indexOfBool]);
                 //console.log("Unit at" + unitStartsSec[indexOfBool] + " got pushed");
             }
             indexOfBool++;
            }  
    }
    
    //doesnt work yet
    // function countDown(nextBreakSec, currentTimeInSec){
    //     let timeDiffSec = nextBreakSec -currentTimeInSec;
    //     let hCountDownToBreak = Math.floor(timeDiffSec/60/60);
    //     let minCountdownToBreak = Math.floor((timeDiffSec/60)-hCountDownToBreak*60);
    //     let secCountdownToBreak = Math.round((timeDiffSec/60 - minCountdownToBreak)*60 -hCountDownToBreak*60*60);
    //     //document.getElementById("break").innerHTML = "Your next break starts in: " +hCountDownToBreak + "h " + minCountdownToBreak+"min " + secCountdownToBreak + "sec";
    //    let dateWithoutTime = new Date( currentDate.getTime()-currentDate.getHours()-currentDate.getMinutes()-currentDate.getSeconds() );
    //    let BreakDateTime = dateWithoutTime + hCountDownToBreak + minCountdownToBreak + secCountdownToBreak;
    //    while (BreakDateTime.getHours() != currentDate.getHours() && BreakDateTime.getMinutes() != currentDate.getMinutes() && BreakDateTime.getSeconds() != currentDate.getSeconds() ){
    //     startTime();
    //    }
      

    //    function startTime() {
    //     const today = currentDate;
    //     let h = today.getHours();
    //     let m = today.getMinutes();
    //     let s = today.getSeconds();
    //     m = checkTime(m);
    //     s = checkTime(s);
    //     document.getElementById('break').innerHTML =  h + ":" + m + ":" + s;
    //     setTimeout(startTime, 1000);
    //   }
      
    //   function checkTime(i) {
    //     if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    //     return i;
    //   }

    }

    setTimeout(update, 1000);
}//update end

//Updates the number of refreshes
function localStorageCounter(){
    if(localStorage.getItem('refreshCount')) {
      let count = parseInt(localStorage.getItem('refreshCount')) + 1;
      localStorage.setItem('refreshCount', count);
      document.getElementById('refreshes').innerHTML = count;
    } else {
      localStorage.setItem('refreshCount', '1');
    }
}
    

//Button that counts upwards
function add(){
    let number = parseInt(document.getElementById("addButton").innerHTML);
    document.getElementById("addButton").innerHTML = number + 1;

    let feedbackText = "";
    if(number >= 10 && number <20){
        feedbackText = "Okay, you clicked it a bit";
    }
    else if(number >= 20 && number <30){
        feedbackText = "This isnt going to change anything.";
    }
    else if(number >= 30 && number <40){
        feedbackText = "Its a waste of time?";
    }
    else if(number >= 40 && number <50){
        feedbackText = "Ehm...";
    }
    else if(number >= 50 && number <60){
        feedbackText = "Calm down?";
    }
    else if(number >= 60 && number <70){
        feedbackText = "...you listen?";
    }
    else if(number >= 70 && number <80){
        feedbackText = "slow~";
    }
    else if(number >= 80 && number <100){
        feedbackText = " stop!";
    }
    else if(number >= 100){
        feedbackText = ". . .";
    }
    
    if(number == 109){
        feedbackText = "Enough.";
        let button = document.querySelector("#addButton");
        button.disabled = true;
    }
    document.getElementById("addfeedback").innerHTML = feedbackText;
}




