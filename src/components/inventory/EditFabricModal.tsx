import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { Fabric } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { handleLowStockNotification } from '../../services/notificationService';

interface EditFabricModalProps {
  fabric: Fabric;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditFabricModal({ fabric, onClose, onSuccess }: EditFabricModalProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: fabric.name,
    type: fabric.type,
    color: fabric.color,
    price: fabric.price.toString(),
    quantity: fabric.quantity.toString(),
    minQuantity: fabric.minQuantity.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updatedFabric = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        minQuantity: Number(formData.minQuantity),
        updatedAt: new Date(),
        lastModifiedBy: user.id,
      };

      const fabricRef = doc(db, 'fabrics', fabric.id);
      await updateDoc(fabricRef, updatedFabric);

      // Check if stock is low after update
      if (Number(formData.quantity) <= Number(formData.minQuantity)) {
        await handleLowStockNotification(formData.name, Number(formData.quantity), user);
      }

      onSuccess();
    } catch (error) {
      console.error('Error updating fabric:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Tecido</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cor</label>
            <input
              type="color"
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              required
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade Mínima</label>
            <input
              type="number"
              required
              min="0"
              value={formData.minQuantity}
              onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}