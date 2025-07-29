import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX, Hash, Users, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const TruthCircle = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('trending');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState(new Set());

  // Mock community posts data
  const communityPosts = [
    {
      id: 1,
      type: 'video',
      title: 'Caught my partner in a white lie...',
      author: 'Anonymous_User_1',
      tags: ['#Suspicion', '#WhiteLie'],
      likes: 234,
      comments: 45,
      shares: 12,
      timestamp: '2h ago',
      thumbnail: '/api/placeholder/300/400',
      duration: '0:45'
    },
    {
      id: 2,
      type: 'audio',
      title: 'Finally confessed after 3 years',
      author: 'TruthSeeker_22',
      tags: ['#Confession', '#Relief'],
      likes: 567,
      comments: 89,
      shares: 34,
      timestamp: '4h ago',
      duration: '1:23'
    },
    {
      id: 3,
      type: 'video',
      title: 'How we rebuilt trust after betrayal',
      author: 'CoupleGoals_99',
      tags: ['#Forgiven', '#Healing'],
      likes: 1203,
      comments: 156,
      shares: 78,
      timestamp: '6h ago',
      thumbnail: '/api/placeholder/300/400',
      duration: '2:15'
    },
    {
      id: 4,
      type: 'audio',
      title: 'Red flags I ignored for too long',
      author: 'WisdomShared',
      tags: ['#RedFlags', '#LessonsLearned'],
      likes: 892,
      comments: 234,
      shares: 67,
      timestamp: '8h ago',
      duration: '3:02'
    },
    {
      id: 5,
      type: 'video',
      title: 'Caught cheating - here\'s what happened',
      author: 'Anonymous_Brave',
      tags: ['#Caught', '#Betrayal'],
      likes: 2156,
      comments: 445,
      shares: 123,
      timestamp: '12h ago',
      thumbnail: '/api/placeholder/300/400',
      duration: '1:56'
    },
    {
      id: 6,
      type: 'audio',
      title: 'Why I chose to forgive',
      author: 'ForgivenessJourney',
      tags: ['#Forgiven', '#SecondChances'],
      likes: 678,
      comments: 98,
      shares: 45,
      timestamp: '1d ago',
      duration: '2:34'
    }
  ];

  const trendingTags = [
    { tag: '#Suspicion', count: '2.3k posts' },
    { tag: '#Confession', count: '1.8k posts' },
    { tag: '#Forgiven', count: '1.2k posts' },
    { tag: '#Caught', count: '956 posts' },
    { tag: '#RedFlags', count: '743 posts' },
    { tag: '#Healing', count: '567 posts' }
  ];

  const handlePlayPause = (postId) => {
    if (playingVideo === postId) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(postId);
    }
  };

  const handleMuteToggle = (postId) => {
    const newMuted = new Set(mutedVideos);
    if (newMuted.has(postId)) {
      newMuted.delete(postId);
    } else {
      newMuted.add(postId);
    }
    setMutedVideos(newMuted);
  };

  const handleShare = (post) => {
    // Mock social sharing
    const shareData = {
      title: post.title,
      text: `Check out this truth story on Kazini Truth Circle`,
      url: `https://kazini.app/truth-circle/${post.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  const filteredPosts = communityPosts.filter(post => {
    if (activeTab === 'trending') return post.likes > 500;
    if (activeTab === 'recent') return true;
    if (activeTab === 'video') return post.type === 'video';
    if (activeTab === 'audio') return post.type === 'audio';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Truth Circle</h1>
                <p className="text-sm text-gray-600">Anonymous community stories</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Users className="w-3 h-3 mr-1" />
              12.4k members
            </Badge>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'recent', label: 'Recent', icon: Users },
              { id: 'video', label: 'Videos', icon: Play },
              { id: 'audio', label: 'Audio', icon: Volume2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="relative">
                      {post.type === 'video' ? (
                        <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <button
                              onClick={() => handlePlayPause(post.id)}
                              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                              {playingVideo === post.id ? (
                                <Pause className="w-8 h-8 text-gray-900" />
                              ) : (
                                <Play className="w-8 h-8 text-gray-900 ml-1" />
                              )}
                            </button>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {post.duration}
                          </div>
                          <button
                            onClick={() => handleMuteToggle(post.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center"
                          >
                            {mutedVideos.has(post.id) ? (
                              <VolumeX className="w-4 h-4 text-white" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                          <div className="text-center">
                            <Volume2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {post.duration}
                            </div>
                          </div>
                          <button
                            onClick={() => handlePlayPause(post.id)}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                              {playingVideo === post.id ? (
                                <Pause className="w-8 h-8 text-gray-900" />
                              ) : (
                                <Play className="w-8 h-8 text-gray-900 ml-1" />
                              )}
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>{post.author}</span>
                        <span>{post.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleShare(post)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Trending Tags
                </h3>
                <div className="space-y-2">
                  {trendingTags.map(({ tag, count }) => (
                    <div key={tag} className="flex items-center justify-between">
                      <span className="text-purple-600 font-medium">{tag}</span>
                      <span className="text-xs text-gray-500">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Community Guidelines</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• All posts are anonymous</p>
                  <p>• Be respectful and supportive</p>
                  <p>• No personal information sharing</p>
                  <p>• Report inappropriate content</p>
                  <p>• Focus on healing and growth</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruthCircle;

