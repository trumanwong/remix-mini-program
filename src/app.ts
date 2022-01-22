import {createApp} from 'vue'
import {
    Button,
    Toast,
    Icon,
    Tabs,
    TabPane,
    Input,
    Tabbar,
    TabbarItem,
    TextArea,
    Divider,
    Navbar,
    Cell,
    CellGroup,
    NoticeBar,
} from '@nutui/nutui-taro';
import '@nutui/nutui-taro/dist/style.css';
import share from './plugins/share/share';

import './app.scss'

const App = createApp({
    // onShow(options) {
    // },
    // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(Button).use(Toast).use(Icon).use(Tabs).use(TabPane).use(Input).use(Tabbar).use(TabbarItem).use(TextArea).use(Divider).use(Navbar).use(Cell).use(CellGroup)
App.use(NoticeBar)
App.mixin(share)

export default App
