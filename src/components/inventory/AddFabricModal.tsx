import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { handleLowStockNotification } from '../../services/notificationService';
import { FABRIC_CATEGORIES, MainCategory } from '../constants/categories';
import { toast } from 'react-hot-toast';

interface AddFabricModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialCategory?: string | null;
}

export default function AddFabricModal({ onClose, onSuccess, initialCategory }: AddFabricModalProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    type: initialCategory || '',
    subType: '',
    supplier: '',
    color: '#000000',
    price: '',
    quantity: '',
    minQuantity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newFabric = {
        name: formData.name,
        type: formData.type,
        subType: formData.subType,
        supplier: formData.supplier,
        color: formData.color,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id,
        lastModifiedBy: user.id,
      };

      await addDoc(collection(db, 'fabrics'), newFabric);

      if (newFabric.quantity <= newFabric.minQuantity) {
        await handleLowStockNotification(newFabric.name, newFabric.quantity, user);
      }

      toast.success('Tecido adicionado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Error adding fabric:', error);
      toast.error('Erro ao adicionar tecido');
    }
  };

  const availableSubTypes = formData.type ? FABRIC_CATEGORIES[formData.type as MainCategory] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-500">Adicionar Tecido</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Categoria</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, subType: '' })}
             className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              {Object.keys(FABRIC_CATEGORIES).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {formData.type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Subcategoria</label>
              <select
                required
                value={formData.subType}
                onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione uma subcategoria</option>
                {availableSubTypes.map((subType) => (
                  <option key={subType} value={subType}>{subType}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Fornecedor</label>
            <input
              type="text"
              required
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Cor</label>
            <input
              type="color"
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Preço</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Quantidade</label>
            <input
              type="number"
              required
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500">Quantidade Mínima</label>
            <input
              type="number"
              required
              min="0"
              value={formData.minQuantity}
              onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-500"
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