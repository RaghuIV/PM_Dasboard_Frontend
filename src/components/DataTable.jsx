export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th key={col} className="border px-4 py-2 text-left">{col}</th>
            ))}
            {(onEdit || onDelete) && <th className="border px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={col} className="border px-4 py-2">{row[col]}</td>
              ))}
              {(onEdit || onDelete) && (
                <td className="border px-4 py-2 space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
