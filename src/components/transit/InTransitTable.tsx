import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Check } from 'lucide-react';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface InTransitItem {
  id: string;
  fabricName: string;
  fabricType: string;
  supplier: string;
  quantity: number;
  expectedDate: string;
}

interface InTransitTableProps {
  items: InTransitItem[];
  onRefresh: () => void;
}

export default function InTransitTable({ items, onRefresh }: InTransitTableProps) {
  const handleReceiveDelivery = async (item: InTransitItem) => {
    try {
      // Find matching fabric in inventory
      const fabricsRef = collection(db, 'fabrics');
      const q = query(
        fabricsRef,
        where('name', '==', item.fabricName),
        where('type', '==', item.fabricType)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const fabricDoc = querySnapshot.docs[0];
        const fabricData = fabricDoc.data();
        
        // Update fabric quantity
        await updateDoc(doc(db, 'fabrics', fabricDoc.id), {
          quantity: fabricData.quantity + item.quantity,
          supplier: item.supplier // Update or set the supplier
        });
      } else {
        // Create new fabric entry if it doesn't exist
        const fabricsCollection = collection(db, 'fabrics');
        await addDoc(fabricsCollection, {
          name: item.fabricName,
          type: item.fabricType,
          supplier: item.supplier,
          quantity: item.quantity,
          minQuantity: 0, // Default value
          price: 0, // Default value
          color: '#000000', // Default value
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Remove from in-transit
      await deleteDoc(doc(db, 'inTransit', item.id));
      
      toast.success('Entrega confirmada com sucesso!');
      onRefresh();
    } catch (error) {
      console.error('Error confirming delivery:', error);
      toast.error('Erro ao confirmar entrega');
    }
  };

  return (
    <div className="bg-white  rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-200">
        <thead className="bg-white dark:bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Tecido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Fornecedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Quantidade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Data Prevista
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-white divide-y divide-gray-200 dark:divide-gray-">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 ">
              <td className="px-6 py-4 whitespace-nowrap">{item.fabricName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.fabricType}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.supplier}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(item.expectedDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleReceiveDelivery(item)}
                  className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirmar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum tecido em trânsito no momento
          </p>
        </div>
      )}
    </div>
  );
}