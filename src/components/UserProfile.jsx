import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  MapPin, 
  Crown, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Heart
} from 'lucide-react';

const UserProfile = ({ user, onBack, onLogout, onUpgrade, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    notifications: true,
    language: 'en',
    timezone: 'UTC-5'
  });

  const handleSave = () => {
    // In real app, save to backend
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('kazini_user');
    onLogout();
  };

  const getPlanBadge = () => {
    switch (user.plan) {
      case 'pro':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Crown className="w-3 h-3 mr-1" />Pro</Badge>;
      case 'free':
        return <Badge variant="secondary">Free</Badge>;
      case 'guest':
        return <Badge variant="outline">Guest</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
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
        <div className="max-w-4xl mx-auto">
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
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <div className="flex justify-center">
                    {getPlanBadge()}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  {user.location?.country && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.location.city}, {user.location.country}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Member since 2024</span>
                  </div>
                  
                  {user.plan !== 'pro' && (
                    <Button
                      onClick={onUpgrade}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2"
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="preferences">Preferences</TabsTrigger>
                      <TabsTrigger value="privacy">Privacy</TabsTrigger>
                      <TabsTrigger value="billing">Billing</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="space-y-4 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      {isEditing && (
                        <Button onClick={handleSave} className="w-full">
                          Save Changes
                        </Button>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="preferences" className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">App Preferences</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate && onNavigate('global-settings')}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Global Settings
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bell className="w-4 h-4" />
                            <span>Email Notifications</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.notifications}
                            onChange={(e) => setProfileData(prev => ({ ...prev, notifications: e.target.checked }))}
                            className="rounded"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <select
                            value={profileData.language}
                            onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="zh">中文</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <select
                            value={profileData.timezone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="UTC-8">Pacific Time (UTC-8)</option>
                            <option value="UTC-5">Eastern Time (UTC-5)</option>
                            <option value="UTC+0">GMT (UTC+0)</option>
                            <option value="UTC+1">Central European Time (UTC+1)</option>
                            <option value="UTC+8">China Standard Time (UTC+8)</option>
                          </select>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="privacy" className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Privacy & Security
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Data Privacy</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Your conversations are encrypted and stored securely. You can delete your data at any time.
                          </p>
                          <Button variant="outline" size="sm">
                            Download My Data
                          </Button>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Account Security</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Change your password or enable two-factor authentication.
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Change Password
                            </Button>
                            <Button variant="outline" size="sm">
                              Enable 2FA
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="billing" className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Billing & Subscription
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Current Plan</h4>
                            {getPlanBadge()}
                          </div>
                          <p className="text-sm text-gray-600">
                            {user.plan === 'pro' 
                              ? 'You have access to all premium features.'
                              : user.plan === 'free'
                              ? 'Upgrade to Pro for unlimited access and advanced features.'
                              : 'Sign up for a free account to save your progress.'
                            }
                          </p>
                        </div>
                        
                        {user.plan !== 'pro' && (
                          <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                            <h4 className="font-medium mb-2 text-purple-900">Upgrade to Pro</h4>
                            <ul className="text-sm text-purple-800 mb-3 space-y-1">
                              <li>• Unlimited truth tests</li>
                              <li>• Advanced AI analysis</li>
                              <li>• Video emotion detection</li>
                              <li>• Export reports</li>
                              <li>• Priority support</li>
                            </ul>
                            <Button
                              onClick={onUpgrade}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            >
                              Upgrade Now - $9.99/month
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

