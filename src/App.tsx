import { Routes, Route } from "react-router"
import './App.css'
import { HomePage } from "./pages/HomePage/Homepage"
import { MainPage } from "./pages/mainPage/mainPage"
function App() {
  return (
    <Routes>
       <Route path="/" element={<HomePage/>} />
       <Route path="/mainPage" element={<MainPage/>} />
    </Routes>
  )
}

export default App
