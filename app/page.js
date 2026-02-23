'use client';

import { useState, useEffect, useMemo } from 'react';
import { restaurantsData } from './data';

export default function Home() {
  const [restaurants] = useState(restaurantsData);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [awardFilter, setAwardFilter] = useState('');
  const [socialFilter, setSocialFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [seenItems, setSeenItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('restaurant');
  const [sortAsc, setSortAsc] = useState(true);
  const itemsPerPage = 25;

  useEffect(() => {
    const saved = localStorage.getItem('sommSeenItems');
    if (saved) setSeenItems(JSON.parse(saved));
  }, []);

  const toggleSeen = (id) => {
    const newSeen = seenItems.includes(id)
      ? seenItems.filter(i => i !== id)
      : [...seenItems, id];
    setSeenItems(newSeen);
    localStorage.setItem('sommSeenItems', JSON.stringify(newSeen));
  };

  const filteredData = useMemo(() => {
    let data = restaurants.filter(r => {
      if (search) {
        const text = `${r.restaurant} ${r.city} ${r.wine_director} ${r.sommelier} ${r.general_manager}`.toLowerCase();
        if (!text.includes(search.toLowerCase())) return false;
      }
      if (countryFilter && r.country !== countryFilter) return false;
      if (awardFilter && r.award !== awardFilter) return false;
      if (statusFilter === 'seen' && !seenItems.includes(r.id)) return false;
      if (statusFilter === 'unseen' && seenItems.includes(r.id)) return false;
      return true;
    });

    data.sort((a, b) => {
      const aVal = (a[sortField] || '').toLowerCase();
      const bVal = (b[sortField] || '').toLowerCase();
      if (sortAsc) return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });

    return data;
  }, [restaurants, search, countryFilter, awardFilter, statusFilter, seenItems, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: restaurants.length,
    reviewed: seenItems.length,
    progress: restaurants.length > 0 ? Math.round((seenItems.length / restaurants.length) * 100) : 0,
  };

  const countries = [...new Set(restaurants.map(r => r.country).filter(Boolean))].sort();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getAwardStyle = (award) => {
    if (award === 'Grand Award') return { bg: '#FFF9C4', color: '#F57F17', border: '#FFE082' };
    if (award === 'Best of Award of Excellence') return { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' };
    return { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' };
  };

  return (
    <div style={{fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background:'#faf8f5', minHeight:'100vh'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg, #722F37 0%, #5A252C 100%)', color:'#fff', padding:'20px 24px'}}>
        <h1 style={{fontSize:'22px', fontWeight:700, margin:0}}>🍷 Somm Directory <span style={{color:'#C5A55A'}}>Social Tracker</span></h1>
        <div style={{fontSize:'13px', opacity:0.8, marginTop:'4px'}}>Wine Spectator Restaurant Awards - {stats.total} Restaurants</div>
      </div>

      <div style={{maxWidth:'1400px', margin:'0 auto', padding:'20px'}}>
        {/* Stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'16px', marginBottom:'24px'}}>
          <div style={{background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #e8e4df'}}>
            <div style={{fontSize:'12px', textTransform:'uppercase', color:'#777'}}>Total Restaurants</div>
            <div style={{fontSize:'28px', fontWeight:700, color:'#722F37'}}>{stats.total}</div>
          </div>
          <div style={{background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #e8e4df', borderLeft:'4px solid #C5A55A'}}>
            <div style={{fontSize:'12px', textTransform:'uppercase', color:'#777'}}>Reviewed</div>
            <div style={{fontSize:'28px', fontWeight:700, color:'#722F37'}}>{stats.reviewed}</div>
            <div style={{fontSize:'12px', color:'#777'}}>{stats.progress}%</div>
          </div>
          <div style={{background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #e8e4df'}}>
            <div style={{fontSize:'12px', textTransform:'uppercase', color:'#777'}}>Progress</div>
            <div style={{width:'100%', height:'8px', background:'#e0e0e0', borderRadius:'4px', marginTop:'8px'}}>
              <div style={{width:`${stats.progress}%`, height:'100%', background:'#722F37', borderRadius:'4px'}}></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{background:'#fff', borderRadius:'12px', padding:'16px 20px', border:'1px solid #e8e4df', marginBottom:'20px', display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'flex-end'}}>
          <div style={{display:'flex', flexDirection:'column', gap:'4px', flex:'2', minWidth:'220px'}}>
            <label style={{fontSize:'11px', textTransform:'uppercase', color:'#777', fontWeight:600}}>Search</label>
            <input type="text" value={search} onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} placeholder="Restaurant, person, city..." style={{padding:'8px 12px', border:'1px solid #e8e4df', borderRadius:'8px'}} />
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'4px', minWidth:'160px'}}>
            <label style={{fontSize:'11px', textTransform:'uppercase', color:'#777', fontWeight:600}}>Country</label>
            <select value={countryFilter} onChange={(e) => {setCountryFilter(e.target.value); setCurrentPage(1);}} style={{padding:'8px 12px', border:'1px solid #e8e4df', borderRadius:'8px'}}>
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'4px', minWidth:'160px'}}>
            <label style={{fontSize:'11px', textTransform:'uppercase', color:'#777', fontWeight:600}}>Award</label>
            <select value={awardFilter} onChange={(e) => {setAwardFilter(e.target.value); setCurrentPage(1);}} style={{padding:'8px 12px', border:'1px solid #e8e4df', borderRadius:'8px'}}>
              <option value="">All Awards</option>
              <option value="Grand Award">Grand Award</option>
              <option value="Best of Award of Excellence">Best of Award</option>
              <option value="Award of Excellence">Award of Excellence</option>
            </select>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'4px', minWidth:'160px'}}>
            <label style={{fontSize:'11px', textTransform:'uppercase', color:'#777', fontWeight:600}}>Status</label>
            <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} style={{padding:'8px 12px', border:'1px solid #e8e4df', borderRadius:'8px'}}>
              <option value="">All</option>
              <option value="seen">Reviewed</option>
              <option value="unseen">Not Reviewed</option>
            </select>
          </div>
          <button onClick={() => {setSearch(''); setCountryFilter(''); setAwardFilter(''); setStatusFilter(''); setCurrentPage(1);}} style={{padding:'8px 16px', borderRadius:'8px', border:'1px solid #e8e4df', background:'#fff', cursor:'pointer'}}>Reset</button>
          <span style={{fontSize:'13px', color:'#777'}}>{filteredData.length} results</span>
        </div>

        {/* Table */}
        <div style={{background:'#fff', borderRadius:'12px', border:'1px solid #e8e4df', overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
              <thead>
                <tr style={{background:'#722F37', color:'#fff'}}>
                  <th style={{padding:'12px 14px', textAlign:'left', fontWeight:600, fontSize:'12px', textTransform:'uppercase', width:'50px'}}>✓</th>
                  <th onClick={() => handleSort('restaurant')} style={{padding:'12px 14px', textAlign:'left', fontWeight:600, fontSize:'12px', textTransform:'uppercase', cursor:'pointer'}}>Restaurant {sortField==='restaurant' && (sortAsc?'▲':'▼')}</th>
                  <th onClick={() => handleSort('city')} style={{padding:'12px 14px', textAlign:'left', fontWeight:600, fontSize:'12px', textTransform:'uppercase', cursor:'pointer'}}>Location {sortField==='city' && (sortAsc?'▲':'▼')}</th>
                  <th onClick={() => handleSort('award')} style={{padding:'12px 14px', textAlign:'left', fontWeight:600, fontSize:'12px', textTransform:'uppercase', cursor:'pointer'}}>Award {sortField==='award' && (sortAsc?'▲':'▼')}</th>
                  <th onClick={() => handleSort('wine_director')} style={{padding:'12px 14px', textAlign:'left', fontWeight:600, fontSize:'12px', textTransform:'uppercase', cursor:'pointer'}}>Wine Director {sortField==='wine_director' && (sortAsc?'▲':'▼')}</th>
                  <th onClick={() => handleSort('sommelier')} style={{padding:'12px 14px', textAlign:'left', fontWeight:600, fontSize:'12px', textTransform:'uppercase', cursor:'pointer'}}>Sommelier {sortField==='sommelier' && (sortAsc?'▲':'▼')}</th>
                  <th onClick={() => handleSort('general_manager')} style={{padding:'12px 14px', textAlign:'left', fontWeight:600, fontSize:'12px', textTransform:'uppercase', cursor:'pointer'}}>GM {sortField==='general_manager' && (sortAsc?'▲':'▼')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(r => {
                  const awardStyle = getAwardStyle(r.award);
                  return (
                    <tr key={r.id} style={{borderBottom:'1px solid #e8e4df', background:seenItems.includes(r.id)?'#f5f3f0':'#fff', opacity:seenItems.includes(r.id)?0.7:1}}>
                      <td style={{padding:'10px 14px', textAlign:'center'}}>
                        <input type="checkbox" checked={seenItems.includes(r.id)} onChange={() => toggleSeen(r.id)} style={{width:'18px', height:'18px', accentColor:'#722F37', cursor:'pointer'}} />
                      </td>
                      <td style={{padding:'10px 14px', fontWeight:500, fontSize:'13px'}}>{r.restaurant}</td>
                      <td style={{padding:'10px 14px', fontSize:'12px', color:'#777'}}>{r.city}{r.state && `, ${r.state}`}</td>
                      <td style={{padding:'10px 14px'}}>
                        <span style={{display:'inline-block', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:600, background:awardStyle.bg, color:awardStyle.color, border:`1px solid ${awardStyle.border}`}}>
                          {r.award}
                        </span>
                      </td>
                      <td style={{padding:'10px 14px', fontSize:'13px', color:r.wine_director?'#2d2d2d':'#999', fontStyle:r.wine_director?'normal':'italic'}}>{r.wine_director || '-'}</td>
                      <td style={{padding:'10px 14px', fontSize:'13px', color:r.sommelier?'#2d2d2d':'#999', fontStyle:r.sommelier?'normal':'italic'}}>{r.sommelier || '-'}</td>
                      <td style={{padding:'10px 14px', fontSize:'13px', color:r.general_manager?'#2d2d2d':'#999', fontStyle:r.general_manager?'normal':'italic'}}>{r.general_manager || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', padding:'16px', borderTop:'1px solid #e8e4df'}}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage===1} style={{padding:'6px 14px', borderRadius:'6px', border:'1px solid #e8e4df', background:'#fff', cursor:currentPage===1?'default':'pointer', opacity:currentPage===1?0.4:1}}>First</button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} style={{padding:'6px 14px', borderRadius:'6px', border:'1px solid #e8e4df', background:'#fff', cursor:currentPage===1?'default':'pointer', opacity:currentPage===1?0.4:1}}>Prev</button>
            <span style={{fontSize:'13px', color:'#777', padding:'0 12px'}}>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} style={{padding:'6px 14px', borderRadius:'6px', border:'1px solid #e8e4df', background:'#fff', cursor:currentPage===totalPages?'default':'pointer', opacity:currentPage===totalPages?0.4:1}}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage===totalPages} style={{padding:'6px 14px', borderRadius:'6px', border:'1px solid #e8e4df', background:'#fff', cursor:currentPage===totalPages?'default':'pointer', opacity:currentPage===totalPages?0.4:1}}>Last</button>
          </div>
        </div>
      </div>
    </div>
  );
}
