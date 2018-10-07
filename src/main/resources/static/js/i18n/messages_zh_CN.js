var iMsg = {
	select2LangCode : "zh-CN",
	usernameRegFailMsg : "只包含字母、数字、下划线且不以数字开头",
	notFirLasSpaceMsg : "首尾不能含空格",
	formatSizeErr : "您的输入格式或大小有误",
	inputUsername : "请输入用户名",
	RepeatedUname : "该用户名已存在",
	inputChname : "请输入真实姓名",
	inputPassword : "请输入密码",
	passLength : "密码长度为{0}-{1}个字符",
	inputNewPassword : "请输入新密码",
	inputOldPassword : "请输入旧密码",
	oldPassErr : "旧密码验证错误",
	confirmPassword : "请确认密码",
	InconsistentPassword : "两次密码输入不一致",
	correctYear : "请输入正确的年份",
	loginFail : "登录失败",
	reLogin : "您已退出登录，请重新登录",
	unamePassErr : "您输入的账号或密码有误",
	registerFail : "注册用户失败",
	registerNoLogin : "注册成功，自动登录失败，请手动登录",
	denyEditSuperuserPerm:"无法修改当前登录超级管理员权限",
	denyRemoveSuperuser:"无法删除当前登录超级管理员用户",
	all:"全部",
	add:"添加",
	addSuccess : "添加成功",
	addFail : "添加失败",
	queryFail : "查询失败",
	edit:"编辑",
	editSuccess : "修改成功",
	editFail : "修改失败",
	remove:"删除",
	removeOne:"确认删除 {0} 吗?",
	removeMultiple:"确认删除选中的 {0} 条记录吗?",
	removeSuccess:"删除成功",
	removeFail:"删除失败",
	userNotExist:"该记录不存在或已经被删除",
	confirm:"确认",
	ok:"确定",
	cancel:"取消",
	sProcessing : "处理中...",
	sLengthMenu : "每页 _MENU_ 项",
	sZeroRecords : "没有匹配结果",
	sInfo : "共 _PAGES_ 页，共 _TOTAL_ 条记录 ",
	sInfoEmpty : "当前显示第 0 至 0 项，共 0 项",
	sInfoFiltered : "(由 _MAX_ 项结果过滤)",
	sInfoPostFix : "",
	sSearch : "搜索:",
	sUrl : "",
	sEmptyTable : "没有找到记录",
	sLoadingRecords : "载入中...",
	sInfoThousands : ",",
	sFirst : "首页",
	sPrevious : "上页",
	sNext : "下页",
	sLast : "末页",
	sJump : "跳转",
	sSortAscending : ": 以升序排列此列",
	sSortDescending : ": 以降序排列此列",
	superuser:"超级管理员",
	normal:"管理员",
	onlyPermitOwnEdit:"只能修改您提交的记录",
	onlyPermitOwnDelete:"只能删除您提交的记录"
}
/* 
 * var str0 = "{0} must smaller than {1}" 
 * var str1 = str0.fillArgs("apple", "watermelon"); 
 * srt1 equals to "apple must smaller than watermelon" 
 */  
String.prototype.fillArgs = function(){
    var formated = this;
    for ( var i=0;i<arguments.length;i++){  
        var param = "\{"+i+"\}";
        formated = formated.replace(param,arguments[i]);
    }
    return formated;
}