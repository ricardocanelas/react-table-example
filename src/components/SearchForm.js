import React from "react";

function SearchForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({ q: formData.get("q") });
  };

  return (
    <div className="row">
      <div className="col-4">
        <form className="d-flex" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="search"
              name="q"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm ml-2">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchForm;
