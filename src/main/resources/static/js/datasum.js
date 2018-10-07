$(function() {

    function refreshSumData() {
        $.ajax({
            type: "get",
            url: ctxPath+"/api/home/datasum/total",
            cache : false,  //禁用缓存
            dataType: "json",
            success: function(result, textStatus, jqXHR) {
                $("#totalConsume").text(result.totalConsume.toFixed(2));
                $("#totalClick").text(result.totalClick);
                $("#totalDisplay").text(result.totalDisplay);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                var d = dialog({
                    content:'<div class="king-notice-box king-notice-fail"><p class="king-notice-text">'+iMsg.queryFail+'</p></div>'
                });
                d.show();
                setTimeout(function() {
                    d.close().remove();
                }, 1500);
            }
        });
    }

    refreshSumData();

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
        placeholder:'全部渠道汇总',
        allowClear:true,
        minimumResultsForSearch:-1,
        language:iMsg.select2LangCode,
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatChannel,
        templateSelection: formatChannelSelection
    });

    $("#days").select2({
        minimumResultsForSearch:-1,
        language:iMsg.select2LangCode
    });

    var chartA = echarts.init(document.getElementById('chartA'),'macarons');
    var chartB = echarts.init(document.getElementById('chartB'),'macarons');
    var chartC = echarts.init(document.getElementById('chartC'),'macarons');
    var chartD = echarts.init(document.getElementById('chartD'),'macarons');

    var optionA = {
        title : {
            text: '报名趋势'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['报名数']
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        xAxis : [
            {
                type : 'category'
            }
        ],
        yAxis : [
            {
                type : 'value',
                min: 0
            }
        ],
        series : [
            {
                name:'报名数',
                type:'line',
                showAllSymbol: true,
                smooth: true,
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    var optionB = {
        title : {
            text: '展示趋势'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['展示数']
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        xAxis : [
            {
                type : 'category'
            }
        ],
        yAxis : [
            {
                type : 'value',
                min: 0
            }
        ],
        series : [
            {
                name:'展示数',
                type:'line',
                showAllSymbol: true,
                smooth: true,
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    var optionC = {
        title : {
            text: '点击趋势'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['点击数']
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        xAxis : [
            {
                type : 'category'
            }
        ],
        yAxis : [
            {
                type : 'value',
                min: 0
            }
        ],
        series : [
            {
                name:'点击数',
                type:'line',
                showAllSymbol: true,
                smooth: true,
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    var optionD = {
        title : {
            text: '消费趋势'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['消费金额']
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        xAxis : [
            {
                type : 'category'
            }
        ],
        yAxis : [
            {
                type : 'value',
                min: 0
            }
        ],
        series : [
            {
                name:'消费金额',
                type:'line',
                showAllSymbol: true,
                smooth: true,
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };

    function refreshChart() {
        var param = {};
        var channel = $channelIdQuery.select2("data")[0];
        if (channel !== undefined) {
            param.channelId = channel.id;
        }
        param.days = $("#days").val();
        $.ajax({
            type: "get",
            url: ctxPath+"/api/home/datasum/datatrend",
            cache : false,
            data: param,
            dataType: "json",
            beforeSend: function() {
                chartA.showLoading();
                chartB.showLoading();
                chartC.showLoading();
                chartD.showLoading();
            },
            success: function(result, textStatus, jqXHR) {
                var key = result.key;
                var val = result.val;
                optionA.xAxis[0].data = key;
                optionB.xAxis[0].data = key;
                optionC.xAxis[0].data = key;
                optionD.xAxis[0].data = key;
                optionA.series[0].data = val.activity;
                optionB.series[0].data = val.display;
                optionC.series[0].data = val.click;
                optionD.series[0].data = val.consume;
                chartA.hideLoading();
                chartB.hideLoading();
                chartC.hideLoading();
                chartD.hideLoading();
                chartA.setOption(optionA, true);
                chartB.setOption(optionB, true);
                chartC.setOption(optionC, true);
                chartD.setOption(optionD, true);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                var d = dialog({
                    content:'<div class="king-notice-box king-notice-fail"><p class="king-notice-text">'+iMsg.queryFail+'</p></div>'
                });
                d.show();
                setTimeout(function() {
                    d.close().remove();
                }, 1500);
            }
        });
    }

    refreshChart();

    $("#form-datatrend-query").submit(function(){
        refreshChart();
        return false;
    });

    // echarts 自动调节宽度
    $(window).resize(function() {
        chartA.resize();
        chartB.resize();
        chartC.resize();
        chartD.resize();
    });

});