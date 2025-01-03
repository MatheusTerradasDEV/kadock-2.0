import { Edit2, Trash2 } from 'lucide-react';
import { Fabric } from '../../types';

interface InventoryTableProps {
  fabrics: Fabric[];
  onEdit: (fabric: Fabric) => void;
  onDelete: (id: string, name: string) => void;
}

export default function InventoryTable({ fabrics, onEdit, onDelete }: InventoryTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-200">
        <thead className="bg-gray-50 dark:bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Subtipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Fornecedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Cor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Quantidade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-white divide-y divide-gray-200 dark:divide-gray-200">
          {fabrics.map((fabric) => (
            <tr key={fabric.id} className="hover:bg-gray-50 ">
              <td className="px-6 py-4 whitespace-nowrap">{fabric.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{fabric.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{fabric.subType}</td>
              <td className="px-6 py-4 whitespace-nowrap">{fabric.supplier}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className="h-4 w-4 rounded-full mr-2"
                    style={{ backgroundColor: fabric.color }}
                  />
                  {fabric.color}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                R$ {fabric.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{fabric.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    fabric.quantity <= fabric.minQuantity
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {fabric.quantity <= fabric.minQuantity ? 'Estoque Baixo' : 'Em Estoque'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(fabric)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(fabric.id, fabric.name)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}