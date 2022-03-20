/**
 * Created by jerry on 2017/11/13.
 * 三方相关api
 */
import * as API from './'

export default {

  //查询获取book列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/users', params)
  },

  //查询获取一条book信息
  findById: id => {
    return API.GET(`/api/v1/users/${id}`)
  },

}
