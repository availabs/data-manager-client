import React from "react"

import { Button } from "./parts"

const getPageSpread = (page, maxPage) => {
	let low = page - 2,
		high = page + 2;

	if (low < 0) {
		high += -low;
		low = 0;
	}
	if (high > maxPage) {
		low -= (high - maxPage);
		high = maxPage;
	}
	return d3array.range(Math.max(0, low), Math.min(maxPage, high) + 1);
}

class DmsTable extends React.Component {
  static defaultProps = {
    data: [],
    keys: [],
    rowsPerPage: 10
  }
  state = { page: 0 }
  setPage(page) {
    this.setState({ page });
  }
  incPage(inc) {
    this.setPage(this.state.page + inc);
  }
	getKeys() {
		let { keys, data } = this.props;
		if (!keys.length && data.length) {
			keys = Object.keys(data[0]);
		}
		return keys.map(k => typeof key === "string" ? { key } : k);
	}
  render() {
		let { page } = this.state;
		const { rowsPerPage } = this.props,
			maxPage = Math.max(Math.ceil(data.length / rowsPerPage) - 1, 0),
			length = data.length;
		page = Math.min(maxPage, page);

		const keys = this.getKeys(),
      data = this.props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <div>
        <div className="btn-group-horizontal">

  				<Button onClick={ () => this.setPage(0) }
  					disabled={ page === 0 }>
            { "<<" }
  				</Button>
  				<Button onClick={ () => this.incPage(-1) }
  					disabled={ page === 0 }>
            { "<" }
  				</Button>
  				{
  					getPageSpread(page, maxPage)
  						.map(p =>
  							<Button key={ p }
  								disabled={ p === page }
  								onClick={ () => this.setPage(p) }>
  								{ p + 1 }
  							</Button>
  						)
  				}
  				<Button onClick={ () => this.incPage(1) }
  					disabled={ page === maxPage }>
            { ">" }
  				</Button>
  				<Button onClick={ () => this.setPage(maxPage) }
  					disabled={ page === maxPage }>
            { ">>" }
  				</Button>

        </div>
        <table>
          <thead>
            <tr>
              { keys.map(({ key, show }) =>
                  <th key={ key }>{ show ? key : "" }</th>
                )
              }
            </tr>
          </thead>
          <tbody>
            { data.map((d, i) =>
                <tr key={ i }>
                  { keys.map(({ key }) =>
                      <td key={ key }>{ d[key] }</td>
                    )
                  }
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}
