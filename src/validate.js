
/*  
   *validate校验
    1.支持自定义验证规则
    2.验证后的回调，
    3.支持非必填验证，
    4.支持验证自定义提示信息。
    5.支持自定义按钮以及表单默认的提交按钮 type=submit
*/
(function($,win){
    /**
    * 核心提示信息逻辑
    * addMsg方法
    * 
   */
   var msg = function(opts){
        this.msgObj = {
           required:"请填写{title}",
           phone:"请填写正确的电话号",
           provincialCard:"请填写有效证件号码",
           verifyCode:"请填写6位数字的验证码",
           passport:"请填写合法的护照证号",
           organizationCode:"请填写合法的统一社会信用代码",
           email: "请填写正确格式的电子邮件",
           url: "请填写合法的网址",
           length: "请填写长度是{length}的字符串",
           sectionLength:"请填写要最少为{sectionLength},最大为{sectionLength}的字符串", //区间
           rangelength: "请填写一个长度介于 {rangelength} 和 {rangelength} 之间的字符串",//区间
           maxLength:"请填写最大长度为{maxLength}的字符",
           minLength:"请填写最大小度为{minLength}的字符",
           noBlankSpace:"内容不能有空格",
           specialSymbols:"内容不能有特殊符号",
           amount:"最多可填入小数点前6位、小数点后2位"
          
           };
          
   };
   msg.prototype.addMsg = function(opt){
       var nobj = {};
       nobj[opt.name] = opt.msg;
       this.msgObj = $.extend( this.msgObj,nobj);
   };
   /**
    * 核心验证逻辑
    * addRules方法
    * vaildata 验证方法
   */
   var  Rules = function(){
        this.msg = new msg();
        this.data = {};
        this.Reg = {
            name:/^([\u4e00-\u9fa5]|\w){0,7}/img,
            phone : /^1[34578]\d{9}$/,
            required:/^\s*$/,
            provincialCard:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            organizationCode:/^[^\u4e00-\u9fa5]{0,30}$/, //机构代码
            length:/^[\s\S]{length}$/,
            maxLength:/^[\s\S]{maxLength}$/,
            minLength:/^[\s\S]{minLength}/,
            rangelength:/^[\s\S]{rangelength}$/,
            verifyCode:/^\d{6}/,
            passport:/^[0-9A-Z]{9}$/,
            email:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            noBlankSpace:/\s+/,
            specialSymbols: /[`~!@#$%^&*()_+<>?:"{},，。.\/;'[\]]+/,
            amount:/^\d{1,6}(\.\d{0,2})?$/

        };
        /*
           此队列用于验证规则取反
        */
        this.returnRulte = {
           noBlankSpace:true,
           specialSymbols:true
        };
        this.methods = {
            replaceTitle:function(str,title,opt){
               var name = opt.key ? opt.key :"title";
               if(!opt.val || (/^\s+$/img.test(opt.val))) name = "title";
               var reg = new RegExp("{"+name+"}",'i');
               if(opt.msgObj){
                   if(opt.msgObj[opt.key]){
                       return opt.msgObj[opt.key];
                   }
               };
               if(!title) return str.replace(reg,title);
               if(title.toString().indexOf(",") <= 0){
                   return str.replace(reg,title);
               }else{
                   var titleArr = title.split(",");
                   for(var i = 0;i < titleArr.length;i++){
                       str = str.replace(reg,titleArr[i]);
                   }
                   return str;
               }
            },
            setRegExp:function(reg,val,name){
               if(reg && val && name){
                   var nreg = new RegExp(name,'i');
                   if(nreg.test(reg.toString())){
                       var nRgestr =  reg.toString().replace(nreg,val).replace("/","").replace("/","");
                       return new RegExp(nRgestr);
                   }else{
                       return reg ;
                   }
               }else{
                   return reg ;
               }
            }
        }
        
   };  
  
   /** 添加规则 rules 
    * 参数 {"rule":/(^\d{15}$)|(^\d{17}(\d|X)$)/,"name":"carId","msg":"请填写正确的省份证号"}
    */
   Rules.prototype.addRules =  function (opt){
       var nobj = {};
       nobj[opt.name] = opt.rule;
       this.Reg =  $.extend(this.Reg,nobj);
       //给提示语录添加规则
       this.msg.addMsg(opt);
   };
   //返回验证规则
   ////{key:"",val:"",required:"required"}
   /** 核心验证逻辑 特殊情况为required验证空  */
   Rules.prototype.vaildata = function (opt){
       var _this = this;
       var methods = this.methods;
       var keyval = opt.keyVal || "";
       var title = opt.title;
       var msgTitle = false;
       var isReturnRulte = false; //是否使用反逻辑校验
       var reg = opt.required ? _this.Reg[opt.required]: _this.Reg[opt.key];
       var  isReturnRulte = this.returnRulte;
       
       if(typeof keyval != "boolean"){
           reg = methods.setRegExp(reg,keyval,opt.key);
           title = keyval?keyval:opt.title;
       }
       if(!reg) return;
       if((opt.required && !opt.isvaildata ) || isReturnRulte[opt.key]){
           if(reg.test(opt.ruleVal)){
               return {state:false,msg:opt.msg ? opt.msg: methods.replaceTitle(_this.msg.msgObj[isReturnRulte[opt.key] ? opt.key : opt.required],title,opt)}
           }else{
               return $.extend(opt,{state:true});
           }
       };
       if(/^\s*$/.test(opt.ruleVal)){
           return $.extend(opt,{state:true});
       }
       if(!reg.test(opt.ruleVal)){
           return {state:false,msg:opt.msg ? opt.msg : methods.replaceTitle(_this.msg.msgObj[opt.key],title,opt)}
       }else{
           return $.extend(opt,{state:true});
       }
   };

   /*
     *入口验方法
     * 外部 addRules
     */
   var  Vadata =  function(opts){
       var _this = this;
       _this.option = $.extend({},_this.defaults,opts);
       _this.data = null;
       _this.state = {
           rulesData:null,
           checkRuleData:{state:true},
           ruleQue:[],//备份正式数据,
           requefirstRuleObj:null// required校验未通过 的第一个文件队列
       };
       _this.meths = {
           setData:function(arr){
               var nObj = {};
               for(var i=0; i<arr.length;i++){
                   nObj[arr[i].name] = arr[i].value
               }
               return nObj;
           },
           setRuleData:function(arr){
              var narr = [];
              for(var i=0;i<arr.length;i++){
                  if(arr[i].key){
                     narr.push(arr[i]);
                  }
                 
                  if(arr[i].vaildata){
                      var vaildata = JSON.parse(arr[i].vaildata);
                      for(var j in vaildata){
                           var nObj = {
                               key:j,
                               keyVal:vaildata[j],
                               val:arr[i].val,
                               target:arr[i].target,
                               title:arr[i].title,
                               vaildata:arr[i].vaildata,
                               msgObj:arr[i].msgObj,
                               isvaildata:true,
                               ruleVal:arr[i].ruleVal,
                               isCharToTwolen:arr[i].isCharToTwolen 
                           };
                           narr.push(nObj);
                      }
                  }
                 
              }
              return narr;
           }
       };
       _this.Rules = new Rules();
      
      
       _this.init();

   };
   Vadata.prototype.init =  function(){
       var _this =  this;
       var meths =  _this.meths;
       var opts = this.option;
       var state = this.state;
       var key = opts.isCheckSubmit ? "change":"keyup";
        
       var inputFn = function(){
            _this.getRuleData(this);
            var checkRule = _this.checkRule(state.eleRrulesData);
            //如果是提交按钮为不执行验证切输入框验证不通过返回报错信息
            (!opts.isCheckSubmit) && (state.checkRuleData = checkRule);
            opts.changeCallback($.extend(state.eleRrulesData[0],checkRule));
       };
       //表单事件
       opts.form.on(opts.changeEventStr,"input,textarea,select",function(e){
           inputFn.call($(this));
           return;
       });
       /**
        * 表单聚焦校验 ，待场景总结是否需要
        */
      /*  opts.form.on("focus","input,textarea,select",function(e){
             var val = $(this).val();
             if(!val) return ;
             inputFn.call($(this));
            return;
       }); */
       
       opts.form.on("click","[type='submit']",function(e){
           e.stopPropagation();
           e.preventDefault();
           opts.form.get(0).submit($(this));
           return;
       });
      
       opts.form.get(0).submit = function(bt) { 
           var serializeArray =  opts.form.serializeArray();
           var serializeObj = meths.setData(serializeArray);
           var rults = {};
           rults.data = serializeObj;
           _this.getRuleData();
           var checkRule = opts.isCheckSubmit ?_this.checkRule():state.checkRuleData;
           state.requefirstRuleObj && state.requefirstRuleObj.target.focus();
           state.requefirstRuleObj = null;
           opts.submitCallback($.extend({},rults,checkRule),bt);
           return false;
       };
   };
   /** sibcheckout 
    *  此方法为扩展校验方法 可外部执行
    *  参数 为需要校验的dom对象,callback 返回当前dom的元素元素信息以及验证状态
   */
   Vadata.prototype.siblingCheck = function(ele,callback){
       var _this =  this;
       var meths =  _this.meths;
       var opts = this.option;
       var state = this.state;
       _this.getRuleData(ele);
       var checkRule = _this.checkRule(state.eleRrulesData,true);
       callback($.extend(state.eleRrulesData[0],checkRule));
   };
   Vadata.prototype.getRuleData = function(ele){
       var _this =  this;
       var opts = this.option;
       var meths =  _this.meths;
       var state = this.state;
       var input =  opts.form.find("input,textarea,select");
       var arr = [];
       var requiredArr = [];
       var eleArr = [];
       var getObj = function(){
           
           var nObj =  {
               target:this,
               title:this.attr("title"),
               msg:this.attr("msg"),
               required:this.attr("required") ? "required" : "",
               name:this.attr("name"),
               key:this.attr("ischeck")=="false" ? "" :this.attr("required") ,
               val:this.val(),
               ruleVal:this.val(),
               vaildata:this.attr("ischeck")=="false" ? "" :this.attr("vaildata"),
               msgObj:this.attr("msgObj") ? JSON.parse(this.attr("msgObj")): "",
               isvaildata:false,
               isCharToTwolen:this.attr("isCharToTwolen") ? true : false,  
           };
           if(nObj.isCharToTwolen){
               nObj.ruleVal = nObj.ruleVal.replace(/[\u4e00-\u9fa5]/g,"aa")
           }
           return nObj;
       }
       if(ele){
           eleArr.push(getObj.call(ele));
           state.eleRrulesData = meths.setRuleData(eleArr);
           return;
       };
       for(var i=0;i<input.length;i++){
           var nObj = getObj.call(input.eq(i));
           arr.push(nObj);
       }
      
       state.rulesData = meths.setRuleData(arr);
      
   };
   /**执行校验规则 */
   Vadata.prototype.checkRule = function(cArr,noSubmit){
       var _this =  this;
       var opts = this.option;
       var state = this.state;
       var checkRuleArr = cArr ? cArr : state.rulesData;
       state.requefirstRuleObj = null;
       for(var i=0;i<checkRuleArr.length;i++){
           if(checkRuleArr[i].required){
              var vaildataObj = _this.Rules.vaildata(checkRuleArr[i]);
              if(!vaildataObj.state){
                 if(!state.requefirstRuleObj) state.requefirstRuleObj = checkRuleArr[i] ;
                 if(!noSubmit) opts.submitCallback( $.extend(vaildataObj,checkRuleArr[i]));
              }
           }
       };
       for(var i=0;i<checkRuleArr.length;i++){
           if((checkRuleArr[i].required && checkRuleArr[i].key)|| (checkRuleArr[i].vaildata && checkRuleArr[i].key)){
              var vaildataObj = _this.Rules.vaildata(checkRuleArr[i]);
              if(!vaildataObj.state){
                  if(!state.requefirstRuleObj) state.requefirstRuleObj = checkRuleArr[i] ;
                  return  $.extend(vaildataObj,checkRuleArr[i]);
              }
           }
       }
       return {"state":true,"msg":"验证通过"};
   };
   Vadata.prototype.addRules = function(arr){
       var _this = this;
       for(var i=0;i<arr.length;i++){
           _this.Rules.addRules(arr[i]);
       }
   };
   Vadata.prototype.defaults =  {
      form:undefined,
      changeCallback:undefined,
      submitCallback:undefined,
      isCheckSubmit:true,
      changeEventStr:"change"
   };
   win.Validate = Vadata;
})(jQuery,window)
