import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { Fabric } from '../types';
import { toast } from 'react-hot-toast';
import { FABRIC_CATEGORIES } from '../components/constants/categories';
import AddFabricModal from '../components/inventory/AddFabricModal';
import EditFabricModal from '../components/inventory/EditFabricModal';
import SearchAndFilter from '../components/shared/searchAndFilter';
import InventoryTable from '../components/inventory/InventoryTable';
import ConfirmModal from '../components/inventory/ConfirmModal';
import { useLocation } from 'react-router-dom';

export default function Inventory() {
  const location = useLocation();
  const initialCategory = location.state?.selectedCategory || null;
  
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(initialCategory);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fabricToDelete, setFabricToDelete] = useState<{ id: string, name: string } | null>(null);

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

  const handleDelete = async () => {
    if (fabricToDelete) {
      try {
        await deleteDoc(doc(db, 'fabrics', fabricToDelete.id));
        setFabrics(fabrics.filter(f => f.id !== fabricToDelete.id));
        toast.success(`${fabricToDelete.name} excluído com sucesso!`);
      } catch (error) {
        toast.error('Erro ao excluir o tecido');
      } finally {
        setShowConfirmModal(false);
        setFabricToDelete(null);
      }
    }
  };

  const openConfirmModal = (id: string, name: string) => {
    setFabricToDelete({ id, name });
    setShowConfirmModal(true);
  };

  const filteredFabrics = fabrics.filter(fabric => {
    const matchesSearch = fabric.name.toLowerCase().includes(search.toLowerCase()) ||
      fabric.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = !selectedType || fabric.type === selectedType;
    const matchesSubType = !selectedSubType || fabric.subType === selectedSubType;
    return matchesSearch && matchesType && matchesSubType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Inventário</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Tecido
        </button>
      </div>

      <SearchAndFilter
        onSearch={setSearch}
        onTypeSelect={setSelectedType}
        onSubTypeSelect={setSelectedSubType}
        categories={FABRIC_CATEGORIES}
        selectedType={selectedType}
        selectedSubType={selectedSubType}
      />

      <InventoryTable
        fabrics={filteredFabrics}
        onEdit={setEditingFabric}
        onDelete={openConfirmModal}
      />

      {showAddModal && (
        <AddFabricModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchFabrics();
          }}
          initialCategory={selectedType}
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

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        message="Tem certeza que deseja excluir este tecido?"
      />
    </div>
  );
}