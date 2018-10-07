$(function() {

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

    // 导出报表
    $("#form-download").submit(function(){
        var param = {};
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
        var url = ctxPath + "/api/home/download/excel?" + $.param(param);
        var link= $('<a href="'+url+'" target="_blank"></a>');
        link.get(0).click();
        return false;
    });

});