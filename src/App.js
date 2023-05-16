import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import "./App.css";
import Login from "./Components/Login/Login";
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import BoxSize from "./Components/BoxSize/BoxSize";
import CardbordPalletInventary from "./Components/CardbordPalletInventary/CardbordPalletInventary";
import ProductionSheet from "./Components/ProductionSheet/ProductionSheet";

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/ProductionSheet" element={<ProductionSheet />} />
          <Route
            path="/CardbordPalletInventary"
            element={<CardbordPalletInventary />}
          />
          <Route path="/BoxSize" element={<BoxSize />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
