import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Link, Copy, Check, QrCode, Heart, Clock, Zap } from 'lucide-react';

const CoupleMode = ({ onBack }) => {
  const [mode, setMode] = useState(null); // 'live' or 'async'
  const [roomCode, setRoomCode] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  };

  const generateShareLink = () => {
    const linkId = Math.random().toString(36).substring(2, 12);
    const link = `https://kazini.app/couple/${linkId}`;
    setShareLink(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      // In a real app, this would connect to the room
      alert(`Joining room: ${joinCode}`);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Couple Mode</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Mode Selection */}
            {!mode && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Choose Your Connection Style
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Connect with your partner in real-time or share questions asynchronously.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Live Mode */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('live')}
                    className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#FF5A5F]"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-[#FF5A5F] to-[#ff7b7f] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Mode</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Real-time truth testing with your partner. Both participants are online simultaneously for immediate results and reactions.
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Both online at same time</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>Instant emotional feedback</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Async Mode */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('async')}
                    className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#3B2A4A]"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-[#3B2A4A] to-[#5a4a6a] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Async Mode</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Share questions via link for your partner to answer when convenient. Perfect for different schedules or time zones.
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <Link className="w-4 h-4" />
                          <span>Share via secure link</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Answer at your own pace</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Live Mode Interface */}
            {mode === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <button
                    onClick={() => setMode(null)}
                    className="text-[#FF5A5F] hover:text-[#e54e53] mb-4 inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to mode selection
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Mode</h2>
                  <p className="text-gray-600">Create or join a room for real-time truth testing</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Create Room */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Create Room
                    </h3>
                    
                    {!roomCode ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#FF5A5F] to-[#ff7b7f] rounded-full flex items-center justify-center mx-auto mb-6">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-600 mb-6">
                          Generate a room code for your partner to join
                        </p>
                        <button
                          onClick={generateRoomCode}
                          className="bg-[#FF5A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e54e53] transition-all duration-300"
                        >
                          Generate Room Code
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                          <div className="text-sm text-gray-600 mb-2">Your Room Code</div>
                          <div className="text-4xl font-bold text-[#FF5A5F] mb-4 tracking-wider">
                            {roomCode}
                          </div>
                          <button
                            onClick={() => copyToClipboard(roomCode)}
                            className="inline-flex items-center gap-2 text-[#FF5A5F] hover:text-[#e54e53] transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Code'}
                          </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                          Share this code with your partner to start the session
                        </p>
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={() => setRoomCode('')}
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
                          >
                            New Code
                          </button>
                          <button className="bg-[#FF5A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e54e53] transition-all duration-300">
                            Start Session
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Join Room */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Join Room
                    </h3>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#3B2A4A] to-[#5a4a6a] rounded-full flex items-center justify-center mx-auto mb-6">
                        <QrCode className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 mb-6">
                        Enter the room code shared by your partner
                      </p>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                          placeholder="Enter room code"
                          className="w-full p-4 border border-gray-300 rounded-xl text-center text-2xl font-bold tracking-wider focus:ring-2 focus:ring-[#3B2A4A] focus:border-transparent"
                          maxLength={6}
                        />
                        <button
                          onClick={handleJoinRoom}
                          disabled={!joinCode.trim()}
                          className="w-full bg-[#3B2A4A] text-white py-3 rounded-full font-semibold hover:bg-[#2a1f35] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          Join Room
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Async Mode Interface */}
            {mode === 'async' && (
              <motion.div
                key="async"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <button
                    onClick={() => setMode(null)}
                    className="text-[#3B2A4A] hover:text-[#2a1f35] mb-4 inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to mode selection
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Async Mode</h2>
                  <p className="text-gray-600">Create shareable links for questions your partner can answer later</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Create Question Link
                    </h3>
                    
                    {!shareLink ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Question
                          </label>
                          <textarea
                            placeholder="What would you like to ask your partner?"
                            className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-[#3B2A4A] focus:border-transparent"
                            rows={4}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Optional Message
                          </label>
                          <input
                            type="text"
                            placeholder="Add a personal message for your partner"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B2A4A] focus:border-transparent"
                          />
                        </div>
                        
                        <div className="text-center">
                          <button
                            onClick={generateShareLink}
                            className="bg-[#3B2A4A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2a1f35] transition-all duration-300 flex items-center gap-3 mx-auto"
                          >
                            <Link className="w-5 h-5" />
                            Generate Share Link
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#3B2A4A] to-[#5a4a6a] rounded-full flex items-center justify-center mx-auto mb-6">
                          <Link className="w-8 h-8 text-white" />
                        </div>
                        
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Your Question Link is Ready!
                        </h4>
                        
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                          <div className="text-sm text-gray-600 mb-2">Share this link with your partner</div>
                          <div className="text-sm font-mono text-gray-800 bg-white p-3 rounded border break-all mb-4">
                            {shareLink}
                          </div>
                          <button
                            onClick={() => copyToClipboard(shareLink)}
                            className="inline-flex items-center gap-2 text-[#3B2A4A] hover:text-[#2a1f35] transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            Your partner will receive a notification when they answer, and you'll get the truth analysis results.
                          </p>
                          
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={() => setShareLink('')}
                              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
                            >
                              Create Another
                            </button>
                            <button
                              onClick={onBack}
                              className="bg-[#3B2A4A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2a1f35] transition-all duration-300"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CoupleMode;

