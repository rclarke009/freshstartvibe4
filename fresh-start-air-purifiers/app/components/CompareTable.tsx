import { PurifierModel } from './ResultCard';

interface CompareTableProps {
  models: PurifierModel[];
  onClose?: () => void;
}

export function CompareTable({ models, onClose }: CompareTableProps) {
  const comparisonRows = [
    { label: 'Model', key: 'name' as keyof PurifierModel },
    { label: 'Best For', key: 'excelsAt' as keyof PurifierModel, isArray: true },
    { label: 'Size Guidance', key: 'sizeGuidance' as keyof PurifierModel },
    { label: 'Filter Life', key: 'filterLife' as keyof PurifierModel },
    { label: 'Replacement Cost', key: 'replacementCost' as keyof PurifierModel },
    { label: 'Price', key: 'msrp' as keyof PurifierModel },
  ];

  const renderCellContent = (model: PurifierModel, key: keyof PurifierModel, isArray?: boolean) => {
    const value = model[key];
    
    if (isArray && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }
    
    return <span className="text-gray-900">{String(value)}</span>;
  };

  return (
    <div className="compare-table fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#1e40af]">
            Compare Air Purifiers
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close comparison"
            >
              ×
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 min-w-[200px]">
                  Feature
                </th>
                {models.map((model) => (
                  <th
                    key={model.id}
                    className="px-6 py-4 text-center text-sm font-medium text-gray-900 min-w-[250px]"
                  >
                    <div className="flex flex-col items-center">
                      <div className="font-bold text-[#1e40af] mb-1">
                        {model.name}
                      </div>
                      {model.imageUrl && (
                        <img
                          src={model.imageUrl}
                          alt={model.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparisonRows.map((row) => (
                <tr key={row.label} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                    {row.label}
                  </td>
                  {models.map((model) => (
                    <td key={model.id} className="px-6 py-4 text-sm text-gray-700">
                      {renderCellContent(model, row.key, row.isArray)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
