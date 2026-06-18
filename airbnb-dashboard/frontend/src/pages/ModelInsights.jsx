import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const ModelInsights = () => {
  // Mock data for the offline notebook outputs
  const featureImportance = [
    { name: 'Room Type', value: 0.35 },
    { name: 'Accommodates', value: 0.25 },
    { name: 'City', value: 0.15 },
    { name: 'Bathrooms', value: 0.10 },
    { name: 'Review Score', value: 0.08 },
    { name: 'Host Type', value: 0.07 },
  ];

  const biasData = [
    { city: 'London', error: 13.8 },
    { city: 'New York', error: 15.2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pt-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Model Insights & Explainability</h2>
        <p className="text-gray-500 mt-2">Evaluation metrics, SHAP values, and bias reports from the offline Jupyter notebook.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Feature Importance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Bias Report: City-wise MAE ($)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={biasData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="city" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="error" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
           <h3 className="text-lg font-semibold mb-6">Model Comparison</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                 <tr>
                   <th className="p-4 font-medium rounded-tl-lg rounded-bl-lg">Model</th>
                   <th className="p-4 font-medium">MAE</th>
                   <th className="p-4 font-medium">RMSE</th>
                   <th className="p-4 font-medium rounded-tr-lg rounded-br-lg">R² Score</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                 <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                   <td className="p-4 font-medium text-primary">XGBoost (Production)</td>
                   <td className="p-4">$14.50</td>
                   <td className="p-4">$22.10</td>
                   <td className="p-4">0.86</td>
                 </tr>
                 <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                   <td className="p-4">Random Forest</td>
                   <td className="p-4">$16.20</td>
                   <td className="p-4">$25.40</td>
                   <td className="p-4">0.82</td>
                 </tr>
                 <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                   <td className="p-4">Linear Regression</td>
                   <td className="p-4">$28.90</td>
                   <td className="p-4">$41.00</td>
                   <td className="p-4">0.65</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInsights;
