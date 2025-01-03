import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Check, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AddInTransitModal from '../components/transit/AddInTransitModal';
import InTransitTable from '../components/transit/InTransitTable';
import SearchAndFilter from '../components/shared/searchAndFilter';
import { FABRIC_CATEGORIES } from '../components/constants/categories';

interface InTransitItem {
  id: string;
  fabricName: string;
  fabricType: string;
  supplier: string;
  quantity: number;
  expectedDate: string;
}

export default function InTransit() {
  const [inTransitItems, setInTransitItems] = useState<InTransitItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);

  useEffect(() => {
    fetchInTransitItems();
  }, []);

  const fetchInTransitItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'inTransit'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InTransitItem[];
      setInTransitItems(items);
    } catch (error) {
      console.error('Error fetching in-transit items:', error);
      toast.error('Erro ao carregar itens em trânsito');
    }
  };

  const filteredItems = inTransitItems.filter(item => {
    const matchesSearch = item.fabricName.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesType = !selectedType || item.fabricType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Tecidos a Caminho</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Pedido
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

      <InTransitTable
        items={filteredItems}
        onRefresh={fetchInTransitItems}
      />

      {showAddModal && (
        <AddInTransitModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchInTransitItems();
          }}
        />
      )}
    </div>
  );
}