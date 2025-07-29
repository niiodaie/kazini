import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, MicOff, Video, VideoOff, Play, Square, ArrowLeft, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const LiveDetection = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      stopRecording();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setHasPermissions(true);
      setPermissionError('');
    } catch (error) {
      console.error('Permission denied:', error);
      setPermissionError('Camera and microphone access is required for live truth detection. Please allow permissions and refresh the page.');
      setHasPermissions(false);
    }
  };

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled;
        setCameraEnabled(!cameraEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;

    try {
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        analyzeRecording(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const analyzeRecording = async (blob) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const mockResults = {
      truthScore: Math.floor(Math.random() * 40) + 60, // 60-100%
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      emotionalState: ['Calm', 'Nervous', 'Confident', 'Anxious'][Math.floor(Math.random() * 4)],
      microExpressions: [
        'Slight eye movement detected',
        'Facial tension observed',
        'Voice pitch variation noted',
        'Breathing pattern changes'
      ],
      verdict: Math.random() > 0.3 ? 'Truthful' : 'Deceptive',
      timestamp: new Date().toLocaleString()
    };
    
    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetAnalysis = () => {
    setAnalysisResults(null);
    setRecordingTime(0);
  };

  if (!hasPermissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              Permission Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{permissionError}</p>
            <div className="flex gap-2">
              <Button onClick={requestPermissions} className="flex-1">
                Try Again
              </Button>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-white">Live Truth Detection</h1>
          <div className="w-20"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video Feed */}
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Live Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    REC {formatTime(recordingTime)}
                  </div>
                )}

                {/* Camera disabled overlay */}
                {!cameraEnabled && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-white/60" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={cameraEnabled ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleCamera}
                >
                  {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant={audioEnabled ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleAudio}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  disabled={!cameraEnabled && !audioEnabled}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Record yourself answering a question for AI-powered truth analysis
              </p>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <div className="space-y-6">
            {isAnalyzing && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">Analyzing Recording...</h3>
                    <p className="text-gray-600">AI is processing your video and audio for truth detection</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {analysisResults.truthScore}%
                        </div>
                        <div className="text-sm text-gray-600">Truth Score</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysisResults.confidence}%
                        </div>
                        <div className="text-sm text-gray-600">Confidence</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Verdict</h4>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        analysisResults.verdict === 'Truthful' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {analysisResults.verdict}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Emotional State</h4>
                      <p className="text-gray-600">{analysisResults.emotionalState}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Micro-expressions Detected</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {analysisResults.microExpressions.map((expression, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                            {expression}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {analysisResults.timestamp}
                      </div>
                      <Button onClick={resetAnalysis} variant="outline" size="sm">
                        New Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!isAnalyzing && !analysisResults && (
              <Card>
                <CardContent className="text-center py-12">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready for Live Detection</h3>
                  <p className="text-gray-600 mb-4">
                    Start recording to begin AI-powered truth analysis using your camera and microphone.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>✓ Real-time facial expression analysis</p>
                    <p>✓ Voice pattern recognition</p>
                    <p>✓ Micro-expression detection</p>
                    <p>✓ Emotional state assessment</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;

