import fetchMock from "fetch-mock";
import makeData from "./makeData";
import { sortWith, descend, ascend, prop } from "ramda";

const data = makeData(72);

fetchMock.get(
  "*",
  (_url, opts) => {
    const params = opts ? opts.params : {};
    const q = params.filter && params.filter.q ? params.filter.q : "";
    let result = data;

    console.log("[fetching]", params);

    if (q && q.trim() !== "") {
      result = result.filter((item) => {
        const foundFirstname =
          item.firstName.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        const foundLastname =
          item.lastName.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        const foundAge = item.age === Number(q);
        return foundFirstname || foundLastname || foundAge;
      });
    }

    if (params.sortBy) {
      const sort = sortWith(
        params.sortBy.map((item) => {
          if (item.desc) return descend(prop(item.id));
          return ascend(prop(item.id));
        })
      );
      result = sort(result);
    }

    const total = result.length;

    if (params.pageIndex >= 0 && params.pageSize) {
      const start = params.pageIndex * params.pageSize;
      result = result.slice(start, start + params.pageSize);
    }

    return {
      data: result,
      total: total,
      pageCount: Math.ceil(total / params.pageSize),
    };
  },
  { delay: 1000 }
);
