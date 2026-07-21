import {useEffect,useState} from 'react'; import api from './api.js'
export default function App(){
  const [token,setToken]=useState(localStorage.getItem('token')); const [form,setForm]=useState({name:'',email:'',password:'',timezone:Intl.DateTimeFormat().resolvedOptions().timeZone});
  const [habits,setHabits]=useState([]); const [title,setTitle]=useState(''); const [board,setBoard]=useState([]); const [friend,setFriend]=useState('');
  const load=async()=>{const[{data:h},{data:b}]=await Promise.all([api.get('/habits'),api.get('/habits/leaderboard')]); setHabits(h); setBoard(b)}
  useEffect(()=>{if(token)load()},[token])
  if(!token) return <div className="wrap"><h1>Smart Habit Tracker</h1><div className="card row">
    <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
    <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
    <button onClick={async()=>{const {data}=await api.post('/auth/register',form); localStorage.setItem('token',data.token); setToken(data.token)}}>Register</button>
    <button onClick={async()=>{const {data}=await api.post('/auth/login',form); localStorage.setItem('token',data.token); setToken(data.token)}}>Login</button>
  </div></div>
  return <div className="wrap"><h1>Smart Habit Tracker</h1>
    <div className="card row"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New habit"/><button onClick={async()=>{await api.post('/habits',{title}); setTitle(''); load()}}>Add</button>
    <input value={friend} onChange={e=>setFriend(e.target.value)} placeholder="Friend email"/><button onClick={async()=>{await api.post('/habits/friends/add',{email:friend}); await api.post('/habits/challenges',{email:friend,habitTitle:'Consistency'})}}>Challenge</button>
    <button onClick={()=>{localStorage.removeItem('token'); setToken(null)}}>Logout</button></div>
    {habits.map(h=><div className="card" key={h._id}><div className="row" style={{justifyContent:'space-between'}}><strong>{h.title}</strong><span className="muted">Streak {h.streak} · remind {h.reminderHour}:00</span>
      <button onClick={async()=>{await api.post('/habits/'+h._id+'/checkin'); load()}}>Check in</button></div>
      <div className="heat">{(h.heatmap||[]).map(d=><div key={d.date} className={'cell'+(d.done?' on':'')} title={d.date}/>)}</div></div>)}
    <div className="card"><h3>Leaderboard</h3>{board.map((b,i)=><div key={i} className="muted">{i+1}. {b.name} — {b.consistency}</div>)}</div>
  </div>
}