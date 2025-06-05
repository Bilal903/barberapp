
import { Calendar, Users, Star, Smartphone, Shield, CreditCard, TrendingUp, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-amber-400" />
              <h1 className="text-2xl font-bold text-white">BarberBizFlow</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <a href="#demo" className="text-white/80 hover:text-white transition-colors">Demo</a>
              <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-amber-400/20 text-amber-400 border-amber-400/30">
              Revolutionary Barber Shop Management
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> Barber Shop</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Complete mobile ecosystem with customer app and powerful admin panel. 
              Streamline operations, boost revenue, and deliver exceptional experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-semibold px-8 py-4 text-lg">
                View Customer App Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Explore Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dual App Showcase */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Two Powerful Applications</h2>
            <p className="text-xl text-white/70">Designed for different users, unified for success</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Customer App */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Smartphone className="h-8 w-8 text-blue-400" />
                  <CardTitle className="text-2xl text-white">Customer Mobile App</CardTitle>
                </div>
                <CardDescription className="text-white/70 text-lg">
                  Seamless booking experience for your clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span className="text-white">24/7 Online Booking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Choose Your Barber</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Secure Payments & Wallet</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Membership Tiers & Rewards</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Explore Customer Features
                </Button>
              </CardContent>
            </Card>

            {/* Admin Panel */}
            <Card className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-8 w-8 text-amber-400" />
                  <CardTitle className="text-2xl text-white">Admin Management Panel</CardTitle>
                </div>
                <CardDescription className="text-white/70 text-lg">
                  Complete business control and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-amber-400" />
                    <span className="text-white">Staff & Schedule Management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-amber-400" />
                    <span className="text-white">Revenue Analytics & Reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-amber-400" />
                    <span className="text-white">Customer Management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-amber-400" />
                    <span className="text-white">Multiple Revenue Streams</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-amber-600 hover:bg-amber-700">
                  View Admin Features
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Multiple Revenue Streams</h2>
            <p className="text-xl text-white/70">Maximize your earning potential</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white/5 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Calendar className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Service Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-white/80 space-y-2">
                  <li>• Dynamic pricing for peak hours</li>
                  <li>• Premium barber fees</li>
                  <li>• Cancellation protection</li>
                  <li>• Express "Skip the Line" service</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Star className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Membership Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-white/80 space-y-2">
                  <li>• Bronze, Silver, Gold plans</li>
                  <li>• Priority booking access</li>
                  <li>• Exclusive discounts</li>
                  <li>• Monthly service credits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Product Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-white/80 space-y-2">
                  <li>• In-app product marketplace</li>
                  <li>• Inventory management</li>
                  <li>• Commission tracking</li>
                  <li>• Digital gift cards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="pricing" className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Customer Membership Tiers</h2>
            <p className="text-xl text-white/70">Increase customer loyalty and recurring revenue</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Bronze Tier */}
            <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-500/30">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-black font-bold text-lg">B</span>
                </div>
                <CardTitle className="text-2xl text-white">Bronze</CardTitle>
                <CardDescription className="text-amber-200">Entry Level Benefits</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-white mb-4">$9.99<span className="text-lg font-normal">/month</span></div>
                <ul className="text-white/80 space-y-2 text-left">
                  <li>• 5% discount on all services</li>
                  <li>• Birthday month special offer</li>
                  <li>• Monthly newsletter with tips</li>
                  <li>• Basic booking notifications</li>
                </ul>
              </CardContent>
            </Card>

            {/* Silver Tier */}
            <Card className="bg-gradient-to-br from-gray-600/30 to-gray-800/30 border-gray-400/30 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                  POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-black font-bold text-lg">S</span>
                </div>
                <CardTitle className="text-2xl text-white">Silver</CardTitle>
                <CardDescription className="text-gray-200">Enhanced Experience</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-white mb-4">$19.99<span className="text-lg font-normal">/month</span></div>
                <ul className="text-white/80 space-y-2 text-left">
                  <li>• 15% discount on all services</li>
                  <li>• Priority booking (24h early access)</li>
                  <li>• One free basic service monthly</li>
                  <li>• Product purchase discounts</li>
                  <li>• Advanced booking notifications</li>
                </ul>
              </CardContent>
            </Card>

            {/* Gold Tier */}
            <Card className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-yellow-500/30">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-black font-bold text-lg">G</span>
                </div>
                <CardTitle className="text-2xl text-white">Gold</CardTitle>
                <CardDescription className="text-yellow-200">Premium VIP Treatment</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-white mb-4">$39.99<span className="text-lg font-normal">/month</span></div>
                <ul className="text-white/80 space-y-2 text-left">
                  <li>• 25% discount on all services</li>
                  <li>• Unlimited priority booking</li>
                  <li>• Two premium services monthly</li>
                  <li>• Exclusive access to new services</li>
                  <li>• Dedicated customer support</li>
                  <li>• Free product delivery</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Barber Shop?</h2>
            <p className="text-xl text-white/70 mb-8">
              Join the digital revolution and start maximizing your revenue today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-semibold px-8 py-4 text-lg">
                Schedule Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scissors className="h-6 w-6 text-amber-400" />
                <span className="text-xl font-bold text-white">BarberBizFlow</span>
              </div>
              <p className="text-white/60">Revolutionizing barber shop management with cutting-edge technology.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Customer App</h4>
              <ul className="space-y-2 text-white/60">
                <li>Online Booking</li>
                <li>Barber Profiles</li>
                <li>Payment Wallet</li>
                <li>Membership Benefits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Admin Panel</h4>
              <ul className="space-y-2 text-white/60">
                <li>Schedule Management</li>
                <li>Analytics Dashboard</li>
                <li>Revenue Tracking</li>
                <li>Customer Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-white/60">
                <li>Documentation</li>
                <li>Training</li>
                <li>Technical Support</li>
                <li>Live Chat</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 BarberBizFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
