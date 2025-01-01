import { Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface SearchAndFilterProps {
  onSearch: (value: string) => void;
  onTypeSelect: (type: string | null) => void;
}

export default function SearchAndFilter({ onSearch, onTypeSelect }: SearchAndFilterProps) {
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      const q = query(collection(db, 'fabrics'));
      const snapshot = await getDocs(q);
      const uniqueTypes = new Set(
        snapshot.docs.map(doc => doc.data().type as string)
      );
      setTypes(Array.from(uniqueTypes).sort());
    };

    fetchTypes();
  }, []);

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    onTypeSelect(type);
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar tecidos..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center px-4 py-2.5 bg-white border ${
            selectedType ? 'border-blue-500 text-blue-600' : 'border-gray-200'
          } rounded-lg shadow-sm hover:bg-gray-50 transition-colors`}
        >
          <Filter className={`h-5 w-5 mr-2 ${selectedType ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="font-medium">
            {selectedType || 'Filtrar por tipo'}
          </span>
        </button>

        {isFilterOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
            <button
              onClick={() => handleTypeSelect(null)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                !selectedType ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
              }`}
            >
              Todos os tipos
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                  selectedType === type ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}