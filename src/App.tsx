import "./App.css";
import Space from "./components/Space";

function App() {
  return (
    <div>
      <Space direction="horizontal" size="small" align="end">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    </div>
  );
}

export default App;
