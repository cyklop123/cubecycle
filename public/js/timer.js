$(()=>{

    $(window).on('keydown', downEvent).on('keyup', upEvent);
    $("#time").on('touchstart', downEvent).on('touchend', upEvent);

});

let counting = false;

let timer_update=0;
let interval = null;

let downEvent = (e)=>{
    if(!counting)
    {
        let key = (e.key) ? e.key : ' ';
        if(key==' ')
        {
            e.preventDefault();
            //starting timer
            if(interval==null)
            {
                interval=setInterval(()=>{
                    timer_update+=10;
                    if(timer_update>300)
                        $("#time").css({color:"green"});
                    else
                        $("#time").css({color:"red"});
                },10);
            }
        }
    }
    else{
        e.preventDefault();
        counting=false;
        stopTimer();
    }
},
upEvent = (e)=>{
    if(!counting)
    {
        let key = (e.key) ? e.key : ' ';
        if(key==' ')
        {
            e.preventDefault();
            //starting timer
            clearInterval(interval);
            interval=null;
            if(timer_update>300)
            {
                counting=true;
                startTimer();
            }
            $("#time").css({color:"black"});
            timer_update=0;
        }
    }
};

let timerInterval;
let time=0,min,sek,mil;

let updateTimer = ()=>{
    time++;
    mil=time%100;
    if(mil<10) mil='0'+mil;
    sek=parseInt(time/100)%60;
    if(sek<10 && min>0) sek='0'+sek;
    min=parseInt(time/6000)%60;
    let str=`${sek}.${mil}`;
    if(min>0)
        str=min+':'+str;
    $("#time").text(str)
}

let startTimer = ()=>
{
    timerInterval=setInterval(updateTimer,10);
}

let stopTimer = ()=>
{
    time=0;
    clearInterval(timerInterval);
}