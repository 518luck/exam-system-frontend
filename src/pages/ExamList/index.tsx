import { Button } from "antd";
import "./index.scss";

export function ExamList() {
  return (
    <div id="ExamList-container">
      <div className="header">
        <h1>考试系统</h1>
      </div>

      <div className="body">
        <div className="operate">
          <Button type="primary">新建试卷</Button>
        </div>

        <div className="list">
          <div className="item">
            <p>语文试卷</p>

            <div className="btns">
              <Button
                className="btn"
                type="primary"
                style={{ background: "darkblue" }}
              >
                发布
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

          <div className="item">
            <p>数学试卷</p>

            <div className="btns">
              <Button
                className="btn"
                type="primary"
                style={{ background: "darkblue" }}
              >
                发布
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
        </div>
      </div>
    </div>
  );
}
