import React, { useEffect, useState } from 'react';

function App() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ title: '', authorId: '', category: '', length: '' });

  const API_URL = 'https://r4pt3yf02l.execute-api.eu-central-1.amazonaws.com/v1/courses';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCourses(JSON.parse(data.body)))
      .catch(err => console.error("Помилка API:", err));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Тут ми додаємо id (якщо твій бекенд його вимагає)
    const newCourse = { ...formData, id: Date.now().toString() };

    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(newCourse)
    }).then(() => {
      fetchCourses();
      setFormData({ title: '', authorId: '', category: '', length: '' });
    });
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#0056b3' }}>Управління курсами (CloudTech)</h1>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Форма додавання */}
        <section style={{ background: '#e9ecef', padding: '25px', borderRadius: '10px', marginBottom: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#004085', marginTop: 0 }}>Додати новий курс</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Назва курсу (напр., Вступ до AWS)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} required />
            <input placeholder="ID Автора (напр., cory-house)" value={formData.authorId} onChange={e => setFormData({...formData, authorId: e.target.value})} style={inputStyle} required />
            <input placeholder="Категорія (напр., Хмарні технології)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle} required />
            <input placeholder="Тривалість (напр., 5:30)" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} style={inputStyle} required />
            <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Зберегти курс</button>
          </form>
        </section>

        {/* Список курсів */}
        <section>
          <h2 style={{ color: '#004085' }}>Доступні курси</h2>
          {courses.map(course => (
            <div key={course.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px', borderLeft: '5px solid #0056b3', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{course.title || course.Title}</h3>
              <p style={{ margin: '5px 0' }}><strong>ID:</strong> {course.id}</p>
              <p style={{ margin: '5px 0' }}><strong>Автор (ID):</strong> {course.authorId || 'N/A'}</p>
              <p style={{ margin: '5px 0' }}><strong>Категорія:</strong> {course.category || course.Category || 'N/A'}</p>
              <p style={{ margin: '5px 0' }}><strong>Тривалість:</strong> {course.length || 'N/A'}</p>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button style={btnActionStyle('#ffc107')}>Редагувати</button>
                <button style={btnActionStyle('#dc3545')}>Видалити</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '16px' };
const btnActionStyle = (color) => ({ backgroundColor: color, color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' });

export default App;