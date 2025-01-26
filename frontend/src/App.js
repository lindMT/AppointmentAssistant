import './App.css';
import Nav from './Nav';
import RegisterUsers from './components/registerUsers';
import BookAppointments from './components/bookAppointments';
import DisplayAppointments from './components/displayAppointments';
import EditAppointment from './components/editAppointment';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App"  style={{height: "100%"}}>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<RegisterUsers />}/>
          <Route path="/bookAppointments" element={<BookAppointments />}/>
          <Route path="/displayAppointments" element={<DisplayAppointments />}/>
          <Route path="/editAppointment/:id" element={<EditAppointment />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
