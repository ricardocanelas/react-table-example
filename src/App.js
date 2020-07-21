import React, { useCallback, useState, useRef } from "react";
import SearchForm from "./components/SearchForm";
import Table from "./components/Table";

const columns = [
  { Header: "Firstname", accessor: "firstName" },
  { Header: "Lastname", accessor: "lastName" },
  { Header: "Age", accessor: "age" },
];

function App() {
  const previousRequest = useRef({});
  const fetchIdRef = useRef(0);
  const [state, setState] = useState({
    data: [],
    loading: true,
    pageCount: 0,
    filter: { q: "" },
  });

  const submit = (values) => {
    setState((state) => ({ ...state, filter: { q: values.q.trim() } }));
  };

  const onFetchData = useCallback((params, previousParams) => {
    const fetchId = ++fetchIdRef.current;
    setState((state) => ({ ...state, loading: true }));

    console.log("[previous]", previousParams);
    if (previousParams) {
      if (params.q !== previousParams.filter.q) {
        params.pageIndex = 0;
      }
    }

    fetch("http://example.com/users", { params })
      .then((res) => res.json())
      .then((result) => {
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
          previousRequest.current = params;
          setState((state) => ({
            ...state,
            loading: false,
            data: result.data,
            pageCount: result.pageCount,
            pageIndex: params.pageIndex, // TODO
          }));
        }
      });
  }, []);

  return (
    <div className="container">
      <SearchForm onSubmit={submit} />
      <Table
        className="mt-3"
        columns={columns}
        data={state.data}
        filter={state.filter}
        onFetchData={onFetchData}
        pageCount={state.pageCount}
        pageIndex={state.pageIndex}
        loading={state.loading}
        options={{
          itemsPerPage: [5, 10, 20, 30, 40],
        }}
        renderLoading={() => <div style={{ minHeight: 205 }}>Loading...</div>}
        renderEmpty={() => <div style={{ minHeight: 205 }}>Not Found...</div>}
      />
    </div>
  );
}

export default App;
