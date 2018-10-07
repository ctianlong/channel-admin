/*常量*/
var CONSTANT = {
        DATA_TABLES : {
            DEFAULT_OPTION : { //DataTables初始化选项
                language: {
                    "sProcessing":   iMsg.sProcessing,
                    "sLengthMenu":   iMsg.sLengthMenu,
                    "sZeroRecords":  iMsg.sZeroRecords,
                    "sInfo":         iMsg.sInfo,
                    "sInfoEmpty":    iMsg.sInfoEmpty,
                    "sInfoFiltered": iMsg.sInfoFiltered,
                    "sInfoPostFix":  iMsg.sInfoPostFix,
                    "sSearch":       iMsg.sSearch,
                    "sUrl":          iMsg.sUrl,
                    "sEmptyTable":   iMsg.sEmptyTable,
                    "sLoadingRecords": iMsg.sLoadingRecords,
                    "sInfoThousands":  iMsg.sInfoThousands,
                    "oPaginate": {
                        "sFirst":    iMsg.sFirst,
                        "sPrevious": iMsg.sPrevious,
                        "sNext":     iMsg.sNext,
                        "sLast":     iMsg.sLast,
                        "sJump":     iMsg.sJump
                    },
                    "oAria": {
                        "sSortAscending":  iMsg.sSortAscending,
                        "sSortDescending": iMsg.sSortDescending
                    }
                },
                autoWidth: false,   //禁用自动调整列宽
                stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
                order: [],          //取消默认排序查询,否则复选框一列会出现小箭头
                processing: false,  //隐藏加载提示,自行处理
                serverSide: true,   //启用服务器端分页
                searching: false,    //禁用原生搜索
                // scrollX: true
            },
            COLUMN: {
                CHECKBOX: { //复选框单元格
                    className: "td-checkbox",
                    orderable: false,
                    width: "30px",
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<input type="checkbox">';
                    }
                }
            },
            RENDER: {   //常用render可以抽取出来，如日期时间、头像等
                ELLIPSIS: function (data, type, row, meta) {
                    data = data === null ? "" : data;
                    return '<span title="' + data + '">' + data + '</span>';
                },
                DATE: function (data, type, row, meta) {
                	var date = new Date(data);
                	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                },
                SCIENTIFIC_NOTATION: function (data, type, row, meta) {
                	if(data != null){
                		return '<span title="' + data.toExponential() + '">' + data.toExponential(2) + '</span>';
                	}
                	return "";
                },
                TWO_DECIMAL_POINTS: function (data, type, row, meta) {
                    if(data != null){
                        return '<span title="' + data.toFixed(2) + '">' + data.toFixed(2) + '</span>';
                    }
                    return "";
                }
            }
        }
};
/*渲染代码表辅助函数*/
function handleCd(cd, data){
	if(data){
		for(var i in cd) {
			if(cd[i].id==data)
				return cd[i].text;
		}
	}
	return "";
}