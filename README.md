# 开发者：
`郭锦发`
# 线上地址：
`http://asserts.xcarimg.com/resource/common/validate/validate.js`

# 说明：
  validate校验
        1.支持自定义验证规则；
        2.验证后的回调；
        3.支持离焦后的校验；
        3.支持非必填验证；
        4.支持验证自定义提示信息；
        5.支持自定义按钮以及表单默认的提交按钮 type=submit；
# ApI：
一.html 结构
    1.说明：html 表单结构必须以form包裹。
    2.实列：
```
    <form action="" id="formId">
        <ul>
            <li> 
                <label for="">姓名</label>
                <input type="text" name="name"  title="姓名";required="true">
            </li>
            <li> 
                <label for="">电话</label>
                <input type="text" name="phone" title="手机号" required="true" vaildata='{"maxlength":11,"phone":true}'>
            </li>
            <li> 
                <label for="">身份证号</label> 
                <input type="text" name="carId" title="身份证号"   vaildata='{"carId":true}'>
            </li>
        </ul>
        <button type="submit">按钮</button>
        <div id="btn">提交</div>
    </form>
```
    3.语法说明 （所有验证属性可再input，select，textarea 结构中添加;

属性|val|是否必填|描述
--|:--:|--:|:--
required|true/false| （非必填）| 此属性为是否必填项，如果有此属性title 为必填项
name|string|（必填）| 对应给后端的key
vaildate|字符串对象'{"maxlength":11}' |（非必填）|此属性为组合验证，注意{}内为规范的json格式；
msgObj|字符串对象'{"maxlength":"最大修改数"}' |（非必填）|此属性为修改组合验证提示语，注意{}内为规范的json格式；
title|string|（非必填）|必填写所替换的内容，如果 请填写姓名，title=姓名
msg|string|（非必填）|自定义提示信息
isCharToTwolen|string|（非必填）|是否验证汉字为两个字符 默认false


二. javasctipt 部分

   1.以原型的方式入口 new vaildate({})；

参数|val|是否必填|说明
--|:--:|:--|:--
form|form的dom对象| （必填）| 必须以dom对象的形式
changeCallback|输入框改变后的钩子函数|（必填）| 接收object 为此输入框的具体信息  如：state：状态 msg :错误信息 tatget：为错误信息的输入框对象
submitCallback|提交后的钩子函数|（必填）| 接收object 为此输入框的具体信息  如：state：状态 msg :错误信息 tatget：为错误信息的输入框对象 data：返回表单数据以object的形式
isCheckSubmit|阻止表单提交按钮时候的验证|(非必填)|此属性主要用于表单反显,加密是提交按钮不做校验,注意 如果修改表单中的值不通过验证规则则会阻止表单提交


  2.原型的扩展方法
  ```
   myVadatat.addRules([{"rule":/(^\d{15}$)|(^\d{17}(\d|X)$)/,"name":"carId","msg":"请填写正确的省份证号"}])
  ```
属性|val|是否必填
--|:--:|:--
rule|规则正则| （必填）
msg|提示信息）|（必填）
name|对应的key|（必填）

三.内置的验证

名称|key|val| 类如
--|:--:|:--:|:--
手机号|phone| true| '{"phone":true}'
身份证号|provincialCard|true| '{"provincialCard":true}'
机构代码|organizationCode|true| '{"organizationCode":true}'
规定字符长度|length|{length}| '{"length":"5"}'
区间字符串|rangelength|(minlength,maxlength)| '{"rangelength":"0,5"}' 
验证码|verifyCode|true| '{"verifyCode":true}'
护照|passport|true| '{"passport":true}'
邮箱|email|true| '{"email":true}'
非空格|noBlankSpace|true| '{"noBlankSpace":true}'
非法字符|specialSymbols|true| '{"specialSymbols":true}'
请期待~~|

