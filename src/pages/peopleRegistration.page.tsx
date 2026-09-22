import {
  Button,
  Flex,
  Input,
  Spin,
  Typography,
  message,
  theme,
} from "antd";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRecoilState } from "recoil";
import { FStore } from "../common/config/router/firebase.config";
import {
  AtomAllPeople,
  AtomFilterUser,
} from "../store/atom.store";
import type {
  PeopleErrorDTO,
  UserDTO,
} from "../types/input.types";

interface Props {
  data?: UserDTO;
  setData?: (data: UserDTO[]) => void;
  setIsModalOpen?: (open: boolean) => void;
  disable?: boolean;
}

const IMAGE_TYPES = new Set([
  "image/apng",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/webp",
]);

const People = ({ data, setData, setIsModalOpen }: Props) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [tableData, setTableData] = useRecoilState(AtomAllPeople);
  const [, setFilteredUsers] = useRecoilState(AtomFilterUser);
  const [fields, setFields] = useState<UserDTO>(data ?? ({} as UserDTO));
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState<PeopleErrorDTO>({});
  const [userProfile, setUserProfile] = useState<File | undefined>();

  const isEditMode = Boolean(data?.id);

  useEffect(() => {
    setFields(data ?? ({} as UserDTO));
    setErrors({});
    setUserProfile(undefined);
  }, [data]);

  const updateField = (name: keyof UserDTO, value: string) => {
    setFields((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: validateField(name, value),
    }));
  };

  const validateField = (
    name: keyof UserDTO,
    value: string
  ): string => {
    switch (name) {
      case "uname":
        return value.trim() ? "" : "Enter Username";
      case "email":
        if (!value.trim()) return "Enter Email";
        return /^\S+@(gmail\.com|gmail\.in)$/.test(value.trim())
          ? ""
          : "Enter Valid Email";
      case "contact":
        if (!value.trim()) return "Enter Phone Number";
        return /^\d{10}$/.test(value.trim())
          ? ""
          : "Enter Valid Phone Number";
      case "address":
        return value.trim() ? "" : "Enter Address";
      default:
        return "";
    }
  };

  const handleProfile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUserProfile(file);

    if (!IMAGE_TYPES.has(file.type) || file.size < 1048) {
      setErrors((previous) => ({
        ...previous,
        profile: "Select a valid image larger than 1 KB.",
      }));
      return;
    }

    setErrors((previous) => ({
      ...previous,
      profile: "",
    }));

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result?.toString();

      if (base64) {
        setFields((previous) => ({
          ...previous,
          profile: base64,
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const validateForm = (includeProfile: boolean) => {
    const nextErrors: PeopleErrorDTO = {
      uname: validateField("uname", fields.uname ?? ""),
      email: validateField("email", fields.email ?? ""),
      contact: validateField("contact", fields.contact ?? ""),
      address: validateField("address", fields.address ?? ""),
      profile: includeProfile && !userProfile ? "Select Profile Photo" : "",
    };

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm(true)) return;

    try {
      setLoader(true);
      await addDoc(collection(FStore, "PEOPLE"), fields);

      setFields({} as UserDTO);
      setErrors({});

      message.success("Participant added successfully.");
      navigate("/allparticipants");
    } catch (error) {
      console.error("Failed to add participant:", error);
      message.error("Unable to add participant.");
    } finally {
      setLoader(false);
    }
  };

  const handleUpdate = async () => {
    if (!data?.id) return;
    if (!validateForm(false)) return;

    try {
      setLoader(true);

      const participantRef = doc(FStore, "PEOPLE", data.id);
      await updateDoc(participantRef, fields as Record<string, unknown>);

      const nextTableData = tableData.map((person) =>
        person.id === data.id ? fields : person
      );

      setTableData(nextTableData);
      setFilteredUsers(nextTableData);
      setData?.(nextTableData);
      setIsModalOpen?.(false);

      message.success("Participant updated successfully.");
    } catch (error) {
      console.error("Failed to update participant:", error);
      message.error("Unable to update participant.");
    } finally {
      setLoader(false);
    }
  };

  const formField = (
    label: string,
    input: ReactNode,
    error?: string
  ) => (
    <div
      style={{
        minWidth: 0,
      }}
    >
      <Typography.Text
        strong
        style={{
          display: "block",
          marginBottom: 7,
          color: token.colorText,
          fontSize: 12,
        }}
      >
        {label}
      </Typography.Text>

      {input}

      {error && (
        <Typography.Text
          type="danger"
          style={{
            display: "block",
            marginTop: 5,
            fontSize: 11,
          }}
        >
          {error}
        </Typography.Text>
      )}
    </div>
  );

  return (
    <Spin spinning={loader}>
      <div
        style={{
          width: "100%",
          minWidth: 0,
          padding: 4,
        }}
      >
        <div
          style={{
            marginBottom: 22,
          }}
        >
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              color: token.colorText,
            }}
          >
            {isEditMode ? "Edit participant" : "Register participant"}
          </Typography.Title>

          <Typography.Text type="secondary">
            {isEditMode
              ? "Update the participant details below."
              : "Add a participant to the competition."}
          </Typography.Text>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {formField(
            "Name",
            <Input
              value={fields.uname ?? ""}
              placeholder="Enter participant name"
              onChange={(event) =>
                updateField("uname", event.target.value)
              }
            />,
            errors.uname
          )}

          {formField(
            "Email",
            <Input
              type="email"
              value={fields.email ?? ""}
              disabled={isEditMode}
              placeholder="Enter Gmail address"
              onChange={(event) =>
                updateField("email", event.target.value)
              }
            />,
            errors.email
          )}

          {formField(
            "Phone Number",
            <Input
              inputMode="numeric"
              value={fields.contact ?? ""}
              maxLength={10}
              placeholder="10 digit phone number"
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                updateField("contact", value);
              }}
            />,
            errors.contact
          )}

          {formField(
            "Address",
            <Input
              value={fields.address ?? ""}
              placeholder="Enter address"
              onChange={(event) =>
                updateField("address", event.target.value)
              }
            />,
            errors.address
          )}
        </div>

        <div style={{ marginTop: 18 }}>
          {formField(
            "Photo",
            <Input
              type="file"
              accept="image/*"
              onChange={handleProfile}
            />,
            errors.profile
          )}
        </div>

        {fields.profile && (
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              background: token.colorFillQuaternary,
            }}
          >
            <img
              src={fields.profile}
              alt="Participant preview"
              style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                borderRadius: token.borderRadiusSM,
              }}
            />

            <div>
              <Typography.Text strong>
                Profile preview
              </Typography.Text>
              <div>
                <Typography.Text type="secondary">
                  {userProfile?.name || "Current profile image"}
                </Typography.Text>
              </div>
            </div>
          </div>
        )}

        <Flex
          wrap="wrap"
          gap={10}
          style={{
            marginTop: 26,
          }}
        >
          {isEditMode ? (
            <>
              <Button type="primary" onClick={handleUpdate}>
                Update participant
              </Button>

              <Button
                onClick={() => setIsModalOpen?.(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={handleSubmit}>
                Add participant
              </Button>

              <Button
                onClick={() => navigate("/allparticipants")}
              >
                Back to participants
              </Button>
            </>
          )}
        </Flex>
      </div>
    </Spin>
  );
};

export default People;
