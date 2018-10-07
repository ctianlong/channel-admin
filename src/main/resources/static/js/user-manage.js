$(function(){
	var cdSuperuser=[
		{id:1,text:iMsg.superuser},
		{id:0,text:iMsg.normal}
	];
    var userManage = {
		    currentItem : null,
		    getQueryCondition : function(data) {
				var param = {};
		        //组装排序参数
		        if (data.order&&data.order.length&&data.order[0]) {
		            switch (data.order[0].column) {
		            case 0:
		                param.orderColumn = "username";
		                break;
					case 1:
		                param.orderColumn = "chname";
		                break;
		            case 2:
		                param.orderColumn = "phone";
		                break;
		            case 3:
		                param.orderColumn = "company";
		                break;
		            case 4:
		                param.orderColumn = "address";
		                break;
					case 5:
						param.orderColumn = "is_superuser";
						break;
					case 6:
						param.orderColumn = "gmt_create";
						break;
		            default:
		                break;
		            }
		            param.orderDir = data.order[0].dir;
		        }
		        //组装查询参数
	            param.username = $("#usernameQuery").val();
	            param.chname = $("#chnameQuery").val();
	            param.superuser = $("#superuserQuery").val();
		        //组装分页参数
				param.draw = data.draw;
		        param.page = data.start/data.length+1;
		        param.rows = data.length;
		        return param;
		    },
		    addItemInit : function() {
				$("#myModalLabel").text(iMsg.add);
				validator.resetForm();
		        $("#form-user")[0].reset();
		        $("#id").val('');
				$("#superuser-false").iCheck('check');
		 		$("#modal-default").modal("show");
		    },
		    editItemInit : function(item) {
		        if (!item) {
		            return;
		        }
				$("#myModalLabel").text(iMsg.edit);
				validator.resetForm();
		        $("#form-user")[0].reset();
		        $("#id").val(item.id);
		        $("#username").val(item.username);
		        $("#chname").val(item.chname);
		        $("#phone").val(item.phone);
		        $("#company").val(item.company);
		        $("#address").val(item.address);
				if(item.superuser){
					$("#superuser-true").iCheck('check');
				}else{
					$("#superuser-false").iCheck('check');
				}
		 		$("#modal-default").modal("show");
		    },
		    addItemSubmit : function() {
				var data=$("#form-user").serializeJSON();
	            $.ajax({
	                url:ctxPath+"/api/users",
	                type:"post",
	                contentType:"application/json;charset=utf-8",
	                data: JSON.stringify(data),
	                success:function (data, textStatus, jqXHR) {
	                	$("#modal-default").modal("hide");
	                	var d = dialog({
                            content:'<div class="king-notice-box king-notice-success"><p class="king-notice-text">'+iMsg.addSuccess+'</p></div>'
                        });
                        d.show();
                        setTimeout(function() {
                            d.close().remove();
                            _table.draw(false);
                        }, 1500);
	                },
	                error:function (XMLHttpRequest, textStatus, errorThrown) {
	                	var status=XMLHttpRequest.status;
                    	var msg=iMsg.addFail;
                    	if(status==400){
                    		msg=iMsg.formatSizeErr;
                    	}else if(status==422){
                    		msg=iMsg.RepeatedUname;
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
		    },
		    editItemSubmit : function() {
				var data=$("#form-user").serializeJSON();
	            $.ajax({
	                url:ctxPath+"/api/users/"+data.id,
	                type:"put",
	                contentType:"application/json;charset=utf-8",
	                data: JSON.stringify(data),
	                success:function (result, textStatus, jqXHR) {
	                	$("#modal-default").modal("hide");
	                	var d = dialog({
	                        content:'<div class="king-notice-box king-notice-success"><p class="king-notice-text">'+iMsg.editSuccess+'</p></div>'
	                    });
	                    d.show();
	                    setTimeout(function() {
	                        d.close().remove();
	                        _table.draw(false);
	                        if(data.id==loginUserId){
	                        	$("#chnameNav").text(data.chname);
	                        }
	                    }, 1500);
	                },
	                error:function (XMLHttpRequest, textStatus, errorThrown) {
	                	var status=XMLHttpRequest.status;
	                	var msg=iMsg.editFail;
	                	if(status==400){
	                		msg=iMsg.formatSizeErr;
	                	}else if(status==422){
	                		msg=iMsg.RepeatedUname;
	                	}else if(status==403) {
							msg=iMsg.denyEditSuperuserPerm;
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
		    },
		    deleteItem : function(selectedItems) {
		        var message;
		        if (selectedItems&&selectedItems.length) {
		            if (selectedItems.length == 1) {
		                message = iMsg.removeOne.fillArgs(selectedItems[0].username);
		            }else{
		                message = iMsg.removeMultiple.fillArgs(selectedItems.length);
		            }
					dialog({
				        title: iMsg.confirm,
				        content: message,
				        zIndex: 2048,
				        okValue: iMsg.ok,
				        ok: function() {
				        	NProgress.start();
				            $.ajax({
				            	url:ctxPath+"/api/users/"+selectedItems[0].id,
			                    type:"delete",
			                    success:function (data, textStatus, jqXHR) {
			                    	NProgress.done();
			                    	 var d = dialog({
			                             content:'<div class="king-notice-box king-notice-success"><p class="king-notice-text">'+iMsg.removeSuccess+'</p></div>'
			                         });
			                         d.show();
			                         setTimeout(function() {
			                             d.close().remove();
			                             _table.draw(false);
			                         }, 1500);
			                    },
			                    error:function (XMLHttpRequest, textStatus, errorThrown) {
			                    	NProgress.done();
			                    	var status=XMLHttpRequest.status;
			                    	var msg=iMsg.removeFail;
			                    	if(status==403){
			                    		msg=iMsg.denyRemoveSuperuser;
			                    	}else if(status==404){
			                    		msg=iMsg.userNotExist;
			                    	}
			                    	var d = dialog({
			                             content:'<div class="king-notice-box king-notice-fail"><p class="king-notice-text">'+msg+'</p></div>'
			                         });
			                         d.show();
			                         setTimeout(function() {
			                             d.close().remove();
			                             if(status==404){
			                            	 _table.draw(false);
			                             }
			                         }, 1500);
			                    }
			                });
				        },
				        cancelValue: iMsg.cancel,
				        cancel: function() {}
				    }).showModal();
		        }else{
		            //还没有复选功能
		        }
		    }
    	};

	var $wrapper = $("#div-table-container");
	var $table = $("#table-user");
	var _table = $table.dataTable($.extend(true,{},CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
            //手动控制遮罩
            $wrapper.spinModal("small");
            NProgress.start();
            //封装请求参数
            var param = userManage.getQueryCondition(data);
            $.ajax({
                    type: "get",
                    url: ctxPath+"/api/users",
                    cache : false,  //禁用缓存
                    data: param,    //传入已封装的参数
                    dataType: "json",
                    success: function(result, textStatus, jqXHR) {
                        var returnData = {};
                        returnData.draw = jqXHR.getResponseHeader("x-app-draw");//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.total;
                        returnData.recordsFiltered = result.total;//后台只统计过滤后的总数
                        returnData.data = result.list;
                        //关闭遮罩
                        $wrapper.spinModal(false);
                        NProgress.done();
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                    	var d = dialog({
                            content:'<div class="king-notice-box king-notice-fail"><p class="king-notice-text">'+iMsg.queryFail+'</p></div>'
                        });
                        d.show();
                        setTimeout(function() {
                            d.close().remove();
                        }, 1500);
                        $wrapper.spinModal(false);
                        NProgress.done();
                    }
                });
        },
        columns: [
            //CONSTANT.DATA_TABLES.COLUMN.CHECKBOX,
            {
                data: "username",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
                // width: "100px"
            },
            {
                data: "chname",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
                // width: "100px"
            },
            {
                data : "phone",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
                // width: "100px"
            },
            {
            	data : "company",
            	className : "ellipsis", //文字过长时用省略号显示，CSS实现
                render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS, //会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                // width : "200px"
            },
            {
            	data: "address",
            	className : "ellipsis",
            	render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            	//固定列宽，但至少留下一个活动列不要固定宽度，让表格自行调整。不要将所有列都指定列宽，否则页面伸缩时所有列都会随之按比例伸缩。
                //切记设置table样式为table-layout:fixed; 否则列宽不会强制为指定宽度，也不会出现省略号。
                // width : "200px"
            },
            {
            	data: "superuser",
                className : "ellipsis",
            	// width: "100px",
            	render : function(data, type, row, meta) {
                    return data?'<i class="fa fa-users"></i> '+iMsg.superuser:'<i class="fa fa-user"></i> '+iMsg.normal;
                }
            },
            {
            	data: "gmtCreate",
                className : "ellipsis",
            	// width: "100px",
            	render : CONSTANT.DATA_TABLES.RENDER.DATE
            },
            {
                className : "ellipsis",
                data: null,
                defaultContent:"",
                orderable : false,
                // width : "150px"
            }
        ],
        "createdRow": function (row, data, index ) {
            //行渲染回调,在这里可以对该行dom元素进行任何操作
            //给当前行加样式
//            if (data.role) {
//                $(row).addClass("info");
//            }
            //给当前行某列加样式
            $('td', row).eq(5).addClass(data.superuser?"text-primary":"");
            //不使用render，改用jquery文档操作呈现单元格
            var $btnEdit = $('<a class="king-btn king-info king-radius king-btn-mini btn-edit"><i class="fa fa-edit btn-icon"></i> '+iMsg.edit+'</a>');
            var $btnDel = $('<a class="king-btn king-danger king-radius king-btn-mini btn-del"><i class="fa fa-close btn-icon"></i> '+iMsg.remove+'</a>');
            $('td', row).eq(7).append($btnEdit).append('&nbsp;').append($btnDel);
        },
        "drawCallback": function( settings ) {
            //渲染完毕后的回调
            //清空全选状态
            //$(":checkbox[name='cb-check-all']",$wrapper).prop('checked', false);
            //默认选中第一行
            //$("tbody tr",$table).eq(0).click();
        }
    })).api();
	
	// 下拉菜单初始化，select2
	$("#superuserQuery").select2({
		data:cdSuperuser,
		placeholder:iMsg.all,
		allowClear:true,
		minimumResultsForSearch:-1,
		language:iMsg.select2LangCode
	});
	
	// 添加按钮
	$("#btn-add").click(function(){
		userManage.currentItem = null;
        userManage.addItemInit();
    });
	
	// 具体字段查询
    $("#form-user-query").submit(function(){
    	_table.order([]);
        _table.draw();
        return false;
    });	
 
    // 刷新按钮
    $("#btn-reset-refresh").click(function(){
    	$("#form-user-query")[0].reset();
    	$("#superuserQuery").val(null).trigger("change");
    	_table.order([]);
    	_table.draw();
    });
 
	// 批量删除
//    $("#btn-del").click(function(){
//        var arrItemId = [];
//        $("tbody :checkbox:checked",$table).each(function(i) {
//            var item = _table.row($(this).closest('tr')).data();
//            arrItemId.push(item);
//        });
//        userManage.deleteItem(arrItemId);
//    });
 
 
    //行点击事件
    $("tbody",$table).on("click","tr",function(event) {
        $(this).addClass("info").siblings().removeClass("info");
        //获取该行对应的数据
//        var item = _table.row($(this).closest('tr')).data();
//        userManage.currentItem = item;
    });
 
    $table.on("change",":checkbox",function() {
//        if ($(this).is("[name='cb-check-all']")) {
//            //全选
//            $(":checkbox",$table).prop("checked",$(this).prop("checked"));
//        }else{
//            //一般复选
//            var checkbox = $("tbody :checkbox",$table);
//            $(":checkbox[name='cb-check-all']",$table).prop('checked', checkbox.length == checkbox.filter(':checked').length);
//        }
    }).on("click",".td-checkbox",function(event) {
        //点击单元格即点击复选框
//        !$(event.target).is(":checkbox") && $(":checkbox",this).trigger("click");
    }).on("click",".btn-edit",function() {
        //点击编辑按钮
        var item = _table.row($(this).closest('tr')).data();
        userManage.currentItem = item;
        userManage.editItemInit(item);
    }).on("click",".btn-del",function() {
        //点击删除按钮
        var item = _table.row($(this).closest('tr')).data();
        userManage.deleteItem([item]);
    });
    
    //用户表单校验规则
    var validator = $("#form-user").validate({
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
    						return userManage.currentItem ? userManage.currentItem.username : '';
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
    		if($("#id").val()){
    			userManage.editItemSubmit();
    		}else{
    			userManage.addItemSubmit();
    		}
    	},
    	onkeyup:false
    });
 
});

