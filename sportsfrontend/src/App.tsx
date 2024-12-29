import "./App.css";
import { Provider } from "./components/ui/provider";
import { Display } from "./components/display";

function App() {
  return (
    <Provider>
      <Display />
    </Provider>
  );
}

export default App;
