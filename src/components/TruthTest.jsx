import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import callTruthAnalyzer from '../utils/callTruthAnalyzer';
import { ArrowLeft, Send, Mic, MicOff, CheckCircle, AlertTriangle, XCircle, Loader2, User, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const TruthTest = ({ onBack, user }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: question, 2: answer, 3: result
  const [isRecording, setIsRecording] = useState(false);

  // Mock AI analysis function
  const analyzeResponse = async (question, answer) => {
  setIsLoading(true);
  try {
    const input = `${answer}`;
    const response = await callTruthAnalyzer(input);

    // structure expected from Supabase Function
    setResult({
      verdict: response?.verdict || 'Unknown',
      score: response?.score || 0,
      reason: response?.reason || '',
    });
    setStep(3); // go to result step
  } catch (error) {
    console.error('Truth Analyzer API failed:', error);
    setResult({
      verdict: 'Error',
      score: 0,
      reason: 'Unable to process input.',
    });
    setStep(3);
  } finally {
    setIsLoading(false);
  }
};

    
    // Mock AI analysis logic
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100
    const truthValue = confidence > 75;
    const warningValue = confidence >= 65 && confidence <= 75;
    
    const responses = {
      truth: [
        "Direct response with no hedging.",
        "Consistent emotional tone throughout.",
        "No verbal hesitation patterns detected.",
        "Response aligns with typical truthful indicators."
      ],
      warning: [
        "Some hesitation detected in response.",
        "Slight inconsistency in emotional tone.",
        "Response shows minor evasive patterns.",
        "Mixed signals in authenticity markers."
      ],
      false: [
        "Significant hesitation and hedging detected.",
        "Inconsistent emotional patterns found.",
        "Multiple evasive language indicators.",
        "Response shows deceptive characteristics."
      ]
    };
    
    let resultType = 'false';
    let icon = '❌';
    let resultText = 'DECEPTION DETECTED';
    
    if (truthValue) {
      resultType = 'truth';
      icon = '✅';
      resultText = 'TRUTH';
    } else if (warningValue) {
      resultType = 'warning';
      icon = '⚠️';
      resultText = 'UNCERTAIN';
    }
    
    const explanation = responses[resultType][Math.floor(Math.random() * responses[resultType].length)];
    const trustDelta = truthValue ? Math.floor(Math.random() * 15) + 5 : -(Math.floor(Math.random() * 15) + 5);
    
    setResult({
      result: `${icon} ${resultText}`,
      confidence,
      explanation,
      trustDelta,
      type: resultType
    });
    
    setIsLoading(false);
  };

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      setStep(2);
    }
  };

  const handleSubmitAnswer = () => {
    if (answer.trim()) {
      setStep(3);
      analyzeResponse(question, answer);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setResult(null);
    setStep(1);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'truth':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'false':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'truth':
        return <CheckCircle className="w-16 h-16 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-16 h-16 text-yellow-600" />;
      case 'false':
        return <XCircle className="w-16 h-16 text-red-600" />;
      default:
        return null;
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
            <h1 className="text-2xl font-bold text-gray-900">Truth Test</h1>
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
                      disabled={!question.trim()}
                      className="bg-[#FF5A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e54e53] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                    >
                      Continue
                      <Send className="w-5 h-5" />
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
                      disabled={!answer.trim()}
                      className="bg-[#FF5A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e54e53] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                    >
                      Analyze Response
                      <Send className="w-5 h-5" />
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

                {/* Loading State */}
                {isLoading && (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <Loader2 className="w-16 h-16 text-[#FF5A5F] mx-auto mb-6 animate-spin" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Response...</h3>
                    <p className="text-gray-600">Our AI is processing the emotional authenticity of your response.</p>
                  </div>
                )}

                {/* Results */}
                {result && !isLoading && (
                  <div className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${getResultColor(result.type)}`}>
                    <div className="text-center mb-8">
                      {getResultIcon(result.type)}
                      <h3 className="text-3xl font-bold mt-4 mb-2">{result.result}</h3>
                      <div className="text-6xl font-bold mb-4">
                        {result.confidence}%
                      </div>
                      <p className="text-lg">Confidence Score</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Analysis:</h4>
                        <p className="text-gray-700 bg-white p-4 rounded-xl border">{result.explanation}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Trust Impact:</h4>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${result.trustDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.trustDelta > 0 ? '+' : ''}{result.trustDelta}
                          </span>
                          <span className="text-gray-600">points</span>
                        </div>
                      </div>
                    </div>

                    {/* Login Encouragement for Session Saving */}
                    {!user && (
                      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
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
</div> {/* <-- This closes the top-level wrapper div */}
);
};

export default TruthTest;



