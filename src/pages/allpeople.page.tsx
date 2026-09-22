import {
  Button,
  Flex,
  Image,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Table,
  Typography,
  message,
  theme,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { FStore } from "../common/config/router/firebase.config";
import { AtomAllPeople, AtomFilterUser } from "../store/atom.store";
import { UserDTO } from "../types/input.types";
import People from "./peopleRegistration.page";

const AllPeople = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UserDTO | null>(null);
  const [tableData, setTableData] = useRecoilState(AtomAllPeople);
  const [filteredUsers, setFilteredUsers] = useRecoilState(AtomFilterUser);

  useEffect(() => {
    setLoader(true);

    const unsubscribe = onSnapshot(
      collection(FStore, "PEOPLE"),
      (snapshot) => {
        const users: UserDTO[] = snapshot.docs.map((item) => ({
          ...(item.data() as UserDTO),
          id: item.id,
        }));

        setTableData(users);
        setFilteredUsers(users);
        setLoader(false);
      },
      (error) => {
        console.error("Failed to load participants:", error);
        setLoader(false);
        message.error("Unable to load participants.");
      },
    );

    return unsubscribe;
  }, [setFilteredUsers, setTableData]);

  const openEditModal = (user: UserDTO) => {
    setSelectedRow(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: UserDTO) => {
    if (!user.id) return;

    try {
      setLoader(true);
      await deleteDoc(doc(FStore, "PEOPLE", user.id));
      message.success("Participant deleted successfully.");
    } catch (error) {
      console.error("Failed to delete participant:", error);
      message.error("Unable to delete participant.");
    } finally {
      setLoader(false);
    }
  };

  const handleSearchChange = (value: string) => {
    const search = value.trim().toLowerCase();

    if (!search) {
      setFilteredUsers(tableData);
      return;
    }

    const filtered = tableData.filter((user) =>
      Object.values(user).some((field) =>
        String(field ?? "")
          .toLowerCase()
          .includes(search),
      ),
    );

    setFilteredUsers(filtered);
  };

  const columns = useMemo<ColumnsType<UserDTO>>(
    () => [
      {
        title: "Profile",
        dataIndex: "profile",
        width: 80,
        render: (profile: string) =>
          profile ? (
            <Image
              src={profile}
              alt="Participant"
              width={44}
              height={44}
              preview
              style={{
                objectFit: "cover",
                borderRadius: token.borderRadiusSM,
              }}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: token.borderRadiusSM,
                background: token.colorFillSecondary,
                color: token.colorTextTertiary,
              }}
            >
              <TeamOutlined />
            </div>
          ),
      },
      {
        title: "Username",
        dataIndex: "uname",
        sorter: (a, b) =>
          String(a.uname ?? "").localeCompare(String(b.uname ?? "")),
        ellipsis: true,
        width: 170,
      },
      {
        title: "Email",
        dataIndex: "email",
        sorter: (a, b) =>
          String(a.email ?? "").localeCompare(String(b.email ?? "")),
        ellipsis: true,
        width: 230,
      },
      {
        title: "Phone Number",
        dataIndex: "contact",
        sorter: (a, b) =>
          String(a.contact ?? "").localeCompare(String(b.contact ?? "")),
        width: 150,
      },
      {
        title: "Address",
        dataIndex: "address",
        sorter: (a, b) =>
          String(a.address ?? "").localeCompare(String(b.address ?? "")),
        ellipsis: true,
        width: 240,
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 120,
        render: (_, user) => (
          <Flex gap={6}>
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={`Edit ${user.uname ?? "participant"}`}
              onClick={() => openEditModal(user)}
            />

            <Popconfirm
              title="Delete participant?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(user)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                aria-label={`Delete ${user.uname ?? "participant"}`}
              />
            </Popconfirm>
          </Flex>
        ),
      },
    ],
    [setFilteredUsers, tableData, token],
  );

  return (
    <Spin spinning={loader}>
      <div style={{ width: "100%", minWidth: 0 }}>
        <Flex
          wrap="wrap"
          justify="space-between"
          align="center"
          gap={12}
          style={{ marginBottom: 18 }}
        >
          <div style={{ minWidth: 0 }}>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                color: token.colorText,
              }}
            >
              All Participants
            </Typography.Title>
            <Typography.Text type="secondary">
              View, search, edit and remove registered participants.
            </Typography.Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/participantregistration")}
          >
            Add participant
          </Button>
        </Flex>

        <div
          style={{
            padding: 16,
            marginBottom: 18,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            background: token.colorBgContainer,
          }}
        >
          <Input.Search
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search by name, email, phone or address"
            onChange={(event) => handleSearchChange(event.target.value)}
            style={{ width: "100%", maxWidth: 520 }}
          />
        </div>

        <div
          style={{
            width: "100%",
            overflow: "hidden",
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            background: token.colorBgContainer,
          }}
        >
          <Table<UserDTO>
            rowKey="id"
            dataSource={filteredUsers}
            columns={columns}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              responsive: true,
            }}
            scroll={{ x: 1050 }}
            size="middle"
          />
        </div>

        <Modal
          title="Edit participant"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedRow(null);
          }}
          footer={null}
          width={640}
          centered
          destroyOnHidden
        >
          {selectedRow && (
            <People
              data={selectedRow}
              setData={setTableData}
              setIsModalOpen={setIsModalOpen}
              disable
            />
          )}
        </Modal>
      </div>
    </Spin>
  );
};

export default AllPeople;
