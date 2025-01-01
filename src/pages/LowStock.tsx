import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Fabric } from '../types';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditFabricModal from '../components/inventory/EditFabricModal';
import SearchAndFilter from '../components/shared/searchAndFilter';

export default function LowStock() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'fabrics'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fabricsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) as Fabric[];
      const lowStockFabrics = fabricsData.filter(f => f.quantity <= f.minQuantity);
      setFabrics(lowStockFabrics);
    });

    return () => unsubscribe();
  }, []);

  const handleRestock = (fabric: Fabric) => {
    setEditingFabric(fabric);
  };

  const filteredFabrics = fabrics.filter(fabric => {
    const matchesSearch = fabric.name.toLowerCase().includes(search.toLowerCase()) ||
      fabric.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = !selectedType || fabric.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">Tecidos com Estoque Baixo</h1>
      </div>

      <div className="mb-6">
        <SearchAndFilter
          onSearch={setSearch}
          onTypeSelect={setSelectedType}
        />
      </div>
      
      <div className="grid gap-4">
        {filteredFabrics.map(fabric => (
          <div
            key={fabric.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{fabric.name}</h3>
                <p className="text-gray-600 mt-1">Tipo: {fabric.type}</p>
                <div className="mt-3 flex items-center space-x-6">
                  <p className="text-red-600 font-medium">
                    Estoque Atual: {fabric.quantity}
                  </p>
                  <p className="text-gray-600">
                    Estoque Mínimo: {fabric.minQuantity}
                  </p>
                  <p className="text-gray-600">
                    Preço: R$ {fabric.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="h-8 w-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: fabric.color }}
                />
                <button
                  onClick={() => handleRestock(fabric)}
                  className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Repor Estoque
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredFabrics.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Não há tecidos com estoque baixo no momento.
          </p>
        )}
      </div>

      {editingFabric && (
        <EditFabricModal
          fabric={editingFabric}
          onClose={() => setEditingFabric(null)}
          onSuccess={() => {
            setEditingFabric(null);
          }}
        />
      )}
    </div>
  );
}