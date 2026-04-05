import React from 'react';

const Table = ({ columns, data, keyField = '_id', page, pages, setPage }) => {
  return (
    <>
      <div className="table-responsive">
        <table className="crm-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} style={col.style || {}}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-muted-crm">No records found.</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row[keyField]}>
                  {columns.map((col, index) => (
                    <td key={index}>{col.render ? col.render(row) : row[col.accessor]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted-crm">Page {page} of {pages}</small>
          <ul className="pagination pagination-sm crm-pagination mb-0">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            </li>
            {[...Array(pages).keys()].map(x => (
              <li key={x + 1} className={`page-item ${page === x + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(x + 1)}>{x + 1}</button>
              </li>
            ))}
            <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => Math.min(pages, p + 1))}>Next</button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Table;
