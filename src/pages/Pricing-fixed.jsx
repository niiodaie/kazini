import React, { useState } from 'react';
import { plans } from '../plans';

const Pricing = ({ onBack, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('yearly');

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (planId) => {
    if (onUpgrade) {
      onUpgrade(planId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <img src="/kazinilogo.png" alt="Kazini" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">Kazini</span>
          </div>
          
          <div className="text-sm text-gray-600">
            Current: Free
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start free and upgrade as your relationship journey grows
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
            selectedPlan === 'free' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
          }`}>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">💝</span>
                <h3 className="text-2xl font-bold text-gray-800 ml-2">Kazini Free</h3>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">$0</div>
              <div className="text-gray-600">$0/month billed annually</div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">3 Truth Tests per month</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Solo Mode only (no Couple Mode)</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Limited Trust Report</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">View Last 3 Test Results</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-500 mt-1">✗</span>
                <span className="text-gray-500">No Export / No History Access</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Upgrade prompts for locked features</span>
              </div>
            </div>
            
            <button
              onClick={() => handlePlanSelect('free')}
              className="w-full py-3 px-6 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
            selectedPlan === 'pro' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
          }`}>
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">💎</span>
                <h3 className="text-2xl font-bold text-gray-800 ml-2">Kazini Pro</h3>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                ${billingCycle === 'yearly' ? '99' : '119'}/year
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-sm text-green-600 font-semibold mb-2">17% off</div>
              )}
              <div className="text-gray-600">
                ${billingCycle === 'yearly' ? '8.25' : '9.92'}/month billed annually
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-sm text-gray-500 line-through">
                  Was $119.88/year
                </div>
              )}
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Unlimited Truth Tests</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Advanced AI Analysis</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Couple Mode (Live & Async)</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Trust Index Dashboard</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Full History & Analytics</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Priority Support</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Export Reports</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Mobile App Access</span>
              </div>
            </div>
            
            <button
              onClick={() => handleSubscribe('pro')}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Subscribe to Kazini Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
            selectedPlan === 'enterprise' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
          }`}>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
                <h3 className="text-2xl font-bold text-gray-800 ml-2">Kazini Enterprise</h3>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                ${billingCycle === 'yearly' ? '499' : '599'}/year
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-sm text-green-600 font-semibold mb-2">17% off</div>
              )}
              <div className="text-gray-600">
                ${billingCycle === 'yearly' ? '41.58' : '49.92'}/month billed annually
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-sm text-gray-500 line-through">
                  Was $599.88/year
                </div>
              )}
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Everything in Pro</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Team Management (up to 10 users)</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Advanced Analytics & Insights</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Custom Branding</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">API Access</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Dedicated Account Manager</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Custom Integrations</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">Enterprise Security</span>
              </div>
            </div>
            
            <button
              onClick={() => handleSubscribe('enterprise')}
              className="w-full py-3 px-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-800 hover:to-black transition-all transform hover:scale-105"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use end-to-end encryption and never store your personal conversations.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                How accurate is the AI?
              </h3>
              <p className="text-gray-600">
                Our AI achieves 94% accuracy in detecting emotional authenticity through advanced analysis.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to discover emotional truth?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of couples building stronger relationships with Kazini
            </p>
            <button
              onClick={() => handleSubscribe('pro')}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

