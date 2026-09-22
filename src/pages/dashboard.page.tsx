import { Grid, Typography, theme } from "antd";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  ArrowRightOutlined,
  FileTextOutlined,
  FormOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

const Dashboard = () => {
  const { token } = theme.useToken();
  const screens = useBreakpoint();

  const isMobile = !screens.md;
  const isTablet = !screens.xl;

  const stats = [
    {
      title: "Competitions",
      description: "Manage competition events",
      icon: <TrophyOutlined />,
      color: token.colorPrimary,
      background: token.colorPrimaryBg,
    },
    {
      title: "Participants",
      description: "Manage registered participants",
      icon: <TeamOutlined />,
      color: token.colorInfo,
      background: token.colorInfoBg,
    },
    {
      title: "Rounds",
      description: "Control competition rounds",
      icon: <AppstoreOutlined />,
      color: token.colorWarning,
      background: token.colorWarningBg,
    },
    {
      title: "Feedback",
      description: "Review participant evaluations",
      icon: <FormOutlined />,
      color: token.colorSuccess,
      background: token.colorSuccessBg,
    },
  ];

  const quickActions = [
    {
      title: "Register Participant",
      description: "Add a new participant to the competition.",
      icon: <UserAddOutlined />,
      path: "/participantregistration",
      color: token.colorPrimary,
      background: token.colorPrimaryBg,
    },
    {
      title: "View Participants",
      description: "Browse and manage all registered participants.",
      icon: <TeamOutlined />,
      path: "/allparticipants",
      color: token.colorInfo,
      background: token.colorInfoBg,
    },
    {
      title: "Manage Competition",
      description: "Configure and manage the competition workflow.",
      icon: <TrophyOutlined />,
      path: "/competition",
      color: token.colorWarning,
      background: token.colorWarningBg,
    },
    {
      title: "Review Feedback",
      description: "Access feedback collected from participants.",
      icon: <FormOutlined />,
      path: "/feedback",
      color: token.colorSuccess,
      background: token.colorSuccessBg,
    },
  ];

  const workflow = [
    {
      number: "01",
      title: "Participants",
      text: "Register participants",
      icon: <TeamOutlined />,
      color: token.colorPrimary,
      background: token.colorPrimaryBg,
    },
    {
      number: "02",
      title: "Competition",
      text: "Organize the event",
      icon: <TrophyOutlined />,
      color: token.colorInfo,
      background: token.colorInfoBg,
    },
    {
      number: "03",
      title: "Rounds",
      text: "Manage active rounds",
      icon: <AppstoreOutlined />,
      color: token.colorWarning,
      background: token.colorWarningBg,
    },
    {
      number: "04",
      title: "Feedback",
      text: "Review evaluations",
      icon: <FormOutlined />,
      color: token.colorSuccess,
      background: token.colorSuccessBg,
    },
  ];

  const panelStyle = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
  };

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      {/* Page heading */}
      <section
        style={{
          ...panelStyle,
          padding: isMobile ? 18 : 24,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <Typography.Text
              style={{
                display: "block",
                marginBottom: 8,
                color: token.colorPrimary,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              OVERVIEW
            </Typography.Text>

            <Typography.Title
              level={2}
              style={{
                margin: 0,
                color: token.colorText,
                fontSize: isMobile ? 28 : 38,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              Competition workspace
            </Typography.Title>

            <Typography.Paragraph
              type="secondary"
              style={{
                maxWidth: 690,
                margin: "10px 0 0",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Manage participants, competitions, rounds and feedback from one
              centralized workspace.
            </Typography.Paragraph>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              alignSelf: isMobile ? "flex-start" : "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 10,
              border: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorFillQuaternary,
              color: token.colorTextSecondary,
              fontSize: 11,
              whiteSpace: "nowrap",
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
            System ready
          </div>
        </div>
      </section>

      {/* Overview cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.title}
            style={{
              ...panelStyle,
              minWidth: 0,
              padding: isMobile ? 14 : 18,
            }}
          >
            <div
              style={{
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                background: stat.background,
                color: stat.color,
                fontSize: 16,
              }}
            >
              {stat.icon}
            </div>

            <Typography.Text
              strong
              style={{
                display: "block",
                marginTop: 14,
                color: token.colorText,
                fontSize: 13,
              }}
            >
              {stat.title}
            </Typography.Text>

            <Typography.Text
              type="secondary"
              style={{
                display: "block",
                marginTop: 5,
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              {stat.description}
            </Typography.Text>
          </div>
        ))}
      </section>

      {/* Quick actions + workflow */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: isTablet
            ? "1fr"
            : "minmax(0, 1.15fr) minmax(0, 0.85fr)",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        {/* Quick actions */}
        <div
          style={{
            ...panelStyle,
            minWidth: 0,
            padding: isMobile ? 16 : 22,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Typography.Text
                strong
                style={{
                  display: "block",
                  color: token.colorText,
                  fontSize: 16,
                }}
              >
                Quick actions
              </Typography.Text>

              <Typography.Text
                type="secondary"
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: 11,
                }}
              >
                Jump directly into your workflow
              </Typography.Text>
            </div>

            {!isMobile && (
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}
              >
                04 ACTIONS
              </Typography.Text>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {quickActions.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                style={{
                  minWidth: 0,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    minHeight: isMobile ? 145 : 168,
                    display: "flex",
                    flexDirection: "column",
                    padding: isMobile ? 15 : 17,
                    borderRadius: 14,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorFillQuaternary,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
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
                      marginTop: 14,
                      color: token.colorText,
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </Typography.Text>

                  <Typography.Text
                    type="secondary"
                    style={{
                      display: "block",
                      marginTop: 6,
                      fontSize: 11,
                      lineHeight: 1.55,
                    }}
                  >
                    {item.description}
                  </Typography.Text>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: "auto",
                      paddingTop: 14,
                      color: item.color,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Open
                    <ArrowRightOutlined />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div
          style={{
            ...panelStyle,
            minWidth: 0,
            padding: isMobile ? 16 : 22,
          }}
        >
          <Typography.Text
            strong
            style={{
              display: "block",
              color: token.colorText,
              fontSize: 16,
            }}
          >
            Competition workflow
          </Typography.Text>

          <Typography.Text
            type="secondary"
            style={{
              display: "block",
              marginTop: 4,
              fontSize: 11,
            }}
          >
            Follow the competition lifecycle
          </Typography.Text>

          <div
            style={{
              display: "grid",
              gap: 0,
              marginTop: 14,
            }}
          >
            {workflow.map((item, index) => (
              <div
                key={item.number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  minWidth: 0,
                  padding: "12px 0",
                  borderBottom:
                    index === workflow.length - 1
                      ? "none"
                      : `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9,
                    background: item.background,
                    color: item.color,
                    fontSize: 13,
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography.Text
                    strong
                    style={{
                      display: "block",
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
                      marginTop: 2,
                      fontSize: 10,
                    }}
                  >
                    {item.text}
                  </Typography.Text>
                </div>

                <Typography.Text
                  type="secondary"
                  style={{
                    flexShrink: 0,
                    fontFamily: "monospace",
                    fontSize: 9,
                  }}
                >
                  {item.number}
                </Typography.Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting information */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 18,
          marginTop: 18,
        }}
      >
        {[
          {
            title: "Participant presentations",
            description:
              "Manage participant presentation submissions as part of the competition workflow.",
            icon: <FileTextOutlined />,
            color: token.colorSuccess,
          },
          {
            title: "Evaluation & feedback",
            description:
              "Review feedback and evaluation data from the competition process.",
            icon: <FormOutlined />,
            color: token.colorPrimary,
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              ...panelStyle,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: token.colorText,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
              {item.title}
            </div>

            <Typography.Paragraph
              type="secondary"
              style={{
                margin: "8px 0 0",
                fontSize: 11,
                lineHeight: 1.7,
              }}
            >
              {item.description}
            </Typography.Paragraph>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
