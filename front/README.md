## demo预览
- 页面录制：

- 截图：


- 反馈列表：
![list](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/35994/1561107104926-547196ed-270f-4331-aa6f-4b222bc5153b.png) 

- 反馈详情：
![detail](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/35994/1561107126710-988637c7-b155-4505-a803-35660311646e.png) 

## 安装
```bash
npm install feedback-recorder
```
## 使用
main.js
```js
import FeedbackRecorder from 'feedback-recorder';
import 'feedback-recorder/dist/index.css';

Vue.use(FeedbackRecorder);
```
App.vue
```html
<feedback-recorder :submitter="user" sysName="some-site-name"></feedback-recorder>
```
## 唤出方法
shift+f+b

## props

| 参数 | 说明 | 类型 | 默认值 |
| -------- | -------- | -------- | -------- |
| block     | 是否屏蔽录制挂件区域     | boolean     | true     |
| submitter      | 登录用户信息     | object     | {id: '',name: ''}     |
| sysName       | 系统名称     | string     | ''     |
| player     		| 是否带播放功能：可选取文件播放     | boolean     | false     |
| download        | 是否下载录制的json文件     | boolean     | false     |
