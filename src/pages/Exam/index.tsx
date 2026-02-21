import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Question } from "../Edit";
import { examFind } from "../../interfaces";
import { Button, Checkbox, Input, message, Radio } from "antd";
import "./index.scss";
import axios from "axios";

export function Exam() {
  const { id } = useParams();

  const [json, setJson] = useState<Array<Question>>([]);

  async function query() {
    if (!id) {
      return;
    }
    try {
      const res = await examFind(+id);
      if (res.status === 201 || res.status === 200) {
        try {
          setJson(JSON.parse(res.data.content));
        } catch {
          message.error("考试数据格式错误");
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderComponents(arr: Array<Question>) {
    return arr.map((item) => {
      let formComponent;
      if (item.type === "radio") {
        formComponent = (
          <Radio.Group>
            {item.options?.map((option) => (
              <Radio value={option}>{option}</Radio>
            ))}
          </Radio.Group>
        );
      } else if (item.type === "checkbox") {
        formComponent = <Checkbox.Group options={item.options} />;
      } else if (item.type === "input") {
        formComponent = <Input />;
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
      <Button type="primary" className="btn">
        提交
      </Button>
    </div>
  );
}
