import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Link, Copy, Check, Clock, Share2, Mail, MessageCircle, Heart, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

const AsyncLinkGenerator = ({ onBack, user }) => {
  const [sessionLink, setSessionLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [questions, setQuestions] = useState(['']);
  const [sessionTitle, setSessionTitle] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [linkGenerated, setLinkGenerated] = useState(false);

  const generateSessionLink = () => {
    // Generate a unique session link
    const sessionId = Math.random().toString(36).substring(2, 15);
    const link = `https://kazini.app/session/${sessionId}`;
    setSessionLink(link);
    setLinkGenerated(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${sessionTitle || 'Truth Session'} - Kazini`);
    const body = encodeURIComponent(`Hi,\n\n${personalMessage || 'I\'d like you to participate in a truth session with me.'}\n\nPlease click this link to answer the questions: ${sessionLink}\n\nWith love,\n${user.firstName || 'Your Partner'}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaText = () => {
    const message = encodeURIComponent(`${personalMessage || 'Hey! I\'d like you to answer some questions for our relationship.'} ${sessionLink}`);
    window.open(`sms:?body=${message}`);
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
        <div className="max-w-4xl mx-auto pt-8">
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
            
            <Badge variant="secondary" className="bg-blue-500/20 text-white border-blue-300/30">
              <Clock className="w-3 h-3 mr-1" />
              Async Mode
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
              <div className="p-3 bg-blue-500/20 rounded-full backdrop-blur-sm">
                <Link className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Create Async Session
            </h1>
            <p className="text-white/80 text-lg">
              Set up questions for your partner to answer at their convenience
            </p>
          </motion.div>

          {!linkGenerated ? (
            /* Session Setup */
            <div className="grid md:grid-cols-2 gap-8">
              {/* Session Details */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Session Details
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Title
                      </label>
                      <Input
                        placeholder="e.g., Our Weekly Check-in"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Message
                      </label>
                      <Textarea
                        placeholder="Add a personal note for your partner..."
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Session Info</span>
                      </div>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Partner can answer anytime within 7 days</li>
                        <li>• You'll get notified when they respond</li>
                        <li>• Results include detailed emotional analysis</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Questions Setup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Questions
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                      Add questions for your partner to answer
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder={`Question ${index + 1}`}
                            value={question}
                            onChange={(e) => updateQuestion(index, e.target.value)}
                          />
                        </div>
                        {questions.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                            className="px-3"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addQuestion}
                      className="w-full"
                      disabled={questions.length >= 10}
                    >
                      + Add Question
                    </Button>

                    <div className="pt-4">
                      <Button
                        onClick={generateSessionLink}
                        disabled={!questions.some(q => q.trim()) || !sessionTitle.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Generate Session Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ) : (
            /* Generated Link */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-500 rounded-full">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Session Link Created!
                  </CardTitle>
                  <p className="text-gray-600">
                    Share this link with your partner
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Session Link */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Link className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Session Link</span>
                    </div>
                    <div className="bg-white border rounded p-3 mb-3">
                      <code className="text-sm text-blue-600 break-all">{sessionLink}</code>
                    </div>
                    <Button
                      onClick={handleCopyLink}
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
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Share Options */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Share via:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={shareViaEmail}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </Button>
                      <Button
                        onClick={shareViaText}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Text
                      </Button>
                    </div>
                  </div>

                  {/* Session Summary */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Session Summary</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div><strong>Title:</strong> {sessionTitle}</div>
                      <div><strong>Questions:</strong> {questions.filter(q => q.trim()).length}</div>
                      <div><strong>Expires:</strong> 7 days from now</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setLinkGenerated(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Create Another Session
                  </Button>
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
                <h3 className="text-white font-semibold mb-2">How Async Mode Works:</h3>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• Create custom questions for your partner</li>
                  <li>• Share a secure link via email, text, or social media</li>
                  <li>• Partner answers at their convenience within 7 days</li>
                  <li>• Get detailed emotional analysis when they respond</li>
                  <li>• Perfect for busy schedules and long-distance relationships</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AsyncLinkGenerator;

