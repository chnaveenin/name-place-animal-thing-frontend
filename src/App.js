import { Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import Game from './pages/Game'


function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route exact path="/:roomid" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;