import { Button, message } from "antd";
import "./index.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { examList } from "../../interfaces";
import { ExamAddModal } from "./ExamAddModal";

interface Exam {
  id: number;
  name: string;
  isPublish: boolean;
  isDelete: boolean;
  content: string;
}

export function ExamList() {
  const [list, setList] = useState<Array<Exam>>();
  const [isExamAddModalOpen, setIsExamAddModalOpen] = useState(false);

  async function query() {
    try {
      const res = await examList();
      if (res.status === 201 || res.status === 200) {
        setList(res.data);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    query();
  }, []);

  return (
    <div id="ExamList-container">
      <div className="header">
        <h1>考试系统</h1>
      </div>

      <div className="body">
        <div className="operate">
          <Button type="primary" onClick={() => setIsExamAddModalOpen(true)}>
            新建试卷
          </Button>
        </div>

        <div className="list">
          {list?.map((item) => {
            return (
              <div className="item" key={item.id}>
                <p>{item.name}</p>

                <div className="btns">
                  <Button
                    className="btn"
                    type="primary"
                    style={{ background: "darkblue" }}
                  >
                    {item.isPublish ? "停止" : "发布"}
                  </Button>

                  <Button
                    className="btn"
                    type="primary"
                    style={{ background: "green" }}
                  >
                    编辑
                  </Button>

                  <Button
                    className="btn"
                    type="primary"
                    style={{ background: "darkred" }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ExamAddModal
        isOpen={isExamAddModalOpen}
        handleClose={() => {
          setIsExamAddModalOpen(false);
          query();
        }}
      />
    </div>
  );
}
