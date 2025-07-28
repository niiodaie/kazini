import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from '../ui/badge';
import { PLANS } from '../plans';
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Star,
  Video,
  Users,
  Download,
  Globe,
  Headphones,
  Heart,
  Zap,
  Crown,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = ({ user }) => {
  const navigate = useNavigate();

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
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {user && (
              <Badge className="bg-white/20 text-white border-white/30">
                Current: {user.plan === 'pro' ? 'Pro' : user.plan === 'enterprise' ? 'Enterprise' : 'Basic'}
              </Badge>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PLANS).map(([key, plan]) => (
              <Card key={key} className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {key === 'enterprise' && <Crown className="w-5 h-5 text-yellow-300" />}
                    {key === 'pro' && <Star className="w-5 h-5 text-purple-400" />}
                  </CardTitle>
                  <div className="mt-2 text-2xl font-bold">${plan.price.monthly}/mo</div>
                  <div className="text-sm text-white/80">or ${plan.price.yearly}/yr</div>
                  {getDiscountPercentage(plan) > 0 && (
                    <Badge className="mt-2 bg-green-600 text-white">
                      Save {getDiscountPercentage(plan)}%
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
                    onClick={() => window.location.href = plan.link}
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
