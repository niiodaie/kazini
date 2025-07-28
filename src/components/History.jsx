import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Download, Share2, Calendar, Clock, CheckCircle, AlertTriangle, XCircle, MoreVertical } from 'lucide-react';

const History = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, truth, uncertain, false
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, today, week, month
  const [expandedItem, setExpandedItem] = useState(null);

  // Mock history data
  const historyData = [
    {
      id: 1,
      question: "Did you enjoy dinner last night?",
      answer: "Yes, it was really delicious! I loved the pasta you made.",
      result: "✅ TRUTH",
      confidence: 85,
      type: "truth",
      explanation: "Direct response with positive emotional indicators. No hesitation patterns detected.",
      trustDelta: +8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      mode: "Individual",
      category: "Relationship"
    },
    {
      id: 2,
      question: "Are you feeling stressed about work?",
      answer: "Not really, things are going okay I guess...",
      result: "⚠️ UNCERTAIN",
      confidence: 68,
      type: "uncertain",
      explanation: "Some hesitation detected. Mixed emotional signals suggest partial truth.",
      trustDelta: -2,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      mode: "Couple Mode",
      category: "Personal"
    },
    {
      id: 3,
      question: "Did you talk to your ex recently?",
      answer: "No, I haven't spoken to them in months.",
      result: "✅ TRUTH",
      confidence: 92,
      type: "truth",
      explanation: "Strong truthful indicators. Consistent emotional tone throughout response.",
      trustDelta: +12,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      mode: "Individual",
      category: "Relationship"
    },
    {
      id: 4,
      question: "Are you happy in our relationship?",
      answer: "Yes, absolutely! You make me very happy.",
      result: "✅ TRUTH",
      confidence: 88,
      type: "truth",
      explanation: "Authentic emotional response with strong positive indicators.",
      trustDelta: +10,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      mode: "Couple Mode",
      category: "Relationship"
    },
    {
      id: 5,
      question: "Did you spend money on something expensive today?",
      answer: "Just the usual stuff, nothing special.",
      result: "❌ DECEPTION",
      confidence: 73,
      type: "false",
      explanation: "Evasive language patterns detected. Response lacks specificity typical of truthful answers.",
      trustDelta: -15,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      mode: "Individual",
      category: "Financial"
    },
    {
      id: 6,
      question: "Do you like my new haircut?",
      answer: "It looks great! Really suits you.",
      result: "⚠️ UNCERTAIN",
      confidence: 65,
      type: "uncertain",
      explanation: "Polite response pattern detected. May contain social courtesy bias.",
      trustDelta: 0,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      mode: "Couple Mode",
      category: "Personal"
    }
  ];

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    const matchesPeriod = (() => {
      if (selectedPeriod === 'all') return true;
      const now = new Date();
      const itemDate = item.timestamp;
      
      switch (selectedPeriod) {
        case 'today':
          return itemDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesFilter && matchesPeriod;
  });

  const getResultIcon = (type) => {
    switch (type) {
      case 'truth':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'uncertain':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'false':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'truth':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'uncertain':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'false':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return timestamp.toLocaleDateString();
  };

  const exportHistory = () => {
    // In a real app, this would generate and download a file
    alert('History exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">History</h1>
            </div>
            <button
              onClick={exportHistory}
              className="flex items-center gap-2 bg-[#FF5A5F] text-white px-4 py-2 rounded-lg hover:bg-[#e54e53] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                />
              </div>

              {/* Result Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
              >
                <option value="all">All Results</option>
                <option value="truth">Truth Only</option>
                <option value="uncertain">Uncertain Only</option>
                <option value="false">Deception Only</option>
              </select>

              {/* Period Filter */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredHistory.length} of {historyData.length} tests
            </p>
          </div>

          {/* History Items */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getResultIcon(item.type)}
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getResultColor(item.type)}`}>
                            {item.result}
                          </span>
                          <span className="text-sm text-gray-500">{item.confidence}% confidence</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.question}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTimestamp(item.timestamp)}
                          </div>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {item.mode}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 pt-4 mt-4"
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Answer:</h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                "{item.answer}"
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">AI Analysis:</h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {item.explanation}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Trust Impact:</h4>
                                <span className={`font-bold ${item.trustDelta > 0 ? 'text-green-600' : item.trustDelta < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                  {item.trustDelta > 0 ? '+' : ''}{item.trustDelta} points
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {item.timestamp.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' || selectedPeriod !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start taking truth tests to see your history here'
                }
              </p>
              {!searchTerm && filterType === 'all' && selectedPeriod === 'all' && (
                <button
                  onClick={onBack}
                  className="bg-[#FF5A5F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#e54e53] transition-all duration-300"
                >
                  Take Your First Test
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;

