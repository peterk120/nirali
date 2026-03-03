import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Tab } from '@headlessui/react';
import { X, Ruler } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface SizeChartItem {
  size: string;
  bust: string;
  waist: string;
  hips: string;
  length: string;
}

interface BodyMeasurements {
  bust: string;
  waist: string;
  hips: string;
}

export const SizeGuide = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [measurements, setMeasurements] = useState<BodyMeasurements>({ 
    bust: '', 
    waist: '', 
    hips: '' 
  });
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [sizeComparison, setSizeComparison] = useState<string>('');

  // Sample size chart data
  const sizeChart: SizeChartItem[] = [
    { size: 'XS', bust: '81-86', waist: '61-66', hips: '86-91', length: '120' },
    { size: 'S', bust: '86-91', waist: '66-71', hips: '91-96', length: '120' },
    { size: 'M', bust: '91-96', waist: '71-76', hips: '96-101', length: '120' },
    { size: 'L', bust: '96-101', waist: '76-81', hips: '101-106', length: '122' },
    { size: 'XL', bust: '101-106', waist: '81-86', hips: '106-111', length: '124' },
    { size: 'XXL', bust: '106-111', waist: '86-91', hips: '111-116', length: '126' },
  ];

  const handleInputChange = (field: keyof BodyMeasurements, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const findRecommendedSize = () => {
    const bust = parseInt(measurements.bust);
    const waist = parseInt(measurements.waist);
    const hips = parseInt(measurements.hips);

    if (isNaN(bust) || isNaN(waist) || isNaN(hips)) {
      setRecommendedSize("Please enter all measurements");
      setSizeComparison("");
      return;
    }

    // Find the size that fits all measurements
    let foundSize = null;
    let betweenSizes = [];

    for (let i = 0; i < sizeChart.length; i++) {
      const size = sizeChart[i];
      const sizeBust = size.bust.split('-').map(Number);
      const sizeWaist = size.waist.split('-').map(Number);
      const sizeHips = size.hips.split('-').map(Number);

      const fitsBust = bust >= sizeBust[0] && bust <= sizeBust[1];
      const fitsWaist = waist >= sizeWaist[0] && waist <= sizeWaist[1];
      const fitsHips = hips >= sizeHips[0] && hips <= sizeHips[1];

      if (fitsBust && fitsWaist && fitsHips) {
        foundSize = size.size;
        break;
      }
    }

    // Check for between sizes scenario
    if (!foundSize) {
      // Check if measurements fall between two sizes
      for (let i = 0; i < sizeChart.length - 1; i++) {
        const currentSize = sizeChart[i];
        const nextSize = sizeChart[i + 1];
        
        const currentBust = currentSize.bust.split('-').map(Number);
        const currentWaist = currentSize.waist.split('-').map(Number);
        const currentHips = currentSize.hips.split('-').map(Number);
        
        const nextBust = nextSize.bust.split('-').map(Number);
        const nextWaist = nextSize.waist.split('-').map(Number);
        const nextHips = nextSize.hips.split('-').map(Number);

        // Check if bust is in current size range but waist or hips exceed
        const inCurrentBust = bust >= currentBust[0] && bust <= currentBust[1];
        const inCurrentWaist = waist >= currentWaist[0] && waist <= currentWaist[1];
        const inCurrentHips = hips >= currentHips[0] && hips <= currentHips[1];

        const exceedsNextBust = bust > nextBust[1];
        const exceedsNextWaist = waist > nextWaist[1];
        const exceedsNextHips = hips > nextHips[1];

        if (inCurrentBust && inCurrentWaist && inCurrentHips && 
            (exceedsNextBust || exceedsNextWaist || exceedsNextHips)) {
          betweenSizes.push(`${currentSize.size}/${nextSize.size}`);
        }
      }
    }

    if (betweenSizes.length > 0) {
      const sizePair = betweenSizes[0].split('/')[1]; // Recommend going up
      setRecommendedSize(`Between ${betweenSizes[0]} — we recommend going up to ${sizePair}`);
      setSizeComparison(`For custom sizing, mention in booking instructions`);
    } else if (foundSize) {
      setRecommendedSize(`We recommend SIZE ${foundSize} for this dress`);
      setSizeComparison(``);
    } else {
      setRecommendedSize(`Your measurements don't match our standard sizes`);
      setSizeComparison(`Consider custom sizing`);
    }
  };

  const handleFindSize = () => {
    findRecommendedSize();
  };

  const handleReset = () => {
    setMeasurements({ bust: '', waist: '', hips: '' });
    setRecommendedSize(null);
    setSizeComparison('');
  };

  return (
    <Transition show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Size Guide
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                         ${
                           selected
                             ? 'bg-white shadow text-brand-rose'
                             : 'text-gray-700 hover:bg-white/[0.12] hover:text-brand-rose'
                         }`
                      }
                    >
                      Size Chart
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                         ${
                           selected
                             ? 'bg-white shadow text-brand-rose'
                             : 'text-gray-700 hover:bg-white/[0.12] hover:text-brand-rose'
                         }`
                      }
                    >
                      Find My Size
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    {/* Size Chart Tab */}
                    <Tab.Panel>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Size
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bust (cm)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Waist (cm)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hips (cm)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Length (cm)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sizeChart.map((size, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {size.size}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {size.bust}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {size.waist}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {size.hips}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {size.length}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                          <Ruler className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-blue-700">
                            <strong>Tip:</strong> Measure over your undergarments for accuracy
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Measurement Guide</h4>
                        <div className="flex justify-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                            Measurement guide illustration (where to measure on body)
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    
                    {/* Find My Size Tab */}
                    <Tab.Panel>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="bust" className="block text-sm font-medium text-gray-700 mb-1">
                              Your Bust (cm)
                            </label>
                            <input
                              type="number"
                              id="bust"
                              value={measurements.bust}
                              onChange={(e) => handleInputChange('bust', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                              placeholder="e.g. 90"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">
                              Your Waist (cm)
                            </label>
                            <input
                              type="number"
                              id="waist"
                              value={measurements.waist}
                              onChange={(e) => handleInputChange('waist', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                              placeholder="e.g. 70"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="hips" className="block text-sm font-medium text-gray-700 mb-1">
                              Your Hips (cm)
                            </label>
                            <input
                              type="number"
                              id="hips"
                              value={measurements.hips}
                              onChange={(e) => handleInputChange('hips', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                              placeholder="e.g. 95"
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button 
                            onClick={handleFindSize}
                            className="bg-brand-rose hover:bg-brand-rose/90"
                          >
                            Find My Size
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="border-gray-300 text-gray-700"
                          >
                            Reset
                          </Button>
                        </div>
                        
                        {recommendedSize && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-green-800 font-medium">{recommendedSize}</p>
                            {sizeComparison && (
                              <p className="text-green-700 text-sm mt-1">{sizeComparison}</p>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> For custom sizing, mention in booking instructions
                          </p>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};