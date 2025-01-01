import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { Fabric } from '../types';
import AddFabricModal from '../components/inventory/AddFabricModal';
import EditFabricModal from '../components/inventory/EditFabricModal';
import SearchAndFilter from '../components/shared/searchAndFilter';

export default function Inventory() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);

  useEffect(() => {
    fetchFabrics();
  }, []);

  const fetchFabrics = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'fabrics'));
      const fabricsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Fabric[];
      setFabrics(fabricsData);
    } catch (error) {
      console.error('Error fetching fabrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tecido?')) {
      try {
        await deleteDoc(doc(db, 'fabrics', id));
        setFabrics(fabrics.filter(f => f.id !== id));
      } catch (error) {
        console.error('Error deleting fabric:', error);
      }
    }
  };

  const filteredFabrics = fabrics.filter(fabric => {
    const matchesSearch = fabric.name.toLowerCase().includes(search.toLowerCase()) ||
      fabric.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = !selectedType || fabric.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventário</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Tecido
        </button>
      </div>

      <div className="mb-6">
        <SearchAndFilter
          onSearch={setSearch}
          onTypeSelect={setSelectedType}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFabrics.map((fabric) => (
              <tr key={fabric.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{fabric.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{fabric.type}</td>
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
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {fabric.quantity <= fabric.minQuantity ? 'Estoque Baixo' : 'Em Estoque'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingFabric(fabric)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(fabric.id)}
                      className="text-red-600 hover:text-red-900"
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

      {showAddModal && (
        <AddFabricModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchFabrics();
          }}
        />
      )}

      {editingFabric && (
        <EditFabricModal
          fabric={editingFabric}
          onClose={() => setEditingFabric(null)}
          onSuccess={() => {
            setEditingFabric(null);
            fetchFabrics();
          }}
        />
      )}
    </div>
  );
}