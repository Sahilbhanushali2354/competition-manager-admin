import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Typography, theme } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: 24,
        background: token.colorBgLayout,
        color: token.colorText,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: token.colorPrimary,
          color: "#fff",
          boxShadow: `0 10px 28px ${token.colorPrimary}30`,
          fontSize: 24,
        }}
      >
        <LoadingOutlined />
      </div>

      <div>
        <Typography.Title
          level={3}
          style={{ margin: 0, color: token.colorText }}
        >
          Competition Manager
        </Typography.Title>
        <Typography.Text type="secondary">
          Preparing your workspace...
        </Typography.Text>
      </div>

      <Spin size="small" />
    </div>
  );
};

export default Splash;
