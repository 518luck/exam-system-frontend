import { Button, message, Popconfirm } from "antd";
import "./index.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  examDelete,
  examList,
  examPublish,
  examUnpublish,
} from "../../interfaces";
import { ExamAddModal } from "./ExamAddModal";
import { useNavigate } from "react-router";

interface Exam {
  id: number;
  name: string;
  isPublish: boolean;
  isDelete: boolean;
  content: string;
}

export function ExamList() {
  // 导航函数
  const navigate = useNavigate();
  // 考试列表
  const [list, setList] = useState<Array<Exam>>();
  // 新增试卷弹窗
  const [isExamAddModalOpen, setIsExamAddModalOpen] = useState(false);
  // 回收站
  const [bin, setBin] = useState(false);

  // 查询考试列表
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

  // 切换发布状态(试卷状态)
  async function changePublishState(id: number, publish: boolean) {
    console.log("🚀 ~ changePublishState ~ publish:", publish);
    try {
      const res = publish ? await examUnpublish(id) : await examPublish(id);
      if (res.status === 201 || res.status === 200) {
        message.success(publish ? "已取消发布" : "已发布");
        query();
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

  // 删除考试
  async function deleteExam(id: number) {
    try {
      const res = await examDelete(id);
      if (res.status === 201 || res.status === 200) {
        message.success("已删除");
        query();
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
          <Button
            onClick={() => {
              setBin((bin) => !bin);
            }}
          >
            {bin ? "退出回收站" : "打开回收站"}
          </Button>
        </div>

        <div className="list">
          {list
            ?.filter((item) => {
              return bin ? item.isDelete === true : item.isDelete === false;
            })
            ?.map((item) => {
              return (
                <div className="item" key={item.id}>
                  <p>{item.name}</p>

                  <div className="btns">
                    <Button
                      className="btn"
                      type="primary"
                      style={{ background: "darkblue" }}
                      onClick={() =>
                        changePublishState(item.id, item.isPublish)
                      }
                    >
                      {item.isPublish ? "停止" : "发布"}
                    </Button>

                    <Button
                      className="btn"
                      type="primary"
                      style={{ background: "green" }}
                      onClick={() => navigate(`/edit/${item.id}`)}
                    >
                      编辑
                    </Button>

                    <Popconfirm
                      title="试卷删除"
                      description="确认放入回收站吗？"
                      onConfirm={() => deleteExam(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        className="btn"
                        type="primary"
                        style={{ background: "darkred" }}
                      >
                        删除
                      </Button>
                    </Popconfirm>
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
