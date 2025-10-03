import { Link } from '@remix-run/react';

export interface PurifierModel {
  id: string;
  name: string;
  slug: string;
  whyFit: string;
  excelsAt: string[];
  sizeGuidance: string;
  filterLife: string;
  replacementCost: string;
  msrp: string;
  imageUrl?: string;
}

interface ResultCardProps {
  model: PurifierModel;
  rank: number;
  onAddToCompare?: (model: PurifierModel) => void;
  onAddToCart?: (model: PurifierModel) => void;
}

export function ResultCard({ model, rank, onAddToCompare, onAddToCart }: ResultCardProps) {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Best Match</span>;
      case 2:
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Great Option</span>;
      case 3:
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Also Consider</span>;
      default:
        return null;
    }
  };

  return (
    <div className="result-card bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-[#1e40af]">
              {model.name}
            </h3>
            {getRankBadge(rank)}
          </div>
          <p className="text-gray-700 mb-4">
            {model.whyFit}
          </p>
        </div>
        {model.imageUrl && (
          <div className="w-20 h-20 ml-4 flex-shrink-0">
            <img
              src={model.imageUrl}
              alt={model.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Excels At Chips */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {model.excelsAt.map((skill) => (
            <span
              key={skill}
              className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Size:</span>
            <span className="ml-2 text-gray-700">{model.sizeGuidance}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Filter Life:</span>
            <span className="ml-2 text-gray-700">{model.filterLife}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Replacement Cost:</span>
            <span className="ml-2 text-gray-700">{model.replacementCost}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Price:</span>
            <span className="ml-2 text-gray-700 font-semibold">{model.msrp}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={`/products/${model.slug}`}
          className="add-to-cart-button text-center flex-1"
        >
          View Product Details
        </Link>
        
        {onAddToCompare && (
          <button
            onClick={() => onAddToCompare(model)}
            className="px-6 py-3 border-2 border-[#1e40af] text-[#1e40af] rounded-xl hover:bg-[#1e40af] hover:text-white transition-colors font-medium"
          >
            Compare
          </button>
        )}
        
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(model)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
