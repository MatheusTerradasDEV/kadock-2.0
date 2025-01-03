import { Link } from 'react-router-dom';
import { Fabric } from '../../types';

interface LowStockListProps {
  fabrics: Fabric[];
}

export default function LowStockList({ fabrics }: LowStockListProps) {
  if (fabrics.length === 0) {
    return <p className="text-gray-500">Nenhum tecido com estoque baixo.</p>;
  }

  return (
    <div className="space-y-4">
      {fabrics.map(fabric => (
        <Link
          key={fabric.id}
          to="/low-stock"
          className="block"
        >
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div>
              <h3 className="font-medium text-red-900">{fabric.name}</h3>
              <p className="text-sm text-red-700">
                Estoque: {fabric.quantity} | Mínimo: {fabric.minQuantity}
              </p>
            </div>
            <span className="px-3 py-1 text-sm text-red-900 bg-red-100 rounded-full">
              Repor Estoque
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}