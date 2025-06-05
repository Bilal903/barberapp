
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Crown, Check, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type MembershipTier = Tables<'membership_tiers'>;
type CustomerMembership = Tables<'customer_memberships'> & {
  membership_tiers: MembershipTier | null;
};

const Membership = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [currentMembership, setCurrentMembership] = useState<CustomerMembership | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembershipTiers();
    if (user) {
      fetchCurrentMembership();
    }
  }, [user]);

  const fetchMembershipTiers = async () => {
    const { data } = await supabase
      .from('membership_tiers')
      .select('*')
      .order('price');
    if (data) setTiers(data);
  };

  const fetchCurrentMembership = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('customer_memberships')
      .select(`
        *,
        membership_tiers (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    if (data) setCurrentMembership(data as CustomerMembership);
  };

  const handleSubscribe = async (tierId: string) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Cancel existing membership if any
      if (currentMembership) {
        await supabase
          .from('customer_memberships')
          .update({ status: 'cancelled' })
          .eq('id', currentMembership.id);
      }
      
      // Create new membership
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      
      const { error } = await supabase
        .from('customer_memberships')
        .insert({
          user_id: user.id,
          tier_id: tierId,
          status: 'active',
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Membership Activated!',
        description: 'Your membership has been activated successfully.',
      });
      
      fetchCurrentMembership();
    } catch (error: any) {
      toast({
        title: 'Subscription Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  const handleCancelMembership = async () => {
    if (!currentMembership) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('customer_memberships')
        .update({ status: 'cancelled' })
        .eq('id', currentMembership.id);

      if (error) throw error;

      toast({
        title: 'Membership Cancelled',
        description: 'Your membership has been cancelled.',
      });
      
      setCurrentMembership(null);
    } catch (error: any) {
      toast({
        title: 'Cancellation Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  const getBenefits = (benefits: any) => {
    if (Array.isArray(benefits)) return benefits;
    if (typeof benefits === 'string') {
      try {
        return JSON.parse(benefits);
      } catch {
        return [benefits];
      }
    }
    return [];
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Crown className="h-6 w-6 text-amber-500" />
          Membership Plans
        </h1>
        <p className="text-gray-600">Choose the plan that fits your lifestyle</p>
      </div>

      {/* Current Membership */}
      {currentMembership && (
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Star className="h-5 w-5" />
              Current Membership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{currentMembership.membership_tiers?.name}</h3>
              <p className="text-sm text-amber-700">
                Status: {currentMembership.status}
              </p>
              <p className="text-sm text-amber-700">
                Expires: {new Date(currentMembership.expires_at || '').toLocaleDateString()}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelMembership}
                disabled={loading}
                className="mt-3"
              >
                Cancel Membership
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Membership Tiers */}
      <div className="space-y-4">
        {tiers.map((tier) => {
          const isCurrentTier = currentMembership?.tier_id === tier.id;
          const benefits = getBenefits(tier.benefits);
          
          return (
            <Card key={tier.id} className={isCurrentTier ? 'border-amber-500 bg-amber-50' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {tier.name}
                      {isCurrentTier && <Crown className="h-4 w-4 text-amber-500" />}
                    </CardTitle>
                    <p className="text-2xl font-bold mt-2">
                      ${(tier.price / 100).toFixed(2)}
                      <span className="text-sm font-normal text-gray-600">/month</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {tier.discount_percentage}% OFF
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {!isCurrentTier && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  )}
                  
                  {isCurrentTier && (
                    <div className="text-center py-2">
                      <span className="text-amber-700 font-medium">✓ Current Plan</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Why Choose a Membership?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Save money on every service</li>
            <li>• Priority booking access</li>
            <li>• Exclusive member-only services</li>
            <li>• Special birthday and holiday offers</li>
            <li>• No commitment - cancel anytime</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Membership;
