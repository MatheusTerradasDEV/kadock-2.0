import { useEffect, useState } from 'react';
import { BarChart3, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Fabric } from '../types';
import { FABRIC_CATEGORIES } from '../components/constants/categories';
import StockChart from '../components/dashboard/StockChart';
import LowStockList from '../components/dashboard/LowStockList';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const navigate = useNavigate();

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

      // Calculate category statistics
      const stats: Record<string, number> = {};
      for (const category of Object.keys(FABRIC_CATEGORIES)) {
        const count = fabricsData.filter(f => f.type === category).length;
        stats[category] = count;
      }
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error fetching fabrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalFabrics = fabrics.length;
  const lowStockFabrics = fabrics.filter(f => f.quantity <= f.minQuantity);
  const totalValue = fabrics.reduce((sum, fabric) => sum + (fabric.price * fabric.quantity), 0);

  const handleCategoryClick = (category: string) => {
    navigate('/inventory', { state: { selectedCategory: category } });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black dark:bg-gray-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm dark:text-black">Total de Tecidos</p>
              <p className="text-2xl font-semibold dark:text-white">{totalFabrics}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-black">Estoque Baixo</p>
              <p className="text-2xl font-semibold dark:text-white">{lowStockFabrics.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-black">Valor Total</p>
              <p className="text-2xl font-semibold dark:text-white">
                R$ {totalValue.toFixed(2)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-black">Média de Estoque</p>
              <p className="text-2xl font-semibold dark:text-white">
                {fabrics.length > 0 
                  ? Math.round(fabrics.reduce((sum, f) => sum + f.quantity, 0) / fabrics.length)
                  : 0}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white  p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 dark:text-black">Distribuição de Estoque</h2>
          <StockChart fabrics={fabrics} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 dark:text-black">Tecidos com Estoque Baixo</h2>
          <LowStockList fabrics={lowStockFabrics} />
        </div>
      </div>
    </div>
  );
}