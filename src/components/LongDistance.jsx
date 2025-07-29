import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Heart, 
  Video, 
  MessageCircle, 
  Calendar,
  Plane,
  Globe,
  Moon,
  Sun,
  Coffee,
  Sunset,
  Sunrise,
  Star,
  Users,
  Timer,
  Bell,
  Gift,
  Camera
} from 'lucide-react';

const LongDistance = ({ onBack, user }) => {
  const [partnerTimezone, setPartnerTimezone] = useState('UTC+8');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextMeeting, setNextMeeting] = useState(null);
  const [connectionStrength, setConnectionStrength] = useState(85);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mock next meeting
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    setNextMeeting(tomorrow);

    return () => clearInterval(timer);
  }, []);

  const getPartnerTime = () => {
    const offset = parseInt(partnerTimezone.replace('UTC', ''));
    const partnerTime = new Date(currentTime.getTime() + (offset * 60 * 60 * 1000));
    return partnerTime;
  };

  const getTimeOfDay = (time) => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return { period: 'Morning', icon: <Sunrise className="w-4 h-4" />, color: 'text-yellow-500' };
    if (hour >= 12 && hour < 17) return { period: 'Afternoon', icon: <Sun className="w-4 h-4" />, color: 'text-orange-500' };
    if (hour >= 17 && hour < 21) return { period: 'Evening', icon: <Sunset className="w-4 h-4" />, color: 'text-purple-500' };
    return { period: 'Night', icon: <Moon className="w-4 h-4" />, color: 'text-blue-500' };
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (time) => {
    return time.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeDifference = () => {
    const userOffset = -currentTime.getTimezoneOffset() / 60;
    const partnerOffset = parseInt(partnerTimezone.replace('UTC', ''));
    const diff = Math.abs(userOffset - partnerOffset);
    return diff;
  };

  const yourTimeOfDay = getTimeOfDay(currentTime);
  const partnerTime = getPartnerTime();
  const partnerTimeOfDay = getTimeOfDay(partnerTime);

  const activities = [
    {
      id: 'video_call',
      title: 'Video Call',
      description: 'Start an emotional truth session together',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'async_message',
      title: 'Send Love Message',
      description: 'Record a heartfelt message for later',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      available: true
    },
    {
      id: 'schedule_date',
      title: 'Schedule Virtual Date',
      description: 'Plan your next online date night',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-purple-500',
      available: true
    },
    {
      id: 'send_gift',
      title: 'Virtual Gift',
      description: 'Send a surprise digital gift',
      icon: <Gift className="w-6 h-6" />,
      color: 'bg-pink-500',
      available: user?.plan === 'pro'
    },
    {
      id: 'photo_share',
      title: 'Photo Moment',
      description: 'Share what you\'re seeing right now',
      icon: <Camera className="w-6 h-6" />,
      color: 'bg-yellow-500',
      available: true
    },
    {
      id: 'sleep_together',
      title: 'Sleep Together',
      description: 'Virtual presence while sleeping',
      icon: <Moon className="w-6 h-6" />,
      color: 'bg-indigo-500',
      available: user?.plan === 'pro'
    }
  ];

  const connectionTips = [
    {
      title: "Morning Routine Sync",
      description: "Share your morning coffee moments via quick video messages",
      time: "Morning"
    },
    {
      title: "Lunch Break Check-in",
      description: "Send a quick 'thinking of you' message during lunch",
      time: "Afternoon"
    },
    {
      title: "Evening Wind-down",
      description: "End the day together with a video call or voice message",
      time: "Evening"
    },
    {
      title: "Goodnight Ritual",
      description: "Share your day's highlights before sleep",
      time: "Night"
    }
  ];

  const handleActivity = (activityId) => {
    if (activityId === 'video_call') {
      alert('Starting video call with emotional truth detection...');
    } else if (activityId === 'async_message') {
      alert('Opening message recorder...');
    } else if (activityId === 'schedule_date') {
      alert('Opening date scheduler...');
    } else if (activityId === 'send_gift') {
      if (user?.plan !== 'pro') {
        alert('Virtual gifts are available with Pro plan. Upgrade to unlock this feature!');
      } else {
        alert('Opening virtual gift store...');
      }
    } else if (activityId === 'photo_share') {
      alert('Opening camera for photo sharing...');
    } else if (activityId === 'sleep_together') {
      if (user?.plan !== 'pro') {
        alert('Sleep together feature is available with Pro plan. Upgrade to unlock this feature!');
      } else {
        alert('Starting virtual sleep session...');
      }
    }
  };

  return (
    <div className="min-h-screen romantic-bg">
      {/* Floating emotional motifs */}
      <div className="emotional-motifs">
        <div className="motif">💔</div>
        <div className="motif">💑</div>
        <div className="motif">💬</div>
        <div className="motif">💍</div>
        <div className="motif">❤️</div>
        <div className="motif">💕</div>
      </div>
      
      {/* Dynamic light movement */}
      <div className="light-movement"></div>

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
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
            
            <Badge className="bg-white/20 text-white border-white/30">
              <Plane className="w-3 h-3 mr-1" />
              Long Distance Mode
            </Badge>
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Love Knows No
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Distance
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Stay emotionally connected across time zones with AI-powered relationship tools 
              designed for long-distance couples.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Time Zone Sync */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Time Zone Sync
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Your Time */}
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">You ({user?.location?.city || 'Your Location'})</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatTime(currentTime)}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {formatDate(currentTime)}
                      </div>
                      <div className={`flex items-center justify-center gap-2 ${yourTimeOfDay.color}`}>
                        {yourTimeOfDay.icon}
                        <span className="text-sm font-medium">{yourTimeOfDay.period}</span>
                      </div>
                    </div>

                    {/* Partner Time */}
                    <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Partner</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatTime(partnerTime)}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {formatDate(partnerTime)}
                      </div>
                      <div className={`flex items-center justify-center gap-2 ${partnerTimeOfDay.color}`}>
                        {partnerTimeOfDay.icon}
                        <span className="text-sm font-medium">{partnerTimeOfDay.period}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Time Difference</span>
                      <Badge variant="secondary">
                        {getTimeDifference()} hours apart
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      Partner's timezone: {partnerTimezone}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block">Partner's Timezone</label>
                    <select
                      value={partnerTimezone}
                      onChange={(e) => setPartnerTimezone(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">GMT (UTC+0)</option>
                      <option value="UTC+1">Central European Time (UTC+1)</option>
                      <option value="UTC+8">China Standard Time (UTC+8)</option>
                      <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                      <option value="UTC+10">Australian Eastern Time (UTC+10)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Connection Status */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Connection Status
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 heart-pulse">
                      <span className="text-white font-bold text-xl">{connectionStrength}%</span>
                    </div>
                    <div className="text-sm text-gray-600">Emotional Connection</div>
                  </div>

                  {nextMeeting && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Timer className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Next Meeting</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(nextMeeting)} at {formatTime(nextMeeting)}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Last interaction</span>
                      <span className="text-gray-600">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Messages today</span>
                      <span className="text-gray-600">12</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Video calls this week</span>
                      <span className="text-gray-600">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Activities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Stay Connected</CardTitle>
                <p className="text-gray-600">Choose how you want to connect with your partner</p>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleActivity(activity.id)}
                      disabled={!activity.available}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        activity.available
                          ? 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                          : 'border-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-12 h-12 ${activity.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                        {activity.icon}
                      </div>
                      <h3 className="font-semibold mb-1">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      {!activity.available && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Pro Feature
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connection Tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Daily Connection Tips
                </CardTitle>
                <p className="text-gray-600">
                  Personalized suggestions based on your time zones and schedules
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {connectionTips.map((tip, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {tip.time}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upgrade Prompt for Free Users */}
          {user?.plan === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Unlock Premium Long-Distance Features</h3>
                  <p className="mb-6 opacity-90">
                    Get virtual gifts, sleep together mode, advanced scheduling, and more with Kazini Pro
                  </p>
                  <Button className="bg-white text-purple-600 hover:bg-gray-100">
                    Upgrade to Pro - $9.99/month
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LongDistance;

