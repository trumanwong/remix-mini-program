import login from '../plugins/http/login'
import request from '../plugins/http/request'

export const miniProgramLogin = function (type) {
  return login(type)
}

