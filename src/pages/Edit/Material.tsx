import { useDrag } from "react-dnd";

export function MaterialItem(props: { name: string; type: string }) {
  //   _ (第一个参数)：是一个对象，包含了当前的拖拽状态（比如是否正在拖动中 isDragging）。因为你代码里没用到，所以用下划线忽略了。
  //drag (第二个参数)：这是一个 Connector（连接器）。它是一个函数，必须绑定到 DOM 元素的 ref 上，告诉 React DnD 哪个具体的 HTML 节点负责触发拖拽。
  //eslint-disable-next-line
  const [_, drag] = useDrag({
    type: props.type, // 1. 身份标识
    // 2. 携带的数据
    item: {
      type: props.type,
    },
  });

  return (
    //如果没有这个 ref={drag}，你点击这个 div 就只是普通的点击。加上 ref 之后，底层会绑定 mousedown、mousemove 等原生事件，从而开启拖拽效果。
    <div
      className="meterial-item"
      ref={(node) => {
        drag(node); // 仅仅执行，不写 return
      }}
    >
      {props.name}
    </div>
  );
}
