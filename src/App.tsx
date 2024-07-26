import { Routes, Route, BrowserRouter } from "react-router-dom";
import Homepage from "./pages/index";
import FormBuilder from "./pages/FormBuilder";
import FlowBuilder from "./pages/FlowBuilder";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ROUTES } from "./Routes/RouteConstants";
import TaskBuilder from "./pages/TaskBuilder";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOMEPAGE} element={<Homepage />} />
          <Route path={ROUTES.FORM_BUILDER} element={<FormBuilder />} />
          <Route path={ROUTES.FLOW_BUILDER} element={<FlowBuilder />} />
          <Route path={ROUTES.TASK_BUILDER} element={<TaskBuilder />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
