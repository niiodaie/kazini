import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Copy, Check, Zap, Clock, Heart, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

const LiveSessionSetup = ({ onBack, user }) => {
  const [sessionCode, setSessionCode] = useState('');
  const [isHost, setIsHost] = useState(true);
  const [partnerConnected, setPartnerConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    // Generate a random 6-digit session code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSession = () => {
    if (joinCode.length === 6) {
      // Simulate joining a session
      setPartnerConnected(true);
    }
  };

  const handleStartSession = () => {
    // This would start the actual live truth testing session
    console.log('Starting live session with code:', sessionCode);
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
        <div className="max-w-3xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Couple Mode
            </Button>
            
            <Badge variant="secondary" className="bg-red-500/20 text-white border-red-300/30">
              <Zap className="w-3 h-3 mr-1" />
              Live Mode
            </Badge>
          </div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 rounded-full backdrop-blur-sm">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Live Truth Session
            </h1>
            <p className="text-white/80 text-lg">
              Connect with your partner for real-time emotional analysis
            </p>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <Button
                variant={isHost ? "default" : "ghost"}
                onClick={() => setIsHost(true)}
                className={`${isHost ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'}`}
              >
                Host Session
              </Button>
              <Button
                variant={!isHost ? "default" : "ghost"}
                onClick={() => setIsHost(false)}
                className={`${!isHost ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'}`}
              >
                Join Session
              </Button>
            </div>
          </motion.div>

          {isHost ? (
            /* Host Session Card */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Your Session Code
                  </CardTitle>
                  <p className="text-gray-600">
                    Share this code with your partner to connect
                  </p>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-3xl font-bold py-4 px-8 rounded-lg mb-4 tracking-wider">
                      {sessionCode}
                    </div>
                    <Button
                      onClick={handleCopyCode}
                      variant="outline"
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Connection Status */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${partnerConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-gray-700">
                          {partnerConnected ? 'Partner Connected' : 'Waiting for partner...'}
                        </span>
                      </div>
                      {!partnerConnected && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Share Options */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Link
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Send Invite
                    </Button>
                  </div>

                  <Button
                    onClick={handleStartSession}
                    disabled={!partnerConnected}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white disabled:opacity-50"
                  >
                    {partnerConnected ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Start Truth Session
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Waiting for Partner
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Join Session Card */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Join Session
                  </CardTitle>
                  <p className="text-gray-600">
                    Enter the 6-digit code from your partner
                  </p>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="mb-6">
                    <Input
                      placeholder="Enter session code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="text-center text-2xl font-bold tracking-wider h-16"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    onClick={handleJoinSession}
                    disabled={joinCode.length !== 6}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Session
                  </Button>

                  <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                      Don't have a code? Ask your partner to create a session and share the code with you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-2">How Live Mode Works:</h3>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• Both partners must be online at the same time</li>
                  <li>• Real-time emotional analysis and feedback</li>
                  <li>• Instant truth detection results</li>
                  <li>• Perfect for deep, meaningful conversations</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionSetup;

