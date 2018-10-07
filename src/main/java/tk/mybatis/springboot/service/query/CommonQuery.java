package tk.mybatis.springboot.service.query;

public class CommonQuery {

	// to do
	// 是否添加默认值
	private Integer page = 1;

	private Integer rows = 10;

	private String orderColumn;

	private String orderDir;

	// 配合 datatables 添加
	private Integer draw;

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getRows() {
		return rows;
	}

	public void setRows(Integer rows) {
		this.rows = rows;
	}

	public String getOrderColumn() {
		return orderColumn;
	}

	public void setOrderColumn(String orderColumn) {
		this.orderColumn = orderColumn;
	}

	public String getOrderDir() {
		return orderDir;
	}

	public void setOrderDir(String orderDir) {
		this.orderDir = orderDir;
	}

	public Integer getDraw() {
		return draw;
	}

	public void setDraw(Integer draw) {
		this.draw = draw;
	}

	@Override
	public String toString() {
		return "CommonQuery [page=" + page + ", rows=" + rows + ", orderColumn=" + orderColumn + ", orderDir="
				+ orderDir + ", draw=" + draw + "]";
	}

}
