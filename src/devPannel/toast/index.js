import Notification from 'rc-notification'
import 'rc-notification/assets/index.css'

let notification
Notification.newInstance({}, (instance) => {
  notification = instance
})

export const toast = (content) => {
  notification.notice({ content })
}
