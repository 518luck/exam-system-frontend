import { Form, Input, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { examAdd } from "../../interfaces";
import axios from "axios";

interface ExamAddModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface ExamAdd {
  name: string;
}

export function ExamAddModal(props: ExamAddModalProps) {
  const [form] = useForm<ExamAdd>();

  const handleOk = async function () {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await examAdd(values);

      if (res.status === 201 || res.status === 200) {
        message.success("创建成功");
        form.resetFields();
        props.handleClose();
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
  };

  return (
    <Modal
      title="新增试卷"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText={"创建"}
      cancelText={"取消"}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="试卷名"
          name="name"
          rules={[{ required: true, message: "请输入试卷名!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
