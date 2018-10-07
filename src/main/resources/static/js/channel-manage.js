$(function(){
    $("#payType").select2({
        minimumResultsForSearch:-1,
        language:iMsg.select2LangCode,
    });

    $("#channelTypeQuery").select2({
        data:[
            {id:1,text:"父渠道"},
            {id:0,text:"子渠道"}
        ],
        placeholder:iMsg.all,
        allowClear:true,
        minimumResultsForSearch:-1,
        language:iMsg.select2LangCode
    });

    var channelManage = {
        currentItem : null,
        getQueryCondition : function(data) {
            var param = {};
            //组装排序参数
            if (data.order&&data.order.length&&data.order[0]) {
                switch (data.order[0].column) {
                    case 0:
                        param.orderColumn = "channelName";
                        break;
                    case 1:
                        param.orderColumn = "parentId";
                        break;
                    case 2:
                        param.orderColumn = "payType";
                        break;
                    case 3:
                        param.orderColumn = "price";
                        break;
                    case 4:
                        param.orderColumn = "parentChannelName";
                        break;
                    case 5:
                        param.orderColumn = "createTime";
                        break;
                    default:
                        break;
                }
                param.orderDir = data.order[0].dir;
            }
            //组装查询参数
            param.channelName = $("#channelNameQuery").val();
            param.parent = $("#channelTypeQuery").val();
            //组装分页参数
            param.draw = data.draw;
            param.page = data.start/data.length+1;
            param.rows = data.length;
            return param;
        },
        addItemInit : function() {
            $("#myModalLabel").text(iMsg.add);
            validator.resetForm();
            $("#form-channel")[0].reset();
            $("#id").val('');
            $("#payType").val("0").trigger("change");
            $parentId.val(null).trigger("change");
            $("#childChannelInput").hide();
            $("#modal-default").modal("show");
        },
        editItemInit : function(item) {
            if (!item) {
                return;
            }
            $("#myModalLabel").text(iMsg.edit);
            validator.resetForm();
            $("#form-channel")[0].reset();
            $("#id").val(item.id);
            $("#channelName").val(item.channelName);
            var parentId = item.parentId;
            if (parentId === 0) {
                $parentId.val(null).trigger("change");
                $("#payType").val("0").trigger("change");
                $("#childChannelInput").hide();
            } else {
                // $.ajax({
                //     type: 'GET',
                //     url: ctxPath+"/api/channel/list",
                //     dataType:'json',
                //     data:{
                //         parent:true,
                //         rows:0 // 让后台不分页
                //     },
                //     cache:false
                // }).then(function (data) {
                //     var list = data.list;
                //     if(list.length>0){
                //         var c = null;
                //         for(var i in list)
                //             if (list[i].id === parentId) c = list[i];
                //         if (c !== null) {
                //             var option = new Option(c.channelName, c.id, true, true);
                //             // $(option).data('oldParentChannel',c);
                //             $parentId.html(option).trigger('change');
                //         } else {
                //             $parentId.val(null).trigger("change");
                //         }
                //     } else {
                //         $parentId.val(null).trigger("change");
                //     }
                // });
                var option = new Option(item.parentChannelName, item.parentId, true, true);
                $parentId.html(option).trigger('change');
                $("#childChannelInput").show();
                $("#payType").val(item.payType).trigger("change");
                $("#price").val(item.price);
            }
            $("#modal-default").modal("show");
        },
        addItemSubmit : function() {
            var data=$("#form-channel").serializeJSON();
            var pChannel = $parentId.select2("data")[0];
            if (pChannel === undefined) {
                delete data.price;
                delete data.payType;
            } else {
                data.parentId = pChannel.id;
            }
            $.ajax({
                url:ctxPath+"/api/channel/add",
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
            var data=$("#form-channel").serializeJSON();
            var pChannel = $parentId.select2("data")[0];
            if (pChannel === undefined) {
                delete data.price;
                delete data.payType;
            } else {
                data.parentId = pChannel.id;
            }
            $.ajax({
                url:ctxPath+"/api/channel/update",
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
                    }, 1500);
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    var status=XMLHttpRequest.status;
                    var msg=iMsg.editFail;
                    if(status==400){
                        msg=iMsg.formatSizeErr;
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
                if (selectedItems.length === 1) {
                    message = iMsg.removeOne.fillArgs(selectedItems[0].channelName);
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
                            url:ctxPath+"/api/channel/delete?" + $.param({id: selectedItems[0].id}),
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
                                    msg="删除失败，请先删除关联子渠道";
                                }
                                if(status==404){
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
    var $table = $("#table-channel");
    var _table = $table.dataTable($.extend(true,{},CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
            //手动控制遮罩
            $wrapper.spinModal("small");
            NProgress.start();
            //封装请求参数
            var param = channelManage.getQueryCondition(data);
            $.ajax({
                type: "get",
                url: ctxPath+"/api/channel/list",
                cache : false,  //禁用缓存
                data: param,    //传入已封装的参数
                dataType: "json",
                success: function(result, textStatus, jqXHR) {
                    var returnData = {};
                    returnData.draw = parseInt(jqXHR.getResponseHeader("x-app-draw"));
                    returnData.recordsTotal = result.total;
                    returnData.recordsFiltered = result.total;//后台只统计过滤后的总数
                    returnData.data = result.list;
                    //关闭遮罩
                    $wrapper.spinModal(false);
                    NProgress.done();
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
                data: "channelName",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS
            },
            {
                data: "parentId",
                className : "ellipsis",
                render: function (data, type, row, meta) {
                    if (data === 0) return "父渠道";
                    if (data > 0) return "子渠道";
                    return "未知";
                }
            },
            {
                data: "payType",
                className : "ellipsis",
                render: function (data, type, row, meta) {
                    if (data === 0) return "cpm";
                    if (data === 1) return "cpc";
                    if (data === 2) return "cpa";
                    return "未知";
                }
            },
            {
                data : "price",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS
            },
            {
                data : "parentChannelName",
                className : "ellipsis",
                render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS
            },
            {
                data: "createTime",
                className : "ellipsis",
                render : CONSTANT.DATA_TABLES.RENDER.DATE
            },
            {
                className : "ellipsis",
                data: null,
                defaultContent:"",
                orderable : false
            }
        ],
        "createdRow": function (row, data, index ) {
            //行渲染回调,在这里可以对该行dom元素进行任何操作
            //给当前行加样式
//            if (data.role) {
//                $(row).addClass("info");
//            }
            //给当前行某列加样式
            if (data.parentId === 0) {
                $('td', row).eq(1).addClass("text-primary");
                $('td', row).slice(2,5).text("-");
            }
            //不使用render，改用jquery文档操作呈现单元格
            var $btnEdit = $('<a class="king-btn king-info king-radius king-btn-mini btn-edit"><i class="fa fa-edit btn-icon"></i> '+iMsg.edit+'</a>');
            var $btnDel = $('<a class="king-btn king-danger king-radius king-btn-mini btn-del"><i class="fa fa-close btn-icon"></i> '+iMsg.remove+'</a>');
            $('td', row).eq(6).append($btnEdit).append('&nbsp;').append($btnDel);
        },
        "drawCallback": function( settings ) {
            //渲染完毕后的回调
            //清空全选状态
            //$(":checkbox[name='cb-check-all']",$wrapper).prop('checked', false);
            //默认选中第一行
            //$("tbody tr",$table).eq(0).click();
        }
    })).api();

    // 添加按钮
    $("#btn-add").click(function(){
        channelManage.currentItem = null;
        channelManage.addItemInit();
    });

    // 具体字段查询
    $("#form-channel-query").submit(function(){
        _table.order([]);
        _table.draw();
        return false;
    });

    //行点击事件
    $("tbody",$table).on("click","tr",function(event) {
        $(this).addClass("info").siblings().removeClass("info");
        //获取该行对应的数据
//        var item = _table.row($(this).closest('tr')).data();
//        channelManage.currentItem = item;
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
        channelManage.currentItem = item;
        channelManage.editItemInit(item);
    }).on("click",".btn-del",function() {
        //点击删除按钮
        var item = _table.row($(this).closest('tr')).data();
        channelManage.deleteItem([item]);
    });

    function formatChannel(channel) {
        if (channel.loading) {
            return channel.text;
        }
        var markup=channel.channelName;
        return markup;
    }
    function formatChannelSelection(channel) {
        if(channel.channelName){
            return channel.channelName;
        }
        return channel.text;
    }

    // 下拉框后台查询可选择的父渠道，parentId为0
    var $parentId = $("#parentId").select2({
        ajax:{
            url:ctxPath+"/api/channel/list",
            dataType:'json',
            data:function(params){
                return {
                    page:params.page,
                    parent:true // 父渠道
                };
            },
            processResults:function(data,params){
                params.page=params.page||1;
                return {
                    results:data.list,
                    pagination:{
                        more:data.hasNextPage
                    }
                };
            },
            cache:false
        },
        placeholder:'不选即作为父渠道',
        allowClear:true,
        minimumResultsForSearch:-1,
        language:iMsg.select2LangCode,
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatChannel,
        templateSelection: formatChannelSelection
    });

    $parentId.on("select2:select", function(e) {
        $("#childChannelInput").show();
    });

    $parentId.on("select2:unselect", function(e) {
        $("#childChannelInput").hide();
    });

    //用户表单校验规则
    var validator = $("#form-channel").validate({
        errorClass: 'text-danger',
        rules:{
            channelName:{
                required:true,
                notFirstLastSpace:true
            },
            price:{
                required:true,
                digits:true,
                min:0
            }
        },
        messages:{
        },
        submitHandler:function(form){
            if($("#id").val()){
                channelManage.editItemSubmit(); // 编辑暂时没做
            }else{
                channelManage.addItemSubmit();
            }
        },
        onkeyup:false
    });

});

