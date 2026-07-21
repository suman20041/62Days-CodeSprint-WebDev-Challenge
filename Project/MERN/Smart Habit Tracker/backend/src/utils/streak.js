export function localDateString(tz='UTC', date=new Date()){
  return new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function computeStreak(checkinDates=[], tz='UTC'){
  const set=new Set(checkinDates);
  let streak=0;
  let cursor=new Date();
  for(;;){
    const key=localDateString(tz,cursor);
    if(!set.has(key)) break;
    streak++;
    cursor=new Date(cursor.getTime()-86400000);
  }
  return streak;
}
export function weeklyHeat(checkinDates=[], weeks=4){
  const set=new Set(checkinDates);
  const days=[];
  for(let i=weeks*7-1;i>=0;i--){
    const d=new Date(Date.now()-i*86400000);
    const key=d.toISOString().slice(0,10);
    days.push({date:key, done:set.has(key)});
  }
  return days;
}