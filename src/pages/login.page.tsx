import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { Button, Flex, Grid, Spin, Typography, theme, message } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  MessageFilled,
  MoonOutlined,
  SunOutlined,
  TrophyFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { AiOutlineGoogle } from "react-icons/ai";
import { auth } from "../common/config/router/firebase.config";
import { useAppTheme } from "../common/theme/ThemeProvider";

const { useBreakpoint } = Grid;

const Login = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { token } = theme.useToken();
  const { darkMode, toggleTheme } = useAppTheme();

  const [loader, setLoader] = useState(false);

  const isMobile = !screens.md;
  const isTablet = !screens.lg;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  const authentication = async () => {
    if (loader) return;

    try {
      setLoader(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("adminauth", user.email ?? "");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to sign in with Google. Please try again.";

      message.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const featureItems = [
    {
      icon: <TrophyFilled />,
      title: "Competitions",
      description: "Organize and manage competition events.",
      color: token.colorPrimary,
      background: token.colorPrimaryBg,
    },
    {
      icon: <UsergroupAddOutlined />,
      title: "Participants",
      description: "Keep registration and participant activity organized.",
      color: token.colorInfo,
      background: token.colorInfoBg,
    },
    {
      icon: <MessageFilled />,
      title: "Feedback",
      description: "Manage evaluation and feedback workflows.",
      color: token.colorSuccess,
      background: token.colorSuccessBg,
    },
  ];

  const workflowItems = [
    {
      number: "01",
      title: "Create",
      description: "Set up competitions and event structure.",
    },
    {
      number: "02",
      title: "Run",
      description: "Manage participants, rounds and submissions.",
    },
    {
      number: "03",
      title: "Evaluate",
      description: "Review presentations and feedback.",
    },
  ];

  const panelStyle = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
  };

  return (
    <Spin spinning={loader} size="large" tip="Signing you in...">
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: token.colorBgLayout,
          color: token.colorText,
          overflowX: "hidden",
        }}
      >
        {/* Decorative background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${token.colorBorderSecondary} 1px, transparent 1px), linear-gradient(90deg, ${token.colorBorderSecondary} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: darkMode ? 0.18 : 0.45,
            maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          }}
        />

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            width: "100%",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgContainer,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1180,
              minHeight: 72,
              margin: "0 auto",
              padding: isMobile ? "0 16px" : "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            {/* Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 11,
                  background: token.colorPrimary,
                  color: "#fff",
                  fontSize: 17,
                  boxShadow: `0 8px 22px ${token.colorPrimary}30`,
                }}
              >
                <TrophyFilled />
              </div>

              <div style={{ minWidth: 0 }}>
                <Typography.Text
                  strong
                  style={{
                    display: "block",
                    color: token.colorText,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  Competition Manager
                </Typography.Text>

                {!isMobile && (
                  <Typography.Text
                    type="secondary"
                    style={{
                      display: "block",
                      marginTop: 5,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.13em",
                      lineHeight: 1,
                    }}
                  >
                    ADMIN PLATFORM
                  </Typography.Text>
                )}
              </div>
            </div>

            {/* Navigation */}
            {!isMobile && (
              <Flex align="center" gap={24}>
                <a
                  href="#overview"
                  style={{
                    color: token.colorTextSecondary,
                    textDecoration: "none",
                    fontSize: 12,
                  }}
                >
                  Overview
                </a>

                <a
                  href="#features"
                  style={{
                    color: token.colorTextSecondary,
                    textDecoration: "none",
                    fontSize: 12,
                  }}
                >
                  Features
                </a>

                <a
                  href="#workflow"
                  style={{
                    color: token.colorTextSecondary,
                    textDecoration: "none",
                    fontSize: 12,
                  }}
                >
                  Workflow
                </a>

                <button
                  type="button"
                  onClick={toggleTheme}
                  title={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  style={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorFillQuaternary,
                    color: token.colorTextSecondary,
                    cursor: "pointer",
                  }}
                >
                  {darkMode ? <SunOutlined /> : <MoonOutlined />}
                </button>

                <Button
                  type="primary"
                  onClick={() => {
                    document
                      .getElementById("login")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Admin Login
                  <ArrowRightOutlined />
                </Button>
              </Flex>
            )}

            {isMobile && (
              <Flex align="center" gap={8}>
                <button
                  type="button"
                  onClick={toggleTheme}
                  title={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  style={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorFillQuaternary,
                    color: token.colorTextSecondary,
                    cursor: "pointer",
                  }}
                >
                  {darkMode ? <SunOutlined /> : <MoonOutlined />}
                </button>

                <Button
                  type="primary"
                  onClick={() => {
                    document
                      .getElementById("login")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Login
                </Button>
              </Flex>
            )}
          </div>
        </header>

        {/* =====================================================
            HERO
        ===================================================== */}

        <main style={{ position: "relative", zIndex: 1 }}>
          <section
            id="overview"
            style={{
              width: "100%",
              maxWidth: 1180,
              margin: "0 auto",
              padding: isMobile ? "48px 16px 52px" : "72px 24px 84px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isTablet
                  ? "1fr"
                  : "minmax(0, 1.1fr) minmax(360px, 0.9fr)",
                alignItems: "center",
                gap: isTablet ? 42 : 70,
              }}
            >
              {/* Product copy */}
              <div style={{ minWidth: 0 }}>
                <Typography.Text
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: token.colorPrimary,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: token.colorSuccess,
                    }}
                  />
                  COMPETITION MANAGEMENT PLATFORM
                </Typography.Text>

                <Typography.Title
                  level={1}
                  style={{
                    margin: "18px 0 0",
                    maxWidth: 720,
                    color: token.colorText,
                    fontSize: isMobile ? 44 : 64,
                    lineHeight: 1,
                    letterSpacing: "-0.055em",
                  }}
                >
                  Run every
                  <span
                    style={{
                      display: "block",
                      color: token.colorPrimary,
                    }}
                  >
                    competition.
                  </span>
                  <span
                    style={{
                      display: "block",
                    }}
                  >
                    One workspace.
                  </span>
                </Typography.Title>

                <Typography.Paragraph
                  type="secondary"
                  style={{
                    maxWidth: 590,
                    margin: "22px 0 0",
                    fontSize: 14,
                    lineHeight: 1.8,
                  }}
                >
                  Manage competitions, participants, rounds, presentations and
                  feedback through one focused administration workspace.
                </Typography.Paragraph>

                <div
                  id="features"
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                    marginTop: 34,
                  }}
                >
                  {featureItems.map((item) => (
                    <div
                      key={item.title}
                      style={{
                        ...panelStyle,
                        minWidth: 0,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 10,
                          background: item.background,
                          color: item.color,
                          fontSize: 16,
                        }}
                      >
                        {item.icon}
                      </div>

                      <Typography.Text
                        strong
                        style={{
                          display: "block",
                          marginTop: 13,
                          color: token.colorText,
                          fontSize: 12,
                        }}
                      >
                        {item.title}
                      </Typography.Text>

                      <Typography.Text
                        type="secondary"
                        style={{
                          display: "block",
                          marginTop: 5,
                          fontSize: 10,
                          lineHeight: 1.55,
                        }}
                      >
                        {item.description}
                      </Typography.Text>
                    </div>
                  ))}
                </div>

                <Button
                  type="link"
                  href="#workflow"
                  style={{
                    padding: 0,
                    marginTop: 22,
                    height: 28,
                  }}
                >
                  Explore the workflow
                  <ArrowRightOutlined />
                </Button>
              </div>

              {/* Login card */}
              <div
                id="login"
                style={{
                  width: "100%",
                  maxWidth: 410,
                  justifySelf: isTablet ? "stretch" : "end",
                  margin: isTablet ? "0 auto" : 0,
                }}
              >
                <div
                  style={{
                    ...panelStyle,
                    width: "100%",
                    padding: isMobile ? 22 : 30,
                    boxShadow: darkMode
                      ? "0 24px 80px rgba(0,0,0,0.28)"
                      : "0 24px 80px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 13,
                      background: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      fontSize: 19,
                    }}
                  >
                    <TrophyFilled />
                  </div>

                  <Typography.Text
                    style={{
                      display: "block",
                      marginTop: 24,
                      color: token.colorPrimary,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                    }}
                  >
                    ADMIN ACCESS
                  </Typography.Text>

                  <Typography.Title
                    level={2}
                    style={{
                      margin: "10px 0 0",
                      color: token.colorText,
                      fontSize: 30,
                      lineHeight: 1.15,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Welcome back.
                  </Typography.Title>

                  <Typography.Paragraph
                    type="secondary"
                    style={{
                      margin: "10px 0 0",
                      fontSize: 12,
                      lineHeight: 1.7,
                    }}
                  >
                    Sign in to manage competitions, participants and rounds.
                  </Typography.Paragraph>

                  <button
                    type="button"
                    onClick={authentication}
                    disabled={loader}
                    style={{
                      width: "100%",
                      minHeight: 56,
                      marginTop: 26,
                      display: "flex",
                      alignItems: "center",
                      padding: 7,
                      borderRadius: 13,
                      border: `1px solid ${token.colorBorderSecondary}`,
                      background: token.colorText,
                      color: token.colorBgContainer,
                      cursor: loader ? "not-allowed" : "pointer",
                      opacity: loader ? 0.65 : 1,
                    }}
                  >
                    <span
                      style={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        background: token.colorBgContainer,
                        color: "#4285F4",
                        fontSize: 21,
                      }}
                    >
                      <AiOutlineGoogle />
                    </span>

                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        marginLeft: 12,
                        textAlign: "left",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Continue with Google
                    </span>

                    <ArrowRightOutlined />
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 9,
                      marginTop: 16,
                      padding: 13,
                      borderRadius: 11,
                      background: token.colorFillQuaternary,
                      border: `1px solid ${token.colorBorderSecondary}`,
                    }}
                  >
                    <CheckCircleFilled
                      style={{
                        marginTop: 2,
                        color: token.colorSuccess,
                      }}
                    />

                    <Typography.Text
                      type="secondary"
                      style={{
                        fontSize: 10,
                        lineHeight: 1.6,
                      }}
                    >
                      Secure authentication powered by Google and Firebase.
                    </Typography.Text>
                  </div>

                  <Typography.Text
                    type="secondary"
                    style={{
                      display: "block",
                      marginTop: 18,
                      paddingTop: 16,
                      borderTop: `1px solid ${token.colorBorderSecondary}`,
                      textAlign: "center",
                      fontSize: 9,
                    }}
                  >
                    Authorized administrators only
                  </Typography.Text>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              WORKFLOW
          ===================================================== */}

          <section
            id="workflow"
            style={{
              width: "100%",
              maxWidth: 1180,
              margin: "0 auto",
              padding: isMobile ? "0 16px 60px" : "0 24px 84px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              <Typography.Text
                style={{
                  color: token.colorPrimary,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                }}
              >
                SIMPLE WORKFLOW
              </Typography.Text>

              <Typography.Title
                level={2}
                style={{
                  margin: "9px 0 0",
                  color: token.colorText,
                  fontSize: isMobile ? 28 : 36,
                  letterSpacing: "-0.04em",
                }}
              >
                Everything connected.
              </Typography.Title>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              {workflowItems.map((item) => (
                <div
                  key={item.number}
                  style={{
                    ...panelStyle,
                    padding: isMobile ? 18 : 22,
                  }}
                >
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                    }}
                  >
                    {item.number}
                  </Typography.Text>

                  <Typography.Title
                    level={4}
                    style={{
                      margin: "14px 0 6px",
                      color: token.colorText,
                      fontSize: 16,
                    }}
                  >
                    {item.title}
                  </Typography.Title>

                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: 11,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </Typography.Text>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </Spin>
  );
};

export default Login;
