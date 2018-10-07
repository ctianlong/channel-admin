$(function(){

    $('.input-daterange').datepicker({
        autoclose: true,
        language: "zh-CN",
        // todayHighlight: true,
        clearBtn: true,
        format: "yyyy-mm-dd",
        container: "#datepicker"
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

    // 下拉框查询子渠道，parentId不为0
    var $channelIdQuery = $("#channelIdQuery").select2({
        ajax:{
            url:ctxPath+"/api/channel/list",
            dataType:'json',
            data:function(params){
                return {
                    page:params.page,
                    parent:false // 子渠道
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
        placeholder:'不筛选渠道',
        allowClear:true,
        minimumResultsForSearch:-1,
        language:iMsg.select2LangCode,
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatChannel,
        templateSelection: formatChannelSelection
    });

    function getQueryCondition(data) {
        var param = {};
        //组装排序参数
        if (data.order&&data.order.length&&data.order[0]) {
            switch (data.order[0].column) {
                case 0:
                    param.orderColumn = "parentChannelName";
                    break;
                case 1:
                    param.orderColumn = "channelName";
                    break;
                case 2:
                    param.orderColumn = "day";
                    break;
                case 3:
                    param.orderColumn = "activity";
                    break;
                case 4:
                    param.orderColumn = "display";
                    break;
                case 5:
                    param.orderColumn = "click";
                    break;
                case 6:
                    param.orderColumn = "consume";
                    break;
                case 7:
                    param.orderColumn = "price";
                    break;
                case 8:
                    param.orderColumn = "payType";
                    break;
                default:
                    break;
            }
            param.orderDir = data.order[0].dir;
        }
        //组装查询参数
        var channel = $channelIdQuery.select2("data")[0];
        if (channel !== undefined) {
            param.channelId = channel.id;
        }
        var startDay = $("#startDay").datepicker('getDate');
        if (startDay !== null) {
            param.startDay = moment(startDay).format("YYYYMMDD");
        }
        var endDay = $("#endDay").datepicker('getDate');
        if (endDay !== null) {
            param.endDay = moment(endDay).format("YYYYMMDD");
        }
        //组装分页参数
        param.draw = data.draw;
        param.page = data.start/data.length+1;
        param.rows = data.length;
        return param;
    }

    var $wrapper = $("#div-table-container");
    var $table = $("#table-datacenter");
    var _table = $table.dataTable($.extend(true,{},CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
            //手动控制遮罩
            $wrapper.spinModal("small");
            NProgress.start();
            //封装请求参数
            var param = getQueryCondition(data);
            $.ajax({
                type: "get",
                url: ctxPath+"/api/home/datacenter/everyday",
                cache : false,  //禁用缓存
                data: param,    //传入已封装的参数
                dataType: "json",
                success: function(result, textStatus, jqXHR) {
                    var returnData = {};
                    returnData.draw = parseInt(jqXHR.getResponseHeader("x-app-draw"));//datatables插件需要
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
                data: "parentChannelName",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "channelName",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "day",
                className : "ellipsis",
                render: function (data, type, row, meta) {
                    return moment(data.toString(), "YYYYMMDD").format("YYYY-MM-DD");
                }
            },
            {
                data: "activity",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "display",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "click",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "consume",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.TWO_DECIMAL_POINTS,
            },
            {
                data : "price",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "payType",
                className : "ellipsis",
                render: function (data, type, row, meta) {
                    if (data === 0) return "cpm";
                    if (data === 1) return "cpc";
                    if (data === 2) return "cpa";
                    return "";
                }
            }
        ],
        "createdRow": function (row, data, index ) {
        },
        "drawCallback": function( settings ) {
        }
    })).api();

    // 具体字段查询
    $("#form-datacenter-query").submit(function(){
        _table.order([]);
        _table.draw();
        _table2.order([]);
        _table2.draw();
        return false;
    });

    //行点击事件
    $("tbody",$table).on("click","tr",function(event) {
        $(this).addClass("info").siblings().removeClass("info");
    });

    function getQueryCondition2(data) {
        var param = {};
        //组装排序参数
        if (data.order&&data.order.length&&data.order[0]) {
            switch (data.order[0].column) {
                case 0:
                    param.orderColumn = "parentChannelName";
                    break;
                case 1:
                    param.orderColumn = "channelName";
                    break;
                case 2:
                    param.orderColumn = "totalActivity";
                    break;
                case 3:
                    param.orderColumn = "totalDisplay";
                    break;
                case 4:
                    param.orderColumn = "totalClick";
                    break;
                case 5:
                    param.orderColumn = "totalConsume";
                    break;
                case 6:
                    param.orderColumn = "price";
                    break;
                case 7:
                    param.orderColumn = "payType";
                    break;
                default:
                    break;
            }
            param.orderDir = data.order[0].dir;
        }
        //组装查询参数
        var channel = $channelIdQuery.select2("data")[0];
        if (channel !== undefined) {
            param.channelId = channel.id;
        }
        //组装分页参数
        param.draw = data.draw;
        param.page = data.start/data.length+1;
        param.rows = data.length;
        return param;
    }

    var $wrapper2 = $("#div-table-container");
    var $table2 = $("#table-channel");
    var _table2 = $table2.dataTable($.extend(true,{},CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
            //手动控制遮罩
            $wrapper2.spinModal("small");
            NProgress.start();
            //封装请求参数
            var param = getQueryCondition2(data);
            $.ajax({
                type: "get",
                url: ctxPath+"/api/home/datacenter/total",
                cache : false,  //禁用缓存
                data: param,    //传入已封装的参数
                dataType: "json",
                success: function(result, textStatus, jqXHR) {
                    var returnData = {};
                    returnData.draw = parseInt(jqXHR.getResponseHeader("x-app-draw"));//datatables插件需要
                    returnData.recordsTotal = result.total;
                    returnData.recordsFiltered = result.total;//后台只统计过滤后的总数
                    returnData.data = result.list;
                    //关闭遮罩
                    $wrapper2.spinModal(false);
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
                    $wrapper2.spinModal(false);
                    NProgress.done();
                }
            });
        },
        columns: [
            //CONSTANT.DATA_TABLES.COLUMN.CHECKBOX,
            {
                data: "parentChannelName",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "channelName",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "totalActivity",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "totalDisplay",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "totalClick",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "totalConsume",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.TWO_DECIMAL_POINTS,
            },
            {
                data : "price",
                className : "ellipsis",
                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS,
            },
            {
                data: "payType",
                className : "ellipsis",
                render: function (data, type, row, meta) {
                    if (data === 0) return "cpm";
                    if (data === 1) return "cpc";
                    if (data === 2) return "cpa";
                    return "";
                }
            }
        ],
        "createdRow": function (row, data, index ) {
        },
        "drawCallback": function( settings ) {
        }
    })).api();

    //行点击事件
    $("tbody",$table2).on("click","tr",function(event) {
        $(this).addClass("info").siblings().removeClass("info");
    });

});

