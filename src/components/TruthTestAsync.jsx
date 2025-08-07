import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';
import { callTruthAnalyzer } from '../utils/callTruthAnalyzer';
import { ArrowLeft, Send, Mic, MicOff, CheckCircle, AlertTriangle, XCircle, Loader2, User, Save, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const TruthTestAsync = ({ onBack, user }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: question, 2: answer, 3: result
  const [isRecording, setIsRecording] = useState(false);
  const [testId, setTestId] = useState(null);
  const [saveToDatabase, setSaveToDatabase] = useState(true);

  // Submit question to database and get test ID
  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      if (saveToDatabase && user) {
        // Save question to database via Edge Function
        const { data, error } = await supabase.functions.invoke('submit-question', {
          body: { question: question.trim() }
        });

        if (error) {
          console.error('Error saving question:', error);
          // Continue without database save
        } else {
          setTestId(data?.test?.id);
        }
      }
      setStep(2);
    } catch (error) {
      console.error('Error submitting question:', error);
      // Continue to next step even if database save fails
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit answer and get analysis
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setIsLoading(true);
    try {
      // Get AI analysis from Truth Analyzer API
      const analysisResult = await callTruthAnalyzer(answer);
      
      const verdict = analysisResult?.verdict || 'Unknown';
      const score = analysisResult?.score || 0;
      const reason = analysisResult?.reason || 'Analysis completed';

      // Save to database if user is logged in and we have a test ID
      if (saveToDatabase && user && testId) {
        try {
          const { error } = await supabase.functions.invoke('submit-answer', {
            body: { 
              id: testId, 
              answer: answer.trim(),
              verdict,
              score
            }
          });

          if (error) {
            console.error('Error saving answer:', error);
          }
        } catch (dbError) {
          console.error('Database save error:', dbError);
          // Continue with result display even if database save fails
        }
      }

      // Set result for display
      setResult({
        verdict,
        score,
        reason,
        saved: saveToDatabase && user && testId
      });
      
      setStep(3);
    } catch (error) {
      console.error('Truth Analyzer API failed:', error);
      setResult({
        verdict: 'Error',
        score: 0,
        reason: 'Unable to process input. Please try again.',
        saved: false
      });
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setResult(null);
    setStep(1);
    setTestId(null);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
  };

  const getResultColor = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'truth':
      case 'truthful':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'uncertain':
      case 'unclear':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'deception':
      case 'false':
      case 'lie':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getResultIcon = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'truth':
      case 'truthful':
        return <CheckCircle className="w-16 h-16 text-green-600" />;
      case 'uncertain':
      case 'unclear':
        return <AlertTriangle className="w-16 h-16 text-yellow-600" />;
      case 'deception':
      case 'false':
      case 'lie':
        return <XCircle className="w-16 h-16 text-red-600" />;
      default:
        return <AlertTriangle className="w-16 h-16 text-gray-600" />;
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
            <h1 className="text-2xl font-bold text-gray-900">Async Truth Test</h1>
            {user && (
              <Badge variant="outline" className="ml-auto">
                <Database className="w-3 h-3 mr-1" />
                Database Sync
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNum
                        ? 'bg-[#FF5A5F] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-12 h-1 ${
                        step > stepNum ? 'bg-[#FF5A5F]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Database Save Option */}
          {!user && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Save Your Tests</h3>
                      <p className="text-sm text-blue-700">Sign in to save your truth tests and track your history</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent('showAuth'))}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Question */}
            {step === 1 && (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  What would you like to ask?
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Enter a question that you'd like to have analyzed for emotional authenticity.
                  {user && " Your test will be saved to your account."}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., Did you talk to your ex last week?"
                      className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={handleSubmitQuestion}
                      disabled={!question.trim() || isLoading}
                      className="bg-[#FF5A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e54e53] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Answer */}
            {step === 2 && (
              <motion.div
                key="answer"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Question:</h3>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{question}</p>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  What's your answer?
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Provide your response. Our AI will analyze it for emotional authenticity.
                </p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
                      rows={4}
                    />
                    <button
                      onClick={toggleRecording}
                      className={`absolute bottom-4 right-4 p-2 rounded-full transition-all duration-300 ${
                        isRecording
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || isLoading}
                      className="bg-[#FF5A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e54e53] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze Response
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 3 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Question & Answer Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Question:</h3>
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{question}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Answer:</h3>
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{answer}</p>
                    </div>
                  </div>
                </div>

                {/* Results */}
                {result && (
                  <div className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${getResultColor(result.verdict)}`}>
                    <div className="text-center mb-8">
                      {getResultIcon(result.verdict)}
                      <h3 className="text-3xl font-bold mt-4 mb-2">{result.verdict?.toUpperCase()}</h3>
                      <div className="text-6xl font-bold mb-4">
                        {result.score}%
                      </div>
                      <p className="text-lg">Confidence Score</p>
                      {result.saved && (
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          <Database className="w-3 h-3 mr-1" />
                          Saved to Database
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Analysis:</h4>
                        <p className="text-gray-700 bg-white p-4 rounded-xl border">{result.reason}</p>
                      </div>
                    </div>

                    {/* Login Encouragement for Session Saving */}
                    {!user && (
                      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 mt-6">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-pink-100 rounded-full">
                                <Save className="w-5 h-5 text-pink-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Save Your Results</h3>
                                <p className="text-sm text-gray-600">Sign in to save this session and track your truth journey</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => window.dispatchEvent(new CustomEvent('showAuth'))}
                              className="bg-pink-600 hover:bg-pink-700 text-white"
                            >
                              <User className="w-4 h-4 mr-2" />
                              Sign In
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        onClick={handleReset}
                        className="bg-[#FF5A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e54e53] transition-all duration-300"
                      >
                        Test Again
                      </button>
                      <button
                        onClick={onBack}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TruthTestAsync;

