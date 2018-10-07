$(function(){

    $('.input-daterange').datepicker({
        autoclose: true,
        language: "zh-CN",
        // todayHighlight: true,
        clearBtn: true,
        format: "yyyy-mm-dd",
        container: "#datepicker"
    });

    function getQueryCondition(data) {
        var param = {};
        //组装排序参数
        if (data.order&&data.order.length&&data.order[0]) {
            switch (data.order[0].column) {
                case 0:
                    param.orderColumn = "day";
                    break;
                case 1:
                    param.orderColumn = "totalActivity";
                    break;
                case 2:
                    param.orderColumn = "totalDisplay";
                    break;
                case 3:
                    param.orderColumn = "totalClick";
                    break;
                case 4:
                    param.orderColumn = "totalConsume";
                    break;
                default:
                    break;
            }
            param.orderDir = data.order[0].dir;
        }
        //组装查询参数
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
    var $table = $("#table-day");
    var _table = $table.dataTable($.extend(true,{},CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
            //手动控制遮罩
            $wrapper.spinModal("small");
            NProgress.start();
            //封装请求参数
            var param = getQueryCondition(data);
            $.ajax({
                type: "get",
                url: ctxPath+"/api/statistics/day/list",
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
                data: "day",
                className : "ellipsis",
                render: function (data, type, row, meta) {
                    return moment(data.toString(), "YYYYMMDD").format("YYYY-MM-DD");
                }
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
            }
        ],
        "createdRow": function (row, data, index ) {
        },
        "drawCallback": function( settings ) {
        }
    })).api();

    // 具体字段查询
    $("#form-day-query").submit(function(){
        _table.order([]);
        _table.draw();
        return false;
    });

    //行点击事件
    $("tbody",$table).on("click","tr",function(event) {
        $(this).addClass("info").siblings().removeClass("info");
    });

});

