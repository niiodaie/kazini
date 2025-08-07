import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const PlanSelectorModal = ({ onClose, onPlanSelected }) => {
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (!data?.plan) {
        setShowModal(true);
      }
    };

    fetchUser();
  }, []);

  const handleSelectPlan = async (planType) => {
    if (!userId) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ plan: planType })
      .eq('id', userId);

    setIsLoading(false);

    if (error) {
      alert('Something went wrong. Try again.');
    } else {
      setShowModal(false);
      if (onPlanSelected) onPlanSelected(planType);
      if (onClose) onClose();
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 p-6 text-purple-900 relative shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Choose Your Plan</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Select a plan to begin exploring Kazini.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 border p-4 rounded-xl bg-purple-50">
            <h3 className="font-semibold text-lg mb-2">🆓 Free</h3>
            <ul className="text-sm mb-4 list-disc list-inside">
              <li>3 Truth Tests/month</li>
              <li>Solo Mode only</li>
              <li>Limited Trust Report</li>
            </ul>
            <button
              onClick={() => handleSelectPlan('free')}
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Setting up...' : 'Continue Free'}
            </button>
          </div>

          <div className="flex-1 border p-4 rounded-xl bg-yellow-50 border-yellow-300">
            <h3 className="font-semibold text-lg mb-2">👑 Pro - $99/year</h3>
            <ul className="text-sm mb-4 list-disc list-inside">
              <li>Unlimited Tests</li>
              <li>Couple Mode access</li>
              <li>Full History & Trust Index</li>
            </ul>
            <button
              onClick={() => handleSelectPlan('pro')}
              disabled={isLoading}
              className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? 'Setting up...' : 'Choose Pro Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectorModal;