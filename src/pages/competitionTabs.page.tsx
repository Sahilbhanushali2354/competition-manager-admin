import {
  Button,
  Flex,
  Grid,
  Spin,
  Tabs,
  Typography,
  message,
  theme,
} from "antd";
import {
  CheckCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { FStore } from "../common/config/router/firebase.config";
import {
  ActiveParticipantATOM,
  ActiveRoundAtom,
  AllCompetitionAtom,
  SelectedCompetitionAtom,
  SelectedRoundAtom,
} from "../store/atom.store";
import type {
  CompetitionDTO,
  RoundsDataDTO,
} from "../types/input.types";
import Participants from "../components/participants.component";
import Rules from "../components/rules.component";
import LeaderBoard from "../components/leaderboard.component";
import PresentationDetail from "../components/Presentations.component";

const { useBreakpoint } = Grid;

const CompetitionTabs = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = theme.useToken();
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const [loader, setLoader] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useRecoilState<CompetitionDTO>(SelectedCompetitionAtom);
  const allCompetitionData = useRecoilValue(AllCompetitionAtom);
  const [activeRound, setActiveRound] = useRecoilState(ActiveRoundAtom);
  const [selectedRound, setSelectedRound] = useRecoilState(SelectedRoundAtom);
  const activeParticipant = useRecoilValue(ActiveParticipantATOM);

  const competition = useMemo(
    () => allCompetitionData.find((item) => item.id === id),
    [allCompetitionData, id]
  );

  useEffect(() => {
    if (!id) {
      navigate("/competition", { replace: true });
      return;
    }

    if (!allCompetitionData.length) return;

    if (!competition) {
      navigate("/competition", { replace: true });
      return;
    }

    const unsubscribe = onSnapshot(
      doc(FStore, "DEFAULT", id),
      (snapshot) => {
        const activeRoundData = snapshot.data()?.activeRound as
          | RoundsDataDTO
          | undefined;

        const matchingRound = competition.rounds?.find(
          (round) => round.id === activeRoundData?.id
        );

        setActiveRound(activeRoundData ?? ({} as RoundsDataDTO));
        setSelectedRound(
          matchingRound?.id ?? competition.rounds?.[0]?.id ?? ""
        );
      },
      (error) => {
        console.error("Failed to load competition state:", error);
        message.error("Unable to load competition state.");
      }
    );

    return unsubscribe;
  }, [allCompetitionData.length, competition, id, navigate, setActiveRound, setSelectedRound]);

  const rounds = selectedCompetition.rounds ?? competition?.rounds ?? [];

  const nestedTabs = [
    {
      key: "participants",
      label: "Participants",
      children: <Participants />,
    },
    {
      key: "rules",
      label: "Rules",
      children: <Rules />,
    },
    {
      key: "leaderboard",
      label: "Leaderboard",
      children: <LeaderBoard />,
    },
    {
      key: "presentations",
      label: "Presentations",
      children: <PresentationDetail />,
    },
  ];

  const addRound = async () => {
    if (!selectedCompetition.id && !competition?.id) {
      message.error("No competition selected.");
      return;
    }

    try {
      setLoader(true);

      const currentRounds = [...rounds];
      const lastRoundLabel = currentRounds.at(-1)?.label;
      const match = lastRoundLabel?.match(/(\d+)$/);
      const nextNumber = match ? Number(match[1]) + 1 : currentRounds.length + 1;

      const newRound: RoundsDataDTO = {
        id: crypto.randomUUID(),
        label: `Round ${nextNumber}`,
      };

      const nextCompetition: CompetitionDTO = {
        ...(selectedCompetition.id
          ? selectedCompetition
          : (competition as CompetitionDTO)),
        rounds: [...currentRounds, newRound],
      };

      setSelectedCompetition(nextCompetition);

      await updateDoc(
        doc(FStore, "COMPETITION", nextCompetition.id as string),
        { rounds: nextCompetition.rounds }
      );

      setSelectedRound(newRound.id);
      message.success(`${newRound.label} added successfully.`);
    } catch (error) {
      console.error("Failed to add round:", error);
      message.error("Unable to add round.");
    } finally {
      setLoader(false);
    }
  };

  const makeRoundActive = async (roundId: string) => {
    if (!id || !roundId) return;

    const round = rounds.find((item) => item.id === roundId);

    if (!round) {
      message.error("Selected round could not be found.");
      return;
    }

    try {
      setLoader(true);

      await setDoc(
        doc(FStore, "DEFAULT", id),
        {
          activeRound: {
            label: round.label,
            id: round.id,
          },
          selectedCompetition:
            selectedCompetition.id
              ? selectedCompetition
              : competition,
        },
        { merge: true }
      );

      setActiveRound(round);
      message.success(`${round.label} activated successfully.`);
    } catch (error) {
      console.error("Failed to activate round:", error);
      message.error("Unable to activate round.");
    } finally {
      setLoader(false);
    }
  };

  const deactivateRound = async () => {
    if (!id) return;

    if (activeParticipant.uname?.length) {
      message.error(
        "You can't deactivate the round while a participant is selected."
      );
      return;
    }

    try {
      setLoader(true);

      await setDoc(
        doc(FStore, "DEFAULT", id),
        { activeRound: null },
        { merge: true }
      );

      setActiveRound({} as RoundsDataDTO);
      message.success("Round deactivated successfully.");
    } catch (error) {
      console.error("Failed to deactivate round:", error);
      message.error("Unable to deactivate round.");
    } finally {
      setLoader(false);
    }
  };

  if (!competition && allCompetitionData.length) {
    return null;
  }

  return (
    <Spin spinning={loader}>
      <div style={{ width: "100%", minWidth: 0 }}>
        <Flex
          vertical={isMobile}
          align={isMobile ? "stretch" : "center"}
          justify="space-between"
          gap={12}
          style={{ marginBottom: 18 }}
        >
          <div style={{ minWidth: 0 }}>
            <Typography.Title
              level={3}
              style={{ margin: 0, color: token.colorText }}
            >
              Competition
            </Typography.Title>
            <Typography.Text type="secondary">
              Manage rounds, participants, rules, leaderboard and presentations.
            </Typography.Text>
          </div>

          <Flex wrap="wrap" gap={8} justify={isMobile ? "start" : "end"}>
            {activeRound.id !== selectedRound ? (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => makeRoundActive(selectedRound)}
                disabled={!selectedRound}
              >
                Make round active
              </Button>
            ) : activeRound.id ? (
              <Button onClick={deactivateRound}>
                Deactivate {activeRound.label}
              </Button>
            ) : null}

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addRound}
            >
              Add round
            </Button>
          </Flex>
        </Flex>

        {rounds.length > 0 ? (
          <div
            style={{
              width: "100%",
              minWidth: 0,
              padding: isMobile ? 12 : 18,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorBgContainer,
            }}
          >
            <Tabs
              activeKey={selectedRound || rounds[0]?.id}
              onChange={setSelectedRound}
              items={rounds.map((round) => ({
                key: round.id,
                label: round.label,
                children: (
                  <Tabs
                    items={nestedTabs}
                    tabBarGutter={isMobile ? 14 : 28}
                    size={isMobile ? "small" : "middle"}
                  />
                ),
              }))}
              tabBarGutter={isMobile ? 14 : 24}
            />
          </div>
        ) : (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              background: token.colorBgContainer,
            }}
          >
            <Typography.Text type="secondary">
              No rounds have been added yet. Create the first round to begin.
            </Typography.Text>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default CompetitionTabs;
