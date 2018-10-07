$(function(){
    	// 用户登录表单校验规则
    	$("#form-login").validate({
    		errorClass: 'text-danger',
            errorPlacement: function(error, element) {
                error.appendTo(element.parent().prev());  
            },
            rules:{
                username:{
                    required:true,
                    usernameRegex:true
                },
                password:{
                    required: true
                }
            },
            messages:{
                username:{
                    required:iMsg.inputUsername
                },
                password:{
                    required:iMsg.inputPassword
                }
            },
            submitHandler:function(form){
        	    NProgress.start();
                $.ajax({
                    url:ctxPath+"/api/common/user/login",
                    type:"post",
                    data: $("#form-login").serialize(),
                    success:function (data, textStatus, jqXHR) {
                    	NProgress.done();
                        $(location).prop("href",ctxPath+"/");
                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                    	NProgress.done();
                        var status=XMLHttpRequest.status;
                        var msg=iMsg.loginFail;
                        if(status==401){
                            msg=iMsg.unamePassErr;
                        }
                        $("#loginMsg").text(msg);
                    }
                });
   	        },
            onkeyup:false
    	});
    	
    	// 用户注册表单校验规则
   	    $("#form-register").validate({
   	        errorClass: 'text-danger',
		   	errorPlacement: function(error, element) {
		   		error.appendTo(element.parent().prev());  
		   	},
   	        rules:{
   	            username:{
   	                required:true,
   	                usernameRegex:true,
   	                remote:ctxPath+"/api/common/user/check/username"
   	            },
   	            chname:{
   	            	required:true,
   	            	notFirstLastSpace:true
   	            },
   	            password:{
   	            	required: true,
   	            	rangelength: [6,18]
   	            },
   	            password_confirm:{
   	            	required: true,
   	            	rangelength: [6,18],
                    equalTo: "#password"
   	            }
   	        },
   	        messages:{
   	            username:{
   	            	required:iMsg.inputUsername,
   	                remote:iMsg.RepeatedUname
   	            },
   	            chname:{
   	            	required:iMsg.inputChname
   	            },
   	            password:{
   	            	required:iMsg.inputNewPassword,
   	            	rangelength:$.validator.format(iMsg.passLength)
   	            },
	   	        password_confirm:{
	   	        	required:iMsg.confirmPassword,
	   	        	rangelength:$.validator.format(iMsg.passLength),
	   	        	equalTo: iMsg.InconsistentPassword
	            }
   	        },
   	        submitHandler:function(form){
   	        	var data=$("#form-register").serializeJSON();
   	        	delete data.password_confirm;
   	        	NProgress.start();
                $.ajax({
                    url:ctxPath+"/api/common/user/registerAndLogin",
                    type:"post",
                    contentType:"application/json;charset=utf-8",
                    data: JSON.stringify(data),
                    success:function (data, textStatus, jqXHR) {
                    	NProgress.done();
                        $(location).prop("href",ctxPath+"/user?register");
                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                    	NProgress.done();
                        var status=XMLHttpRequest.status;
                        var msg=iMsg.registerFail;
                        if(status==400){
                            msg=iMsg.formatSizeErr;
                        }else if(status==422){
                            msg=iMsg.RepeatedUname;
                        }else if(status==401){
                        	msg=iMsg.registerNoLogin;
                        }
                        $("#registerMsg").text(msg);
                    }
                });
   	        },
   	        onkeyup:false
   	    });
});