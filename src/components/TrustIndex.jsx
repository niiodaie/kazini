import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Award, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const TrustIndex = ({ onBack }) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Mock data for demonstration
  const trustScore = 78;
  const scoreChange = +5;
  const totalTests = 24;
  const truthfulResponses = 19;

  const weeklyData = [
    { day: 'Mon', score: 72 },
    { day: 'Tue', score: 75 },
    { day: 'Wed', score: 73 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: 80 },
    { day: 'Sat', score: 76 },
    { day: 'Sun', score: 78 },
  ];

  const monthlyData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 78 },
  ];

  const categoryData = [
    { name: 'Truthful', value: truthfulResponses, color: '#10B981' },
    { name: 'Uncertain', value: 3, color: '#F59E0B' },
    { name: 'Deceptive', value: 2, color: '#EF4444' },
  ];

  const recentTests = [
    { question: 'Did you enjoy dinner last night?', result: '✅ TRUTH', confidence: 85, date: '2 hours ago' },
    { question: 'Are you feeling stressed about work?', result: '⚠️ UNCERTAIN', confidence: 68, date: '1 day ago' },
    { question: 'Did you talk to your ex recently?', result: '✅ TRUTH', confidence: 92, date: '2 days ago' },
    { question: 'Are you happy in our relationship?', result: '✅ TRUTH', confidence: 88, date: '3 days ago' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev < trustScore) {
          return prev + 1;
        }
        clearInterval(timer);
        return trustScore;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [trustScore]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Excellent trust level with high authenticity';
    if (score >= 60) return 'Good trust level with moderate authenticity';
    return 'Building trust - focus on honest communication';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Trust Index</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Current Trust Score */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Trust Index</h2>
              
              <div className="relative w-64 h-64 mx-auto mb-8">
                {/* Circular Progress */}
                <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${(animatedScore / 100) * 703.7} 703.7`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B2A4A" />
                      <stop offset="100%" stopColor="#FF5A5F" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(trustScore)}`}>
                      {animatedScore}
                    </div>
                    <div className="text-lg text-gray-600">Trust Score</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                {scoreChange > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${scoreChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {scoreChange > 0 ? '+' : ''}{scoreChange} points this week
                </span>
              </div>

              <p className="text-gray-600 text-lg">{getScoreDescription(trustScore)}</p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalTests}</div>
                  <div className="text-gray-600">Total Tests</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{Math.round((truthfulResponses / totalTests) * 100)}%</div>
                  <div className="text-gray-600">Truthful Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-gray-600">Days Active</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Weekly Trend */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[60, 85]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#FF5A5F" 
                    strokeWidth={3}
                    dot={{ fill: '#FF5A5F', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Response Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Response Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Monthly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 85]} />
                <Tooltip />
                <Bar dataKey="score" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B2A4A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF5A5F" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Tests */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Tests</h3>
            <div className="space-y-4">
              {recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{test.question}</div>
                    <div className="text-sm text-gray-600">{test.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold mb-1">{test.result}</div>
                    <div className="text-sm text-gray-600">{test.confidence}% confidence</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndex;

