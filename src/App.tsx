import "./App.css";
import Space from "./components/Space";
import { ConfigProvider } from "./components/Space/ConfigProvider";

function App() {
  return (
    <div>
      <ConfigProvider space={{ size: 20 }}>
        <Space direction="horizontal" align="end" split={<>123</>}>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </Space>
      </ConfigProvider>
    </div>
  );
}

export default App;
