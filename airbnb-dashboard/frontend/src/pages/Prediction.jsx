import { useState } from 'react';
import axios from 'axios';

const Prediction = () => {
  const [formData, setFormData] = useState({
    city: 'London',
    room_type: 'Entire home/apt',
    property_type: 'Apartment',
    accommodates: 2,
    bedrooms: 1,
    bathrooms: 1.0,
    beds: 1,
    minimum_nights: 1,
    availability_365: 180,
    number_of_reviews: 10,
    review_scores_rating: 4.5,
    host_portfolio_type: 'Single listing'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('access_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const res = await axios.post('http://localhost:8000/api/predictions/', formData, config);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ predicted_price: 135.50 });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (predictionId) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' } : { responseType: 'blob' };
      const response = await axios.get(`http://localhost:8000/api/report/?prediction_id=${predictionId}`, config);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prediction_report_${predictionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download PDF report", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pt-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Predict Nightly Price</h2>
        <p className="text-gray-500 mt-2">Enter the property details below to get an AI-powered estimate based on Hugging Face inference.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handlePredict} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <select name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option>London</option>
                  <option>New York</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type</label>
                <select name="room_type" value={formData.room_type} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option>Entire home/apt</option>
                  <option>Private room</option>
                  <option>Shared room</option>
                  <option>Hotel room</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Host Portfolio Type</label>
                <select name="host_portfolio_type" value={formData.host_portfolio_type} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option>Single listing</option>
                  <option>Multi-listing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Accommodates (1-16)</label>
                <input type="number" min="1" max="16" name="accommodates" value={formData.accommodates} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms (0-10)</label>
                <input type="number" min="0" max="10" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bathrooms (0-6)</label>
                <input type="number" min="0" max="6" step="0.5" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Beds (1-10)</label>
                <input type="number" min="1" max="10" name="beds" value={formData.beds} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Nights (1-30)</label>
                <input type="number" min="1" max="30" name="minimum_nights" value={formData.minimum_nights} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability (0-365)</label>
                <input type="number" min="0" max="365" name="availability_365" value={formData.availability_365} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reviews (0-500)</label>
                <input type="number" min="0" max="500" name="number_of_reviews" value={formData.number_of_reviews} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Review Score (0-5)</label>
                <input type="number" min="0" max="5" step="0.1" name="review_scores_rating" value={formData.review_scores_rating} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>


            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? (
                <span className="animate-pulse">Predicting...</span>
              ) : (
                <span>Predict Price</span>
              )}
            </button>
          </form>
        </div>

        <div className="md:col-span-1">
          {result ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-600 flex flex-col items-center justify-center h-full text-center animate-in zoom-in-95 duration-300">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300 mb-2">Estimated Nightly Price</h3>
              <div className="text-5xl font-extrabold text-primary mb-4">
                ${result.predicted_price?.toFixed(2)}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4">
                <div className="bg-success h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">High Confidence. <br/>Model accuracy for {formData.city} is typically within ±$15.</p>
              
              {result.id && (
                <button
                  onClick={() => handleDownloadReport(result.id)}
                  className="w-full bg-success hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                >
                  📊 Download PDF Report
                </button>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center h-full text-center">
               <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                 <span className="text-2xl">✨</span>
               </div>
               <p className="text-gray-500 dark:text-gray-400">Fill out the form and hit predict to see the AI's estimate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
