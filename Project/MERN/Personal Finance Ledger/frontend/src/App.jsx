import {useEffect,useState} from 'react'; import api from './api.js'
const QKEY='finance-offline-queue';
export default function App(){
  const [token,setToken]=useState(localStorage.getItem('token')); const [form,setForm]=useState({email:'',password:'',name:''});
  const [accounts,setAccounts]=useState([]); const [txns,setTxns]=useState([]); const [summary,setSummary]=useState(null);
  const [accName,setAccName]=useState(''); const [memo,setMemo]=useState(''); const [from,setFrom]=useState(''); const [to,setTo]=useState(''); const [amount,setAmount]=useState(10);
  const load=async()=>{ const [a,t,s]=await Promise.all([api.get('/ledger/accounts'),api.get('/ledger/txns'),api.get('/ledger/summary')]); setAccounts(a.data); setTxns(t.data); setSummary(s.data); };
  useEffect(()=>{if(token)load().catch(()=>{})},[token]);
  const flushQueue=async()=>{ const q=JSON.parse(localStorage.getItem(QKEY)||'[]'); for(const item of q){ try{ await api.post('/ledger/txns', item);}catch{return} } localStorage.setItem(QKEY,'[]'); };
  const postTxn=async()=>{
    const payload={memo, category:'transfer', lines:[{account:from,debit:Number(amount),credit:0},{account:to,debit:0,credit:Number(amount)}]};
    try{ await api.post('/ledger/txns',payload); await load(); }
    catch{ const q=JSON.parse(localStorage.getItem(QKEY)||'[]'); q.push(payload); localStorage.setItem(QKEY,JSON.stringify(q)); alert('Saved offline — will sync later'); }
  };
  if(!token) return <div className="wrap"><h1>Personal Finance Ledger</h1><div className="card row">
    <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
    <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
    <button onClick={async()=>{const {data}=await api.post('/auth/register',form); localStorage.setItem('token',data.token); setToken(data.token)}}>Register</button>
    <button onClick={async()=>{const {data}=await api.post('/auth/login',form); localStorage.setItem('token',data.token); setToken(data.token)}}>Login</button></div></div>
  return <div className="wrap"><h1>Double-Entry Ledger</h1>
    <div className="card row"><input value={accName} onChange={e=>setAccName(e.target.value)} placeholder="Account name"/><button onClick={async()=>{await api.post('/ledger/accounts',{name:accName}); load()}}>Add account</button>
    <button onClick={flushQueue}>Sync offline queue</button>
    <a className="muted" href="/api/ledger/export.csv" onClick={async e=>{e.preventDefault(); const {data}=await api.get('/ledger/export.csv'); const blob=new Blob([data],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ledger.csv'; a.click()}}>Export CSV</a></div>
    <div className="card"><h3>Post balanced transfer</h3><div className="row">
      <input value={memo} onChange={e=>setMemo(e.target.value)} placeholder="Memo"/>
      <select value={from} onChange={e=>setFrom(e.target.value)}><option value="">From</option>{accounts.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}</select>
      <select value={to} onChange={e=>setTo(e.target.value)}><option value="">To</option>{accounts.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}</select>
      <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}/><button onClick={postTxn}>Post</button></div></div>
    <div className="card"><h3>Accounts</h3>{accounts.map(a=><div key={a._id} className="muted">{a.name}: {a.balance}</div>)}
      {(summary?.byCategory||[]).map(c=><div key={c._id}><div className="muted">{c._id||'uncategorized'} {c.total}</div><div className="bar" style={{width:Math.min(100,c.total)+'%'}}/></div>)}</div>
    <div className="card"><h3>Recent</h3>{txns.map(t=><div key={t._id} className="muted">{t.memo} · v{t.version}</div>)}</div>
  </div>
}