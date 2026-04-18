import { ConfigProvider } from "antd";
import AppRouter from "./app/AppRouter";

const antTheme = {
  token: {
    colorPrimary: "#059669",
    borderRadius: 8,
    fontFamily: "Inter, sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider theme={antTheme}>
      <AppRouter />
    </ConfigProvider>
  );
}
