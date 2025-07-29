import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Bot, ArrowLeft, Play, Crown, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const AIScheduler = ({ onBack, userPlan }) => {
  const [selectedMode, setSelectedMode] = useState(null); // 'partner' or 'ai'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [aiAvatar, setAiAvatar] = useState('professional');

  const isPro = userPlan === 'pro' || userPlan === 'enterprise';

  const aiAvatars = {
    professional: {
      name: 'Dr. Sarah',
      description: 'Professional relationship counselor with warm, empathetic approach',
      voice: 'Female, calm and reassuring'
    },
    friendly: {
      name: 'Alex',
      description: 'Friendly and approachable AI companion for casual conversations',
      voice: 'Neutral, conversational and relaxed'
    },
    analytical: {
      name: 'Dr. Marcus',
      description: 'Analytical psychology expert focused on deep emotional insights',
      voice: 'Male, thoughtful and precise'
    }
  };

  const handleScheduleSession = () => {
    if (!isPro) {
      // Show upgrade modal
      alert('This feature requires Kazini Pro or Enterprise subscription. Please upgrade to continue.');
      return;
    }

    const sessionData = {
      mode: selectedMode,
      date: selectedDate,
      time: selectedTime,
      title: sessionTitle,
      ...(selectedMode === 'partner' ? { partnerName } : { aiAvatar: aiAvatars[aiAvatar] })
    };

    // In production, this would save to backend
    alert(`Truth session scheduled successfully!\n\nMode: ${selectedMode === 'partner' ? 'Partner Questioning' : 'AI Questioning'}\nDate: ${selectedDate}\nTime: ${selectedTime}`);
    
    onBack();
  };

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                AI Questioning Scheduler
              </CardTitle>
              <p className="text-gray-600">
                Schedule truth sessions with your partner or AI avatars
              </p>
              <Badge variant="secondary" className="mt-2">
                Pro Feature
              </Badge>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  This premium feature allows you to schedule automated truth sessions with AI-powered questioning or coordinate sessions with your partner.
                </p>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Pro Features Include:</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Schedule sessions with AI avatars</li>
                    <li>• Partner coordination and notifications</li>
                    <li>• Advanced questioning algorithms</li>
                    <li>• Session recordings and analysis</li>
                  </ul>
                </div>
                
                <Button
                  onClick={() => alert('Upgrade to Pro to unlock AI Scheduling')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Schedule Truth Session
              </CardTitle>
              <p className="text-gray-600">
                Choose how you want to conduct your next truth session
              </p>
              <Badge variant="secondary" className="mt-2">
                <Crown className="w-3 h-3 mr-1" />
                Pro Feature
              </Badge>
            </CardHeader>
            
            <CardContent className="p-6">
              {!selectedMode ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Partner Mode */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedMode('partner')}
                  >
                    <Card className="h-full border-2 hover:border-purple-300 transition-colors">
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <User className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Partner Questioning
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Schedule a session where your partner asks the questions manually
                        </p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          <li>• Personal touch and intimacy</li>
                          <li>• Custom questions from partner</li>
                          <li>• Real-time interaction</li>
                          <li>• Shared experience</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* AI Mode */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedMode('ai')}
                  >
                    <Card className="h-full border-2 hover:border-purple-300 transition-colors">
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-purple-100 rounded-full">
                            <Bot className="w-8 h-8 text-purple-600" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          AI Avatar Questioning
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Let an AI avatar conduct the session with voice interaction
                        </p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          <li>• Professional AI avatars</li>
                          <li>• Advanced questioning algorithms</li>
                          <li>• Voice interaction support</li>
                          <li>• Consistent methodology</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Session Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Title
                      </label>
                      <input
                        type="text"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                        placeholder="e.g., Weekly Check-in"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {selectedMode === 'partner' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Partner's Name
                        </label>
                        <input
                          type="text"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          placeholder="Enter partner's name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AI Avatar
                        </label>
                        <select
                          value={aiAvatar}
                          onChange={(e) => setAiAvatar(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {Object.entries(aiAvatars).map(([key, avatar]) => (
                            <option key={key} value={key}>
                              {avatar.name} - {avatar.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {selectedMode === 'ai' && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        Selected AI Avatar: {aiAvatars[aiAvatar].name}
                      </h4>
                      <p className="text-sm text-purple-800 mb-1">
                        {aiAvatars[aiAvatar].description}
                      </p>
                      <p className="text-sm text-purple-700">
                        Voice: {aiAvatars[aiAvatar].voice}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setSelectedMode(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back to Mode Selection
                    </Button>
                    <Button
                      onClick={handleScheduleSession}
                      disabled={!selectedDate || !selectedTime || !sessionTitle || 
                        (selectedMode === 'partner' && !partnerName)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AIScheduler;

