import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Question } from "../Edit";
import { answerAdd, examFind } from "../../interfaces";
import { Button, Checkbox, Input, message, Radio } from "antd";
import "./index.scss";
import axios from "axios";

export function Exam() {
  const { id } = useParams();
  const [json, setJson] = useState<Array<Question>>([]);
  const [answers, setAnswers] = useState<Array<{ id: number; answer: string }>>(
    [],
  );
  const navigate = useNavigate();

  // 获取试卷
  async function query() {
    if (!id) {
      return;
    }
    try {
      const res = await examFind(+id);
      if (res.status === 201 || res.status === 200) {
        try {
          const content = JSON.parse(res.data.content);
          setJson(content);
          setAnswers(
            content.map((item: { id: number }) => {
              return {
                // 初始化答案为空字符串,主要渲染ID进去
                id: item.id,
                answer: "",
              };
            }),
          );
        } catch (e) {
          message.error("考试数据格式错误" + e);
        }
      }
    } catch (e) {
      // 使用 axios 提供的检查工具
      if (axios.isAxiosError(e)) {
        // 此时 e 被自动识别为 AxiosError 类型
        message.error(e.response?.data?.message || "登录失败，请检查网络");
      } else {
        // 处理非 Axios 错误（如代码逻辑错误）
        message.error("发生意外错误");
      }
    }
  }
  // 组件挂载时获取试卷
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 设置答案
  function setAnswer(id: number, value: string) {
    setAnswers(
      answers.map((item) => {
        return item.id === id
          ? {
              id,
              answer: value,
            }
          : item;
      }),
    );
  }

  // 提交答案
  const addAnswer = useCallback(
    async function () {
      if (!id) {
        return;
      }
      try {
        const res = await answerAdd({
          examId: +id,
          content: JSON.stringify(answers),
        });

        if (res.status === 201 || res.status === 200) {
          try {
            message.success("提交成功");

            navigate("/res/" + res.data.id);
          } catch {
            message.error("提交失败");
          }
        }
      } catch (e) {
        // 使用 axios 提供的检查工具
        if (axios.isAxiosError(e)) {
          // 此时 e 被自动识别为 AxiosError 类型
          message.error(e.response?.data?.message || "登录失败，请检查网络");
        } else {
          // 处理非 Axios 错误（如代码逻辑错误）
          message.error("发生意外错误");
        }
      }
    },

    [answers, id, navigate],
  );

  // 渲染试卷组件
  function renderComponents(arr: Array<Question>) {
    return arr.map((item) => {
      let formComponent;
      if (item.type === "radio") {
        formComponent = (
          <Radio.Group
            key={item.id}
            onChange={(e) => {
              setAnswer(item.id, e.target.value);
            }}
          >
            {item.options?.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );
      } else if (item.type === "checkbox") {
        formComponent = (
          <Checkbox.Group
            key={item.id}
            options={item.options}
            onChange={(values) => {
              setAnswer(item.id, values.join(","));
            }}
          />
        );
      } else if (item.type === "input") {
        formComponent = (
          <Input
            onChange={(e) => {
              setAnswer(item.id, e.target.value);
            }}
          />
        );
      }

      return (
        <div className="component-item" key={item.id}>
          <p className="question">{item.question}</p>

          <div className="options">{formComponent}</div>
        </div>
      );
    });
  }

  return (
    <div className="exam-container">
      {renderComponents(json)}
      <Button type="primary" className="btn" onClick={addAnswer}>
        提交
      </Button>
    </div>
  );
}
