/*eslint-disable*/
import Vue from 'vue'
import {
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Radio,
  Checkbox,
  RadioGroup,
  Switch,
  Select,
  Option,
  Upload,
  MessageBox,
  Message,
  DatePicker,
  TimeSelect,
  TimePicker,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tag,
  Input,
  InfiniteScroll,
  Backtop,
  Tree,
  Tabs,
	Image,
  TabPane,
  CheckboxGroup,
  Button,
} from 'element-ui'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

Vue.use(Pagination)
Vue.use(Image)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Tooltip)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Tag)
Vue.use(Input)
Vue.use(InfiniteScroll)
Vue.use(Backtop)
Vue.use(Tree)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(TabPane)
Vue.use(Button)

Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.component(CollapseTransition.name, CollapseTransition)


Vue.directive('focus', {
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

Vue.directive('eye', {
  inserted: function (el) {
    // 显示密码
    let eye = document.createElement('div')
    eye.className = 'el-icon-view eye'
    el.parentElement.appendChild(eye)
    eye.addEventListener('click', () => {
      if (el.type === 'password') {
        el.type = 'text'
        eye.classList.add('active')
      } else {
        el.type = 'password'
        eye.classList.remove('active')
      }
      el.focus()
    })
  }
})
