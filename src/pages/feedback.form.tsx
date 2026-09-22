import {
  Button,
  Flex,
  Input,
  Spin,
  Typography,
  message,
  theme,
} from "antd";
import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { FStore } from "../common/config/router/firebase.config";
import { JsonData } from "../formData";
import type { FieldValueDTO, OptionDTO } from "../types/input.types";

const Feedback = () => {
  const { token } = theme.useToken();
  const [loader, setLoader] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

  const formSections = Object.entries(JsonData.formData) as [
    string,
    FieldValueDTO
  ][];

  const getFieldKey = (section: string, optionId: string | number) =>
    `${section}_${optionId}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, id, value } = event.target;
    const fieldKey = getFieldKey(name, id);
    const section = JsonData.formData[name];
    const option = section?.Options?.find(
      (item: OptionDTO) => String(item.id) === String(id)
    );

    setFields((previous) => ({
      ...previous,
      [fieldKey]: value,
    }));

    if (!option) return;

    const numericValue = Number(value);
    const valid = value !== "" && Number.isFinite(numericValue) && numericValue >= 1 && numericValue <= 100;

    setErrorMessage((previous) => {
      const next = { ...previous };

      if (valid) {
        delete next[fieldKey];
      } else {
        next[fieldKey] = "Enter a score from 1 to 100";
      }

      return next;
    });

    if (valid) option.point = numericValue;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    formSections.forEach(([sectionName, section]) => {
      section.Options.forEach((option) => {
        const fieldKey = getFieldKey(sectionName, option.id);
        const value = fields[fieldKey];
        const numericValue = Number(value);

        if (
          !value ||
          !Number.isFinite(numericValue) ||
          numericValue < 1 ||
          numericValue > 100
        ) {
          errors[fieldKey] = "Enter a score from 1 to 100";
        }
      });
    });

    setErrorMessage(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error("Please enter a valid score for every option.");
      return;
    }

    try {
      setLoader(true);

      const feedbackData = {
        formData: JsonData.formData,
      };

      const querySnapshot = await getDocs(
        collection(FStore, "FEEDBACK")
      );

      if (!querySnapshot.empty) {
        const documentId = querySnapshot.docs[0].id;

        await setDoc(
          doc(FStore, "FEEDBACK", documentId),
          { feedbackData },
          { merge: true }
        );

        await setDoc(
          doc(FStore, "DEFAULT", "7TAUwqn8Ha9UVWwvrMKb"),
          { activeForm: feedbackData },
          { merge: true }
        );

        message.success("Form updated successfully.");
      } else {
        await addDoc(
          collection(FStore, "FEEDBACK"),
          feedbackData
        );

        message.success("Form added successfully.");
      }
    } catch (error) {
      console.error("Failed to save feedback form:", error);
      message.error("Unable to save the feedback form.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <Spin spinning={loader}>
      <div style={{ width: "100%", minWidth: 0 }}>
        {/* Header */}
        <Flex
          wrap="wrap"
          align="center"
          justify="space-between"
          gap={12}
          style={{ marginBottom: 20 }}
        >
          <div style={{ minWidth: 0 }}>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                color: token.colorText,
              }}
            >
              Feedback Form
            </Typography.Title>

            <Typography.Text type="secondary">
              Configure scoring criteria and activate the form used during evaluations.
            </Typography.Text>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
          >
            Make this form active
          </Button>
        </Flex>

        {/* Sections */}
        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          {formSections.map(([sectionName, section], sectionIndex) => (
            <section
              key={sectionName}
              style={{
                padding: 20,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
              }}
            >
              <Flex
                align="flex-start"
                gap={12}
                style={{ marginBottom: 16 }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    background: token.colorPrimaryBg,
                    color: token.colorPrimary,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {String(sectionIndex + 1).padStart(2, "0")}
                </div>

                <div style={{ minWidth: 0 }}>
                  <Typography.Text
                    strong
                    style={{
                      color: token.colorText,
                      fontSize: 14,
                    }}
                  >
                    {sectionName}
                  </Typography.Text>

                  <Typography.Paragraph
                    type="secondary"
                    style={{
                      margin: "5px 0 0",
                      fontSize: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    {section.Description}
                  </Typography.Paragraph>
                </div>
              </Flex>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >
                {section.Options.map((option) => {
                  const fieldKey = getFieldKey(
                    sectionName,
                    option.id
                  );

                  return (
                    <div
                      key={String(option.id)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 110px",
                        alignItems: "center",
                        gap: 12,
                        padding: "8px 0",
                        borderTop:
                          `1px solid ${token.colorBorderSecondary}`,
                      }}
                    >
                      <Typography.Text
                        style={{
                          color: token.colorText,
                          fontSize: 12,
                          lineHeight: 1.5,
                        }}
                      >
                        {option.value}
                      </Typography.Text>

                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={100}
                        value={fields[fieldKey] ?? ""}
                        placeholder="1 - 100"
                        status={
                          errorMessage[fieldKey]
                            ? "error"
                            : undefined
                        }
                        aria-label={`Score for ${option.value}`}
                        name={sectionName}
                        id={String(option.id)}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom action */}
        <Flex
          justify="center"
          style={{ marginTop: 22 }}
        >
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
          >
            Save feedback form
          </Button>
        </Flex>
      </div>
    </Spin>
  );
};

export default Feedback;
