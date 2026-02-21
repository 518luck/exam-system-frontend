import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { answerFind, examFind } from "../../interfaces";
import type { Question } from "../Edit";
import { Button, Checkbox, Input, message, Radio } from "antd";
import "./index.scss";

export function Res() {
  const { id } = useParams();
  const [score, setScore] = useState();
  const [json, setJson] = useState<Question[]>([]);

  // 获取分数和examid
  async function query() {
    if (!id) {
      return;
    }
    try {
      const res = await answerFind(+id);

      if (res.status === 201 || res.status === 200) {
        setScore(res.data.score);

        await queryExam(res.data.examId);
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
  // 页面加载时获取考试详情
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取考试详情
  async function queryExam(examId: number) {
    try {
      const res = await examFind(+examId);

      if (res.status === 201 || res.status === 200) {
        try {
          if (!res.data.content) {
            setJson([]);
            return;
          }
          const questions = JSON.parse(res.data.content);

          setJson(questions);
        } catch {
          message.error("考试内容格式错误");
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

  // 渲染组件
  function renderComponents(arr: Array<Question>) {
    return arr.map((item) => {
      let formComponent;
      if (item.type === "radio") {
        formComponent = (
          <Radio.Group value={item.answer}>
            {item.options?.map((option) => (
              <Radio value={option}>{option}</Radio>
            ))}
          </Radio.Group>
        );
      } else if (item.type === "checkbox") {
        formComponent = (
          <Checkbox.Group
            options={item.options}
            value={item.answer.split(",")}
          />
        );
      } else if (item.type === "input") {
        formComponent = <Input value={item.answer} />;
      }

      return (
        <div className="component-item" key={item.id}>
          <p className="question">{item.question}</p>

          <div className="options">{formComponent}</div>

          <p className="score">分值：{item.score}</p>

          <p className="answerAnalyse">答案解析：{item.answerAnalyse}</p>
        </div>
      );
    });
  }
  return (
    <div id="res-container">
      <div className="score-container">
        得分: <span>{score}</span>
      </div>

      <div className="answer-list">正确答案：{renderComponents(json)}</div>

      <Button type="primary">
        <Link to="/">返回试卷列表</Link>
      </Button>
    </div>
  );
}
