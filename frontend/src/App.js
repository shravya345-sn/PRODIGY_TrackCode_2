import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";

function App() {
  const [role, setRole] = useState(null);
  const [loggedUser, setLoggedUser] = useState("");
  const [view, setView] = useState("dashboard"); 
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [user, setUser] = useState({ username: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', position: '', salary: '', password: '' });
  const [leaveForm, setLeaveForm] = useState({ type: 'Sick', reason: '' });

  const fetchData = () => {
    if (!role) return;
    axios.get(`${API}/leaves/${loggedUser}/${role}`).then(res => setLeaves(res.data || []));
    axios.get(`${API}/analytics/${loggedUser}/${role}`).then(res => setAnalytics(res.data || []));
    if (role === 'admin') axios.get(`${API}/employees`).then(res => setEmployees(res.data || []));
  };

  useEffect(() => { if(role) fetchData(); }, [role, view]);

  const handleLogin = () => {
    axios.post(`${API}/login`, user).then(res => {
      setRole(res.data.role); 
      setLoggedUser(res.data.username);
    }).catch(() => alert("Login Failed - Try admin/admin"));
  };

  const handleEditSave = (emp) => {
    axios.post(`${API}/edit-employee`, emp).then(() => {
      setEditingId(null);
      fetchData();
      alert("Employee Updated Successfully!");
    });
  };

  if (!role) return (
    <div style={styles.loginContainer}>
        <div style={styles.loginLeft}>
            <div style={styles.loginContent}>
                <div style={styles.logoCircle}>EMS</div>
                <h2 style={{color: '#0f172a', marginBottom: '10px'}}>Enterprise Login</h2>
                <p style={{color: '#64748b', marginBottom: '25px'}}>Precision in Management Core</p>
                <input style={styles.input} placeholder="Username" onChange={e => setUser({...user, username: e.target.value})} />
                <input style={styles.input} type="password" placeholder="Password" onChange={e => setUser({...user, password: e.target.value})} />
                <button style={styles.primaryBtn} onClick={handleLogin}>Sign In</button>
            </div>
        </div>
        <div style={styles.loginRight}>
            <div style={styles.overlay}>
                <h1 style={{color: 'white', fontSize: '32px'}}>Manage Your Growth.</h1>
                <p style={{color: 'white', opacity: 0.9}}>Professional employee lifecycle management.</p>
            </div>
        </div>
    </div>
  );

  return (
    <div style={styles.appBody}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarBrand}>EMS CORE</h2>
        <div style={view === "dashboard" ? styles.menuActive : styles.menuItem} onClick={() => setView("dashboard")}>🏠 Dashboard</div>
        <div style={view === "leaves" ? styles.menuActive : styles.menuItem} onClick={() => setView("leaves")}>📅 Leaves</div>
        <div style={view === "analytics" ? styles.menuActive : styles.menuItem} onClick={() => setView("analytics")}>📊 Analytics</div>
        {role === 'admin' && <div style={view === "employees" ? styles.menuActive : styles.menuItem} onClick={() => setView("employees")}>👥 Manage Team</div>}
        <div style={{...styles.menuItem, marginTop: 'auto'}} onClick={() => setRole(null)}>🚪 Logout</div>
      </div>

      <div style={styles.main}>
        <header style={styles.nav}><h3>{view.toUpperCase()}</h3><div>Logged as: <b>{loggedUser}</b></div></header>

        {view === "dashboard" && (
            <div style={styles.card}>
                <div style={{textAlign: 'center', padding: '10px'}}>
                    <h1>Welcome, {loggedUser}!</h1>
                    <p style={{fontStyle: 'italic', fontSize: '18px', color: '#64748b'}}>"Success is the result of preparation, hard work, and learning from failure."</p>
                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80" width="100%" style={{borderRadius:'20px', marginTop:'20px', maxWidth:'600px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}} />
                    {role === 'staff' && (
                        <div style={{marginTop: '30px'}}>
                            <button style={styles.inBtn} onClick={() => axios.post(`${API}/check-in`, {username: loggedUser}).then(()=>alert("Clocked In!"))}>CHECK IN</button>
                            <button style={styles.outBtn} onClick={() => axios.post(`${API}/check-out`, {username: loggedUser}).then(()=>alert("Clocked Out!"))}>CHECK OUT</button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {view === "leaves" && (
            <div style={styles.card}>
                {role === 'staff' && (
                    <div style={styles.formBox}>
                        <h4>Apply Leave</h4>
                        <select style={styles.smallInput} onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}><option>Sick</option><option>Casual</option></select>
                        <input style={{...styles.smallInput, flex: 2}} placeholder="Reason" onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} />
                        <button style={styles.saveBtn} onClick={() => axios.post(`${API}/apply-leave`, {...leaveForm, username: loggedUser}).then(fetchData)}>Submit</button>
                    </div>
                )}
                <div style={styles.table}>
                    <div style={styles.gridHeader}>
                        <span style={{width: '15%'}}>Name</span>
                        <span style={{width: '15%', textAlign:'center'}}>Type</span>
                        <span style={{width: '40%', textAlign:'center'}}>Reason</span>
                        <span style={{width: '15%', textAlign:'center'}}>Status</span>
                        <span style={{width: '15%', textAlign:'center'}}>Action</span>
                    </div>
                    {leaves.map(l => (
                        <div key={l.id} style={styles.gridRow}>
                            <span style={{width: '15%'}}>{l.employee_name}</span>
                            <span style={{width: '15%', textAlign:'center'}}>{l.leave_type}</span>
                            <span style={{width: '40%', textAlign:'center', fontSize:'13px', overflow:'hidden', textOverflow:'ellipsis'}}>{l.reason}</span>
                            <span style={{width: '15%', textAlign:'center', color: l.status === 'Approved' ? 'green' : 'orange'}}>{l.status}</span>
                            <div style={{width: '15%', textAlign:'center'}}>
                                {role === 'admin' && l.status === 'Pending' && <button style={styles.iconBtn} onClick={() => axios.post(`${API}/update-leave`, {id:l.id, status:'Approved'}).then(fetchData)}>✅</button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {view === "employees" && (
            <div style={styles.card}>
                <button style={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'X' : '+ Add Member'}</button>
                {showAdd && <div style={styles.formBox}><input style={styles.smallInput} placeholder="Name" onChange={v => setNewEmp({...newEmp, name:v.target.value})} /><input style={styles.smallInput} placeholder="Role" onChange={v => setNewEmp({...newEmp, position:v.target.value})} /><input style={styles.smallInput} type="number" placeholder="Salary" onChange={v => setNewEmp({...newEmp, salary:v.target.value})} /><input style={styles.smallInput} placeholder="Pass" onChange={v => setNewEmp({...newEmp, password:v.target.value})} /><button onClick={() => axios.post(`${API}/add-employee`, newEmp).then(fetchData)}>Save</button></div>}
                
                <div style={styles.table}>
                    <div style={styles.gridHeader}>
                        <span style={{width: '30%'}}>Name</span>
                        <span style={{width: '30%'}}>Role</span>
                        <span style={{width: '20%'}}>Salary</span>
                        <span style={{width: '20%', textAlign:'center'}}>Action</span>
                    </div>
                    {employees.map(e => <div key={e.id} style={styles.gridRow}>
                        <div style={{width: '30%'}}>{editingId === e.id ? <input style={styles.inlineIn} defaultValue={e.name} onChange={v => e.name=v.target.value}/> : e.name}</div>
                        <div style={{width: '30%'}}>{editingId === e.id ? <input style={styles.inlineIn} defaultValue={e.position} onChange={v => e.position=v.target.value}/> : e.position}</div>
                        <div style={{width: '20%'}}>{editingId === e.id ? <input style={styles.inlineIn} type="number" defaultValue={e.salary} onChange={v => e.salary=v.target.value}/> : `₹${e.salary}`}</div>
                        <div style={{width: '20%', textAlign:'center'}}>
                            <button style={styles.iconBtn} onClick={() => editingId === e.id ? handleEditSave(e) : setEditingId(e.id)}>{editingId === e.id ? '💾' : '✏️'}</button>
                            <button style={styles.iconBtn} onClick={() => axios.delete(`${API}/delete-employee/${e.id}`).then(fetchData)}>🗑️</button>
                        </div>
                    </div>)}
                </div>
            </div>
        )}

        {view === "analytics" && (
            <div style={styles.card}>
                <div style={styles.table}>
                    <div style={styles.gridHeader}>
                        <span style={{width: '25%'}}>Staff</span>
                        <span style={{width: '25%'}}>In Time</span>
                        <span style={{width: '25%'}}>Out Time</span>
                        <span style={{width: '25%'}}>Total Hours</span>
                    </div>
                    {analytics.map(a => (
                        <div key={a.id} style={styles.gridRow}>
                            <span style={{width: '25%'}}>{a.employee_name}</span>
                            <span style={{width: '25%'}}>{new Date(a.check_in).toLocaleTimeString()}</span>
                            <span style={{width: '25%'}}>{a.check_out ? new Date(a.check_out).toLocaleTimeString() : 'Active'}</span>
                            <span style={{width: '25%'}}>{parseFloat(a.total_hours || 0).toFixed(4)} hrs</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

const styles = {
    loginContainer: { height: '100vh', display: 'flex', background: 'white' },
    loginLeft: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' },
    loginContent: { width: '100%', maxWidth: '350px' },
    loginRight: { flex: 1.2, backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '60px' },
    overlay: { background: 'rgba(3, 105, 161, 0.8)', padding: '40px', borderRadius: '25px', color: 'white', backdropFilter: 'blur(5px)' },
    appBody: { display: 'flex', minHeight: '100vh', background: '#f0f9ff' },
    sidebar: { width: '250px', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' },
    sidebarBrand: { padding: '30px 20px', fontSize: '22px', fontWeight: 'bold', color: '#38bdf8' },
    menuItem: { padding: '15px 25px', color: '#94a3b8', cursor: 'pointer' },
    menuActive: { padding: '15px 25px', color: '#38bdf8', background: '#1e293b', borderLeft: '5px solid #38bdf8', fontWeight: 'bold' },
    main: { flex: 1, padding: '40px' },
    nav: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' },
    userBadge: { background: 'white', padding: '10px 20px', borderRadius: '12px', border: '1px solid #bae6fd' },
    card: { background: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '12px', margin: '5px 0', borderRadius: '10px', border: '1px solid #bae6fd', boxSizing: 'border-box' },
    primaryBtn: { width: '100%', padding: '12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
    table: { display: 'flex', flexDirection: 'column', marginTop: '10px' },
    gridHeader: { display: 'flex', background: '#bae6fd', padding: '15px', borderRadius: '12px', fontWeight: 'bold', boxSizing: 'border-box' },
    gridRow: { display: 'flex', padding: '15px', borderBottom: '1px solid #f0f9ff', alignItems: 'center', boxSizing: 'border-box' },
    inBtn: { background: '#10b981', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer' },
    outBtn: { background: '#f43f5e', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', marginLeft: '10px' },
    addBtn: { background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', marginBottom: '15px', cursor: 'pointer' },
    formBox: { display: 'flex', gap: '5px', marginBottom: '15px', background: '#f1f5f9', padding: '15px', borderRadius: '12px' },
    smallInput: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' },
    saveBtn: { background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', margin: '0 5px' },
    logoCircle: { width: '50px', height: '50px', background: '#0ea5e9', color: 'white', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' },
    inlineIn: { width: '90%', padding: '5px', borderRadius: '5px', border: '1px solid #38bdf8' }
};

export default App;