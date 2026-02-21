import { Link, useParams } from "react-router";
import "./index.scss";
import {
  Button,
  Checkbox,
  Input,
  Form,
  Radio,
  InputNumber,
  Segmented,
  message,
  Space,
} from "antd";
import { MaterialItem } from "./Material";
import { useDrop } from "react-dnd";
import { useEffect, useState } from "react";
import axios from "axios";
import { examFind, examSave } from "../../interfaces";
import { PreviewModal } from "./PreviewModal";
const { TextArea } = Input;

export type Question = {
  id: number;
  question: string;
  type: "radio" | "checkbox" | "input";
  options?: string[];
  score: number;
  answer: string;
  answerAnalyse: string;
};

// const json: Array<Question> = [];

export function Edit() {
  // 从路由参数中获取 id
  const { id } = useParams();

  const [form] = Form.useForm();
  // 试卷数据
  const [json, setJson] = useState<Array<Question>>([]);
  // 当前选中的题目
  const [curQuestionId, setCurQuestionId] = useState<number>();
  // 表单中的字段名
  const [key, setKey] = useState<string>("json");
  // 预览弹窗是否打开
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  // 当 curQuestionId 变化时，更新 form 中的字段值
  useEffect(() => {
    // 只有当“属性”面板打开，且有选中题目时，才同步数据
    if (curQuestionId && key === "属性") {
      const currentData = json.find((item) => item.id === curQuestionId);
      if (currentData) {
        form.setFieldsValue(currentData);
      }
    }
  }, [curQuestionId, form, json, key]); // 加上 key 依赖

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
          message.error("试卷数据格式错误");
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

  // 组件挂载时查询试卷数据
  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 渲染组件
  function renderComponents(arr: Array<Question>) {
    return arr.map((item) => {
      let formComponent;
      if (item.type === "radio") {
        formComponent = (
          <Radio.Group key={item.id}>
            {item.options?.map((option) => (
              <Radio value={option} key={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );
      } else if (item.type === "checkbox") {
        formComponent = <Checkbox.Group key={item.id} options={item.options} />;
      } else if (item.type === "input") {
        formComponent = <Input key={item.id} />;
      }

      return (
        <div
          className="component-item"
          key={item.id}
          onClick={() => {
            setCurQuestionId(item.id);
          }}
          style={item.id === curQuestionId ? { border: "2px solid blue" } : {}}
        >
          <p className="question">{item.question}</p>

          <div className="options">{formComponent}</div>

          <p className="score">分值：{item.score}</p>

          <p className="answer">答案：{item.answer}</p>

          <p className="answerAnalyse">答案解析：{item.answerAnalyse}</p>
        </div>
      );
    });
  }

  // 处理拖放事件
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["单选题", "多选题", "填空题"], // 设置收货白名单
    drop: (item: { type: string }) => {
      // 这里的 item 就是你在 MaterialItem 那边定义的 item: { type: props.type }。
      // 当松开鼠标时，调用添加题目的逻辑
      const type = {
        单选题: "radio",
        多选题: "checkbox",
        填空题: "input",
      }[item.type] as Question["type"];

      setJson((json) => [
        ...json,
        {
          id: new Date().getTime(),
          type,
          question: "最高的山？",
          options: ["选项1", "选项2"],
          score: 5,
          answer: "选项1",
          answerAnalyse: "答案解析",
        },
      ]);
    },
    // 它会不断查询拖拽监控器（monitor），看当前是否有拖拽物正悬停在自己正上方。
    // isOver 是一个布尔值。如果拖拽物进来了，它就是 true；出去了，它就是 false。
    collect: (monitor) => ({
      isOver: monitor.isOver(), // 鼠标悬停在上方时的状态
    }),
  }));

  // 保存试卷
  async function saveExam() {
    if (!id) {
      return;
    }
    try {
      const res = await examSave({
        id: +id,
        content: JSON.stringify(json),
      });
      if (res.status === 201 || res.status === 200) {
        message.success("保存成功");
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
    <div id="edit-container">
      <PreviewModal
        isOpen={isPreviewModalOpen}
        json={json}
        handleClose={() => {
          setPreviewModalOpen(false);
        }}
      />
      <div className="header">
        <div>试卷编辑器</div>

        <div>
          <Space>
            <Button
              type="default"
              onClick={() => {
                setPreviewModalOpen(true);
              }}
            >
              预览
            </Button>

            <Button type="primary" onClick={saveExam}>
              保存
            </Button>
            <Button type="default">
              <Link to="/">返回</Link>
            </Button>
          </Space>
        </div>
      </div>

      <div className="body">
        <div className="materials">
          <MaterialItem name="单选题" type="单选题" />
          <MaterialItem name="多选题" type="多选题" />
          <MaterialItem name="填空题" type="填空题" />
        </div>

        <div
          className="edit-area"
          ref={(node) => {
            drop(node);
          }}
          style={isOver ? { border: "2px solid blue" } : {}}
        >
          {renderComponents(json)}
        </div>

        <div className="setting">
          <Segmented
            value={key}
            onChange={setKey}
            block
            options={["json", "属性"]}
          />
          {key === "json" && <pre>{JSON.stringify(json, null, 4)}</pre>}
          {key === "属性" &&
            curQuestionId &&
            json
              .filter((item) => item.id === curQuestionId)
              .map((item, index) => {
                return (
                  <div key={index}>
                    <Form
                      form={form}
                      style={{ padding: "20px" }}
                      initialValues={item} // 将当前题目的数据（question, type, score等）作为表单的初始值
                      // 当表单中任何一个输入框发生变化时触发
                      onValuesChange={(_, values) => {
                        // 更新整个试卷的状态（json 数组）
                        setJson((json) => {
                          // 遍历现有的所有题目
                          return json.map((cur) => {
                            // 找到正在被修改的那道题
                            return cur.id === item.id
                              ? {
                                  //// 保持 ID 不变
                                  id: item.id,
                                  // 用表单里最新的数据覆盖旧数据
                                  ...values,
                                  options:
                                    // 特殊处理选项字段
                                    typeof values.options === "string"
                                      ? values.options?.split(",") // 如果用户输入的是字符串，按逗号拆分成数组
                                      : values.options,
                                }
                              : cur; // 其他没被选中的题目保持原样
                          });
                        });
                      }}
                    >
                      <Form.Item
                        label="问题"
                        name="question"
                        rules={[{ required: true, message: "请输入问题!" }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="类型"
                        name="type"
                        rules={[{ required: true, message: "请选择类型!" }]}
                      >
                        <Radio.Group>
                          <Radio value="radio">单选题</Radio>

                          <Radio value="checkbox">多选题</Radio>

                          <Radio value="input">填空题</Radio>
                        </Radio.Group>
                      </Form.Item>

                      {item.type !== "input" && (
                        <Form.Item
                          label="选项（逗号分割）"
                          name="options"
                          rules={[{ required: true, message: "请输入选项!" }]}
                        >
                          <Input />
                        </Form.Item>
                      )}
                      <Form.Item
                        label="分数"
                        name="score"
                        rules={[{ required: true, message: "请输入分数!" }]}
                      >
                        <InputNumber />
                      </Form.Item>

                      <Form.Item
                        label="答案"
                        name="answer"
                        rules={[{ required: true, message: "请输入答案!" }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="答案分析"
                        name="answerAnalyse"
                        rules={[{ required: true, message: "请输入答案分析!" }]}
                      >
                        <TextArea />
                      </Form.Item>
                    </Form>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
