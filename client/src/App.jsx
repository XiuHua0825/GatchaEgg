import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SinglePlay from './pages/SinglePlay';
import BattleRoom from './pages/BattleRoom';
import BroadcastView from './components/BroadcastView';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <BroadcastView />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/single" element={<SinglePlay />} />
          <Route path="/battle" element={<BattleRoom />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

