import { useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { FABRIC_CATEGORIES, MainCategory } from '../constants/categories';

interface AddInTransitModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddInTransitModal({ onClose, onSuccess }: AddInTransitModalProps) {
  const [formData, setFormData] = useState({
    supplier: '',
    fabricName: '',
    fabricType: '',
    subType: '',
    quantity: '',
    expectedDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'inTransit'), {
        ...formData,
        quantity: parseInt(formData.quantity),
        createdAt: new Date(),
      });

      toast.success('Pedido em trânsito registrado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Error adding in-transit item:', error);
      toast.error('Erro ao registrar pedido em trânsito');
    }
  };

  const availableSubTypes = formData.fabricType ? FABRIC_CATEGORIES[formData.fabricType as MainCategory] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-500">Adicionar Pedido em Trânsito</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-500">
              Fornecedor
            </label>
            <input
              type="text"
              required
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-100 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">
              Nome do Tecido
            </label>
            <input
              type="text"
              required
              value={formData.fabricName}
              onChange={(e) => setFormData({ ...formData, fabricName: e.target.value })}
             className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-100 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">
              Tipo do Tecido
            </label>
            <select
              required
              value={formData.fabricType}
              onChange={(e) => setFormData({ ...formData, fabricType: e.target.value, subType: '' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-100 dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione um tipo</option>
              {Object.keys(FABRIC_CATEGORIES).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {formData.fabricType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">
                Subtipo
              </label>
              <select
                required
                value={formData.subType}
                onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-100 dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione um subtipo</option>
                {availableSubTypes.map((subType) => (
                  <option key={subType} value={subType}>{subType}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">
              Quantidade
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-100 dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">
              Data Prevista
            </label>
            <input
              type="date"
              required
              value={formData.expectedDate}
              onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-100 dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}