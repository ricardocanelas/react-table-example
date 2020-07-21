const usePaginationRange = (hooks) => {
  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
};

function useInstance(instance) {
  let pageRange = instance.state.pageRange;
  let currentPage = instance.state.pageIndex + 1;
  let totalPage = instance.pageCount;
  let ranges = [];

  let rangeStart = currentPage - pageRange;
  let rangeEnd = currentPage + pageRange;

  if (rangeEnd > totalPage) {
    rangeEnd = totalPage;
    rangeStart = totalPage - pageRange * 2;
    rangeStart = rangeStart < 1 ? 1 : rangeStart;
  }

  if (rangeStart <= 1) {
    rangeStart = 1;
    rangeEnd = Math.min(pageRange * 2 + 1, totalPage);
  }

  let i = 0;
  if (rangeStart <= 3) {
    for (i = 1; i < rangeStart; i++) {
      ranges.push(i);
    }
  } else {
    ranges.push(1);
    ranges.push("...");
  }

  for (i = rangeStart; i <= rangeEnd; i++) {
    ranges.push(i);
  }

  if (rangeEnd >= totalPage - 2) {
    for (i = rangeEnd + 1; i <= totalPage; i++) {
      ranges.push(i);
    }
  } else {
    ranges.push("...");
    ranges.push(totalPage);
  }

  Object.assign(instance, {
    pageRanges: ranges,
  });
}

function reducer(state) {
  return {
    pageRange: state.pageRange || 2,
    ...state,
  };
}

usePaginationRange.pluginName = "usePaginationRange";

export default usePaginationRange;
