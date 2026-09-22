import {
  Avatar,
  Drawer,
  Dropdown,
  Grid,
  Layout,
  Menu,
  message,
  theme,
} from "antd";

import {
  AppstoreOutlined,
  BellOutlined,
  FormOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { useEffect, useMemo, useState } from "react";
import { auth } from "../common/config/router/firebase.config";
import { useAppTheme } from "../common/theme/ThemeProvider";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const Mainlayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  const isMobile = !screens.lg;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");

  const { darkMode, toggleTheme } = useAppTheme();
  const { token } = theme.useToken();

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      setAdminEmail(user.email || "");
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminauth");

    if (storedEmail) {
      setAdminEmail(storedEmail);
    }
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const signout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("adminauth");

      navigate("/login");
    } catch (error) {
      console.error(error);

      message.error("Unable to log out. Please try again.");
    }
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const navigationItems = [
    {
      key: "/dashboard",
      icon: <AppstoreOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/participantregistration",
      icon: <UserAddOutlined />,
      label: <Link to="/participantregistration">Register Participant</Link>,
    },
    {
      key: "/allparticipants",
      icon: <TeamOutlined />,
      label: <Link to="/allparticipants">All Participants</Link>,
    },
    {
      key: "/competition",
      icon: <TrophyOutlined />,
      label: <Link to="/competition">Competition</Link>,
    },
    {
      key: "/feedback",
      icon: <FormOutlined />,
      label: <Link to="/feedback">Feedback</Link>,
    },
  ];

  const pageNames: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/participantregistration": "Register Participant",
    "/allparticipants": "All Participants",
    "/competition": "Competition",
    "/feedback": "Feedback",
  };

  const currentPage = pageNames[location.pathname] || "Dashboard";

  /* =========================================================
     ADMIN INITIAL
  ========================================================= */

  const initials = useMemo(() => {
    if (!adminEmail) {
      return "A";
    }

    return adminEmail.split("@")[0].slice(0, 1).toUpperCase();
  }, [adminEmail]);

  /* =========================================================
     ACCOUNT MENU
  ========================================================= */

  const accountMenu = [
    {
      key: "profile",
      label: (
        <div
          style={{
            minWidth: 210,
            padding: "6px 2px",
          }}
        >
          <div
            style={{
              marginBottom: 5,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: token.colorTextTertiary,
            }}
          >
            SIGNED IN AS
          </div>

          <div
            style={{
              color: token.colorText,
              fontSize: 13,
              fontWeight: 600,
              wordBreak: "break-word",
            }}
          >
            {adminEmail || "Admin"}
          </div>
        </div>
      ),
      disabled: true,
    },

    {
      type: "divider" as const,
    },

    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },

    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log out",
      danger: true,
      onClick: signout,
    },
  ];

  /* =========================================================
     SIDEBAR
     
     Important:
     - Sidebar = fixed
     - Bottom admin area = absolute
     - Navigation = scrollable
  ========================================================= */

  const sidebarContent = (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: token.colorBgContainer,
      }}
    >
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div
        style={{
          height: 76,
          minHeight: 76,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: collapsed ? 0 : 12,
          padding: collapsed ? "0 12px" : "0 20px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
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
            color: "#ffffff",
            fontSize: 17,
            boxShadow: "0 8px 22px rgba(22,119,255,0.22)",
          }}
        >
          <TrophyOutlined />
        </div>

        {!collapsed && (
          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: token.colorText,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Competition
            </div>

            <div
              style={{
                marginTop: 4,
                color: token.colorTextTertiary,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              MANAGER
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          WORKSPACE LABEL
      ===================================================== */}

      {!collapsed && (
        <div
          style={{
            flexShrink: 0,
            padding: "22px 20px 10px",
            color: token.colorTextTertiary,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.14em",
          }}
        >
          WORKSPACE
        </div>
      )}

      {/* =====================================================
          SCROLLABLE MENU AREA
          
          Only this part scrolls.
          Bottom admin section never moves.
      ===================================================== */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",

          /*
            Space reserved for the fixed bottom
            admin section so menu items never hide
            underneath it.
          */
          paddingBottom: collapsed ? 82 : 96,

          scrollbarWidth: "thin",
        }}
      >
        <Menu
          mode="inline"
          theme={darkMode ? "dark" : "light"}
          selectedKeys={[location.pathname]}
          items={navigationItems}
          onClick={() => {
            if (isMobile) {
              setMobileSidebarOpen(false);
            }
          }}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            padding: collapsed ? "0 8px" : "0 10px",
          }}
        />
      </div>

      {/* =====================================================
          FIXED BOTTOM ADMIN AREA
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,

          zIndex: 5,

          padding: collapsed ? "12px 10px" : "14px",

          background: token.colorBgContainer,

          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={signout}
            title="Log out"
            style={{
              width: "100%",
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: 10,
              background: token.colorFillQuaternary,
              color: token.colorTextSecondary,
              cursor: "pointer",
            }}
          >
            <LogoutOutlined />
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 10,
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorFillQuaternary,
            }}
          >
            <Avatar
              size={34}
              style={{
                flexShrink: 0,
                background: "linear-gradient(135deg,#1677ff,#722ed1)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  color: token.colorText,
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                Administrator
              </div>

              <div
                style={{
                  marginTop: 5,
                  color: token.colorTextTertiary,
                  fontSize: 9,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {adminEmail || "Admin account"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* =========================================================
     DESKTOP + MOBILE LAYOUT
  ========================================================= */

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: token.colorBgLayout,
      }}
    >
      {/* =====================================================
          DESKTOP FIXED SIDEBAR
      ===================================================== */}

      {!isMobile && (
        <Sider
          width={245}
          collapsedWidth={80}
          collapsed={collapsed}
          trigger={null}
          theme={darkMode ? "dark" : "light"}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,

            width: collapsed ? 80 : 245,

            height: "100vh",
            maxHeight: "100vh",

            zIndex: 1000,

            overflow: "hidden",

            background: token.colorBgContainer,

            borderRight: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {sidebarContent}
        </Sider>
      )}

      {/* =====================================================
          MOBILE DRAWER SIDEBAR
      ===================================================== */}

      {isMobile && (
        <Drawer
          placement="left"
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          width={245}
          closable={false}
          styles={{
            content: {
              padding: 0,
              background: token.colorBgContainer,
            },

            body: {
              padding: 0,
              height: "100%",
              overflow: "hidden",
            },
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            {sidebarContent}
          </div>
        </Drawer>
      )}

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <Layout
        style={{
          minWidth: 0,
          minHeight: "100vh",
          background: token.colorBgLayout,

          /*
            Desktop:
            leave space for fixed sidebar.

            Mobile:
            full width.
          */
          marginLeft: isMobile ? 0 : collapsed ? 80 : 245,

          transition: "margin-left 0.2s ease",
        }}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <Header
          style={{
            height: 76,
            padding: isMobile ? "0 14px" : "0 24px",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            background: token.colorBgContainer,

            borderBottom: `1px solid ${token.colorBorderSecondary}`,

            position: "sticky",
            top: 0,

            zIndex: 500,

            boxShadow: darkMode ? "none" : "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          {/* =================================================
              HEADER LEFT
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              minWidth: 0,
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (isMobile) {
                  setMobileSidebarOpen((prev) => !prev);
                } else {
                  setCollapsed((prev) => !prev);
                }
              }}
              aria-label={isMobile ? "Open menu" : "Collapse sidebar"}
              style={{
                width: 38,
                height: 38,
                flexShrink: 0,
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
              <MenuOutlined />
            </button>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  marginBottom: 5,
                  color: token.colorTextTertiary,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  lineHeight: 1,
                }}
              >
                ADMIN WORKSPACE
              </div>

              <div
                style={{
                  color: token.colorText,
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentPage}
              </div>
            </div>
          </div>

          {/* =================================================
              HEADER RIGHT
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* THEME */}

            <button
              type="button"
              onClick={toggleTheme}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              style={{
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorFillQuaternary,
                color: token.colorTextSecondary,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              {darkMode ? <SunOutlined /> : <MoonOutlined />}
            </button>

            {/* NOTIFICATION */}

            <button
              type="button"
              aria-label="Notifications"
              style={{
                position: "relative",
                width: 38,
                height: 38,
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
              <BellOutlined />

              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: token.colorPrimary,
                  border: `2px solid ${token.colorBgContainer}`,
                }}
              />
            </button>

            {/* DIVIDER */}

            <div
              style={{
                width: 1,
                height: 27,
                margin: "0 3px",
                background: token.colorBorderSecondary,
              }}
            />

            {/* PROFILE */}

            <Dropdown
              menu={{
                items: accountMenu,
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div
                style={{
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 9px 4px 4px",
                  borderRadius: 11,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: token.colorFillQuaternary,
                  cursor: "pointer",
                }}
              >
                <Avatar
                  size={32}
                  style={{
                    background: "linear-gradient(135deg,#1677ff,#722ed1)",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {initials}
                </Avatar>

                {!isMobile && !collapsed && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: token.colorText,
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      Admin
                    </span>

                    <span
                      style={{
                        marginTop: 4,
                        color: token.colorTextSecondary,
                        fontSize: 9,
                        lineHeight: 1,
                      }}
                    >
                      Administrator
                    </span>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <Content
          style={{
            minHeight: "calc(100vh - 72px)",
            padding: isMobile ? "18px 14px 24px" : "28px",
            background: token.colorBgLayout,
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1400,
              margin: "0 auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Mainlayout;
