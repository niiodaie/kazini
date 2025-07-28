import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PLANS } from '../plans';
import { 
  Crown, 
  Check, 
  X, 
  ArrowLeft, 
  Star, 
  Zap, 
  Shield, 
  Heart,
  Users,
  Video,
  Download,
  Headphones,
  Globe,
  Sparkles
} from 'lucide-react';

const Pricing = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-5xl mx-auto">
      {Object.entries(PLANS).map(([key, plan]) => (
        <div key={key} className="border rounded-lg p-6 shadow hover:shadow-md transition">
          <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
          <p className="text-gray-600 mt-2">{plan.price}</p>
          <button
            className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => window.location.href = plan.link}
          >
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
};

const Pricing = () => {
  const getDiscountPercentage = (plan) => {
    if (plan.price.yearly === 0) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  };

  return (
    <div className="min-h-screen romantic-bg">
      {/* Floating emotional motifs */}
      <div className="emotional-motifs">
        <div className="motif">💘</div>
        <div className="motif">❣️</div>
        <div className="motif">💖</div>
        <div className="motif">💓</div>
        <div className="motif">💞</div>
        <div className="motif">❤️</div>
      </div>

      {/* Dynamic light movement */}
      <div className="light-movement"></div>

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

          {user && (
              <Badge className="bg-white/20 text-white border-white/30">
                Current: {user.plan === 'pro' ? 'Pro' : user.plan === 'enterprise' ? 'Enterprise' : 'Basic'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
