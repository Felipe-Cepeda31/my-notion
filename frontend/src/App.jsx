import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pages, setPages] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [newBlockText, setNewBlockText] = useState('');

  const [showWizard, setShowWizard] = useState(false);
  const [wizardDate, setWizardDate] = useState('');
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardDesc, setWizardDesc] = useState('');

  const fetchPages = () => {
    fetch('http://localhost:8081/api/pages')
      .then(response => response.json())
      .then(data => setPages(data))
      .catch(error => console.error("Error al conectar con Spring Boot:", error));
  };

  const fetchEvents = () => {
    fetch('http://localhost:8081/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error("Error cargando eventos:", error));
  };

  useEffect(() => {
    fetchPages();
    fetchEvents();
  }, []);

  const handleCreatePage = () => {
    const title = prompt("Nombre del nuevo documento:");
    if (!title) return;

    fetch('http://localhost:8081/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, blocks: [] }),
    }).then(() => fetchPages());
  };

  const handleAddBlock = (e, page) => {
    if (e.key === 'Enter' && newBlockText.trim() !== '') {
      const updatedPage = {
        ...page,
        blocks: [
          ...page.blocks,
          {
            type: 'paragraph',
            content: newBlockText,
            positionIndex: page.blocks.length
          }
        ]
      };

      fetch('http://localhost:8081/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPage),
      }).then(() => {
        setNewBlockText('');
        fetchPages();
      });
    }
  };

  const handleSaveEvent = () => {
    if (!wizardTitle.trim()) return;

    const newEvent = {
      title: wizardTitle,
      description: wizardDesc,
      date: wizardDate
    };

    fetch('http://localhost:8081/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    }).then(() => {
      setShowWizard(false);
      setWizardTitle('');
      setWizardDesc('');
      fetchEvents();
    });
  };

  const openWizard = (dateString) => {
    setWizardDate(dateString);
    setShowWizard(true);
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const selectedPage = pages.find(page => page.id === selectedPageId);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">my-notion</div>
        <input type="text" className="search-bar" placeholder="Buscar en todo..." />

        <div className="menu-section">
          <span className="menu-title">MI ESPACIO</span>
          <div
            className={`menu-item ${selectedPageId === null ? 'active' : ''}`}
            onClick={() => setSelectedPageId(null)}
          >
            Inicio
          </div>
          <div
            className={`menu-item ${selectedPageId === 'calendario' ? 'active' : ''}`}
            onClick={() => setSelectedPageId('calendario')}
          >
            Calendario
          </div>
          <div
            className={`menu-item ${selectedPageId === 'notas' ? 'active' : ''}`}
            onClick={() => setSelectedPageId('notas')}
          >
            Notas Rapidas
          </div>
          <div
            className={`menu-item ${selectedPageId === 'proyectos' ? 'active' : ''}`}
            onClick={() => setSelectedPageId('proyectos')}
          >
            Proyectos
          </div>
        </div>

        <div className="menu-section">
          <span className="menu-title">MIS PAGINAS</span>
          {pages.length === 0 ? <div className="menu-item" style={{ opacity: 0.5 }}>No hay paginas...</div> : null}
          {pages.map(page => (
            <div
              key={page.id}
              className={`menu-item ${selectedPageId === page.id ? 'active' : ''}`}
              onClick={() => setSelectedPageId(page.id)}
            >
              {page.title}
            </div>
          ))}
        </div>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <div>{selectedPage ? selectedPage.title : (typeof selectedPageId === 'string' ? selectedPageId.toUpperCase() : 'Pagina Principal')}</div>
          <button className="new-btn" onClick={handleCreatePage}>Nuevo +</button>
        </div>

        {selectedPageId === null ? (
          <div className="dashboard">
            <div className="banner"></div>
            <h2 className="page-title">Pagina Principal</h2>
            <div className="grid-container">
              <div className="card">
                <h3>Bienvenida</h3>
                <p>Hola, Felipe!</p>
                <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>Hoy es un excelente dia para codear.</p>
              </div>
            </div>
          </div>

        ) : selectedPageId === 'calendario' ? (

          <div className="dashboard">
            <div className="banner" style={{ background: 'linear-gradient(90deg, #e6ddf7, #cce2ff)' }}></div>
            <h2 className="page-title">{monthNames[currentMonth]} {currentYear}</h2>

            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #f0e6d8' }}>
              <div className="calendar-grid">
                {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
                  <div key={day} className="calendar-header-day">{day}</div>
                ))}

                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

                  const dayEvents = events.filter(e => e.date === dateString);

                  return (
                    <div key={dayNum} className="calendar-day" onClick={() => openWizard(dateString)}>
                      <span className="day-number">{dayNum}</span>
                      {dayEvents.map(ev => (
                        <div key={ev.id} className="event-indicator" title={ev.description}>
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        ) : typeof selectedPageId === 'string' ? (
          <div className="dashboard">
            <div className="banner" style={{ background: 'linear-gradient(90deg, #e6ddf7, #cce2ff)' }}></div>
            <h2 className="page-title">{selectedPageId.toUpperCase()}</h2>
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #f0e6d8' }}>
              <p style={{ color: '#aaa' }}>Seccion en construccion...</p>
            </div>
          </div>
        ) : (
          <div className="dashboard">
            <div className="banner" style={{ background: 'linear-gradient(90deg, #e6ddf7, #cce2ff)' }}></div>
            <h2 className="page-title">{selectedPage.title}</h2>
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #f0e6d8', minHeight: '400px' }}>
              {selectedPage.blocks && selectedPage.blocks.length > 0 ? (
                selectedPage.blocks.map(block => (
                  <div key={block.id} style={{ marginBottom: '16px' }}>
                    {block.type === 'h1' ? (
                      <h1 style={{ fontSize: '32px', margin: 0, color: '#4a3b69' }}>{block.content}</h1>
                    ) : (
                      <p style={{ margin: 0, fontSize: '16px', color: '#444', lineHeight: '1.6' }}>{block.content}</p>
                    )}
                  </div>
                ))
              ) : null}
              <input
                type="text"
                value={newBlockText}
                onChange={(e) => setNewBlockText(e.target.value)}
                onKeyDown={(e) => handleAddBlock(e, selectedPage)}
                placeholder="Escribe algo y presiona Enter..."
                style={{ width: '100%', padding: '12px', marginTop: '20px', border: 'none', borderLeft: '3px solid #d4c5eb', outline: 'none', backgroundColor: '#f9f9f9' }}
              />
            </div>
          </div>
        )}
      </main>

      {showWizard && (
        <div className="wizard-overlay">
          <div className="wizard-modal">
            <h3>Nuevo Evento: {wizardDate}</h3>

            <label style={{ fontSize: '12px', color: '#7a6b9c', fontWeight: 'bold' }}>TITULO</label>
            <input
              type="text"
              className="wizard-input"
              placeholder="Ej. Reunion de trabajo"
              value={wizardTitle}
              onChange={(e) => setWizardTitle(e.target.value)}
              autoFocus
            />

            <label style={{ fontSize: '12px', color: '#7a6b9c', fontWeight: 'bold' }}>DESCRIPCION</label>
            <textarea
              className="wizard-input"
              placeholder="Detalles del evento..."
              rows="3"
              value={wizardDesc}
              onChange={(e) => setWizardDesc(e.target.value)}
            ></textarea>

            <div className="wizard-buttons">
              <button className="btn-cancel" onClick={() => setShowWizard(false)}>Cancelar</button>
              <button className="btn-save" onClick={handleSaveEvent}>Guardar Evento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;