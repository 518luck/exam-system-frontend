import { Modal, Table, type TableColumnsType, message } from "antd";
import { useEffect, useState } from "react";
import { ranking } from "../../interfaces";
import axios from "axios";

interface RankingModalProps {
  isOpen: boolean;
  handleClose: () => void;
  examId?: number;
}

export function RankingModal(props: RankingModalProps) {
  const [list, setList] = useState([]);

  useEffect(() => {
    //eslint-disable-next-line
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.examId]);

  async function query() {
    if (!props.examId) {
      return;
    }
    try {
      const res = await ranking(props.examId);

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

  const columns: TableColumnsType = [
    {
      title: "名字",
      key: "name",
      render: (_, record) => <div>{record.answerer.username}</div>,
    },
    {
      title: "分数",
      dataIndex: "score",
      key: "score",
    },
  ];

  return (
    <Modal
      title="排行榜"
      open={props.isOpen}
      onOk={() => props.handleClose()}
      onCancel={() => props.handleClose()}
      okText={"确认"}
      cancelText={"取消"}
    >
      <Table dataSource={list} columns={columns} />;
    </Modal>
  );
}
