import { useEffect, useState } from 'react';
import { BarChart3, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Fabric } from '../types';
import StockChart from '../components/dashboard/StockChart';
import LowStockList from '../components/dashboard/LowStockList';

export default function Dashboard() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchFabrics();
  }, []);

  const totalFabrics = fabrics.length;
  const lowStockFabrics = fabrics.filter(f => f.quantity <= f.minQuantity);
  const totalValue = fabrics.reduce((sum, fabric) => sum + (fabric.price * fabric.quantity), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Tecidos</p>
              <p className="text-2xl font-semibold">{totalFabrics}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Estoque Baixo</p>
              <p className="text-2xl font-semibold">{lowStockFabrics.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="text-2xl font-semibold">
                R$ {totalValue.toFixed(2)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Média de Estoque</p>
              <p className="text-2xl font-semibold">
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
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Distribuição de Estoque</h2>
          <StockChart fabrics={fabrics} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tecidos com Estoque Baixo</h2>
          <LowStockList fabrics={lowStockFabrics} />
        </div>
      </div>
    </div>
  );
}