import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import usePaginationRange from "./usePaginationRange";
import { useTable, useSortBy, usePagination } from "react-table";

const Table = (props) => {
  const {
    className,
    columns,
    data,
    filter,
    onFetchData,
    initialState,
    pageCount: controlledPageCount,
    loading,
    options,
  } = props;

  const tableInstance = useTable(
    {
      columns,
      data: loading ? [] : data,
      manualSortBy: true,
      manualPagination: true,
      pageCount: controlledPageCount,
      initialState,
    },
    useSortBy,
    usePagination,
    usePaginationRange
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { sortBy, pageIndex, pageSize },
  } = tableInstance;

  const {
    page, // instead use 'rows', we'll use 'page'
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageRanges,
  } = tableInstance;

  const previousParams = useRef(null);

  // When these table states change, fetch new data!
  useEffect(() => {
    let hasFilterChanged = false;

    if (previousParams.current) {
      hasFilterChanged = Object.keys(previousParams.current.filter).some(
        (key) => {
          return previousParams.current.filter[key] !== filter[key];
        }
      );
    }

    const params = { sortBy, pageIndex, pageSize, filter, hasFilterChanged };

    if (hasFilterChanged && pageIndex !== 0) {
      previousParams.current = params;
      return gotoPage(0);
    }

    if (onFetchData) onFetchData(params, previousParams.current);

    previousParams.current = params;
  }, [gotoPage, onFetchData, sortBy, pageIndex, pageSize, filter]);

  return (
    <>
      <table {...getTableProps()} className={`table ${className}`}>
        {/* COLUMNS */}
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={`col-${column.id}`}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* ROWS */}
        <tbody {...getTableBodyProps()}>
          {!loading &&
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={`col-${cell.column.id}`}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* NOT FOUND */}
      {!loading && data && data.length === 0 && props.renderEmpty()}

      {/* LOADING */}
      {loading && props.renderLoading()}

      {/* PAGINATION */}
      <div className="d-flex justify-content-between">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${canPreviousPage ? "" : "disabled"}`}>
              <button className="page-link" onClick={() => gotoPage(0)}>
                First Page
              </button>
            </li>
            <li className={`page-item ${canPreviousPage ? "" : "disabled"}`}>
              <button className="page-link" onClick={() => previousPage()}>
                Preview
              </button>
            </li>
            {pageRanges.map((i, index) => {
              const gotoPageIndex = i === "..." ? pageRanges[index - 1] : i - 1;
              return (
                <li
                  key={index}
                  className={`page-item ${
                    pageIndex === i - 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => gotoPage(gotoPageIndex)}
                  >
                    {i}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${canNextPage ? "" : "disabled"}`}>
              <button className="page-link" onClick={() => nextPage()}>
                Next
              </button>
            </li>
            <li className={`page-item ${canNextPage ? "" : "disabled"}`}>
              <button
                className="page-link"
                onClick={() => gotoPage(pageCount - 1)}
              >
                Last Page
              </button>
            </li>
            <li className="page-item p-2 pl-3">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </li>
          </ul>
        </nav>
        {options.itemsPerPage && Array.isArray(options.itemsPerPage) && (
          <div className="d-flex">
            <div className="form-group">
              <select
                value={pageSize}
                className="form-control"
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {options.itemsPerPage.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Table.defaultProps = {
  className: "",
  columns: [],
  data: [],
  onFetchData: null,
  total: 0,
  initialState: {
    pageIndex: 0,
    pageSize: 5,
    pageRange: 2,
  },
  options: {
    itemsPerPage: [10, 30, 50],
  },
  filter: {},
  renderLoading: () => <div>loading...</div>,
  renderEmpty: () => <div>empty</div>,
};

Table.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  onFetchData: PropTypes.func,
  total: PropTypes.number,
  initialState: PropTypes.shape({
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    pageRange: PropTypes.number,
  }),
  options: PropTypes.shape({
    itemsPerPage: PropTypes.arrayOf(PropTypes.number),
  }),
  filter: PropTypes.shape({}),
  renderLoading: PropTypes.func,
};

export default Table;
