$(function(){
	var userInfoManager={
		getUserInfo:function(){
			NProgress.start();
			$.ajax({
		        url:ctxPath+"/api/user",
		        type:"get",
		        success:function (data, textStatus, jqXHR) {
		        	NProgress.done();
		        	userInfoManager.showUserInfo(data);
		        },
		        error:function (XMLHttpRequest, textStatus, errorThrown) {
		        	NProgress.done();
		        	var status=XMLHttpRequest.status;
		        	var msg=iMsg.queryFail;
		        	if(status==401){
		        		msg=iMsg.reLogin;
		        	}
		        	var d = dialog({
		                 content:'<div class="king-notice-box king-notice-fail"><p class="king-notice-text">'+msg+'</p></div>'
		             });
		             d.show();
		             setTimeout(function() {
		                 d.close().remove();
		             }, 1500);
		        }
		    });
		},
		showUserInfo:function(data){
			if(data){
				$("#username1").text(data.username||"");
				$("#chname1").text(data.chname||"");
				$("#phone1").text(data.phone||"");
				$("#company1").text(data.company||"");
				$("#address1").text(data.address||"");
				$("#chnameLeftPanel").text(data.chname||"");
				$("#usernameLeftPanel").text(data.username||"");
			}else {
				$("#username1").empty();
				$("#chname1").empty();
				$("#phone1").empty();
				$("#company1").empty();
				$("#address1").empty();
				$("#chnameLeftPanel").empty();
				$("#usernameLeftPanel").empty();
			}
		},
		editUserInfoInit:function(){
			validator.resetForm();
	        $("#form-userInfo")[0].reset();
	        $("#username").val($("#username1").text());
	        $("#chname").val($("#chname1").text());
	        $("#phone").val($("#phone1").text());
	        $("#company").val($("#company1").text());
	        $("#address").val($("#address1").text());
	 		$("#modal-default").modal("show");
		},
		editUserInfoSubmit:function(){
			var param=$("#form-userInfo").serializeJSON();
            $.ajax({
                url:ctxPath+"/api/user",
                type:"put",
                contentType:"application/json;charset=utf-8",
                data: JSON.stringify(param),
                success:function (data, textStatus, jqXHR) {
                	$("#modal-default").modal("hide");
                	var d = dialog({
                        content:'<div class="king-notice-box king-notice-success"><p class="king-notice-text">'+iMsg.editSuccess+'</p></div>'
                    });
                    d.show();
                    setTimeout(function() {
                        d.close().remove();
                        userInfoManager.showUserInfo(param);
                        $("#chnameNav").text(param.chname);
                    }, 1500);
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                	var status=XMLHttpRequest.status;
                	var msg=iMsg.editFail;
                	if(status==400){
                		msg=iMsg.formatSizeErr;
                	}else if(status==422){
                		msg=iMsg.RepeatedUname;
                	}else if(status=401){
                		msg=iMsg.reLogin;
                	}
                	var d = dialog({
                         content:'<div class="king-notice-box king-notice-fail"><p class="king-notice-text">'+msg+'</p></div>',
                         zIndex:2048
                     });
                     d.show();
                     setTimeout(function() {
                         d.close().remove();
                     }, 1500);
                }
            });
		}
	}
	userInfoManager.getUserInfo();
	$("#btn-edit-userinfo").click(function(){
		userInfoManager.editUserInfoInit();
	});
	//用户表单校验规则
    var validator = $("#form-userInfo").validate({
        errorClass: 'text-danger',
    	rules:{
    		username:{
    			required:true,
    			usernameRegex:true,
    			remote:{
    				url:ctxPath+"/api/common/user/check/username",
    				data:{
    					username:function(){
    						return $("#username").val();
    					},
    					oldUsername:function(){
    						return $("#username1").text();
    					}
    				}
    			}
    		},
    		chname:{
    			required:true,
    			notFirstLastSpace:true
    		}
    	},
    	messages:{
    		username:{
    			remote:iMsg.RepeatedUname
    		}
    	},
    	submitHandler:function(form){
    		userInfoManager.editUserInfoSubmit();
    	},
    	onkeyup:false
    });
    
    // 用户修改密码校验规则
    $("#form-password").validate({
	    errorClass: 'text-danger',
        rules:{
            oldPassword:{
            	required: true,
            	rangelength: [6,18]
            },
            newPassword:{
            	required: true,
            	rangelength: [6,18]
            },
            newPassword_confirm:{
            	required: true,
            	rangelength: [6,18],
            	equalTo: "#newPassword"
            }
        },
        messages:{
        	oldPassword:{
        		required:iMsg.inputOldPassword,
        		rangelength:$.validator.format(iMsg.passLength)
        	},
            newPassword:{
            	required:iMsg.inputNewPassword,
            	rangelength:$.validator.format(iMsg.passLength)
            },
	        newPassword_confirm:{
	        	required:iMsg.confirmPassword,
	        	rangelength:$.validator.format(iMsg.passLength),
	        	equalTo:iMsg.InconsistentPassword
	        }
        },
        submitHandler:function(form){
        	var data=$("#form-password").serializeJSON();
        	delete data.newPassword_confirm;
        	NProgress.start();
	        $.ajax({
	            url:ctxPath+"/api/user/password",
	            type:"put",
	            contentType:"application/json;charset=utf-8",
	            data: JSON.stringify(data),
	            success:function (data, textStatus, jqXHR) {
	            	NProgress.done();
	                var d = dialog({
	                	content:'<div class="king-notice-box king-notice-success"><p class="king-notice-text">'+iMsg.editSuccess+'</p></div>'
	                });
	                d.show();
	                setTimeout(function() {
	                    d.close().remove();
	                    $("#form-password")[0].reset();
	                }, 1500);
	            },
	            error:function (XMLHttpRequest, textStatus, errorThrown) {
	            	NProgress.done();
	                var status=XMLHttpRequest.status;
	                var msg=iMsg.editFail;
	                if(status==403){
	                	msg=iMsg.oldPassErr;
	                }else if(status==400){
	                	msg=iMsg.formatSizeErr;
	                }else if(status==401){
	                	msg=iMsg.reLogin;
	                }
	                var d = dialog({
	                     content:'<div class="king-notice-box king-notice-fail"><p class="king-notice-text">'+msg+'</p></div>'
	                 });
	                 d.show();
	                 setTimeout(function() {
	                     d.close().remove();
	                 }, 1500);
	            }
	        });
        },
        onkeyup:false
    });
	
	
});