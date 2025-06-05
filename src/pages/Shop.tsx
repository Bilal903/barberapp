
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface CartItem extends Product {
  quantity: number;
}

const Shop = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (data) setProducts(data);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    toast({
      title: 'Added to Cart',
      description: `${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!user || cart.length === 0) return;
    
    setLoading(true);
    
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          total_amount: getTotalPrice(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_per_item: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: 'Order Placed!',
        description: 'Your order has been placed successfully.',
      });
      
      setCart([]);
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Shop</h1>
        <p className="text-gray-600">Premium hair care products</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="text-xs text-gray-500 mb-3">Brand: {product.brand}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold">${(product.price / 100).toFixed(2)}</span>
                <span className="text-sm text-gray-500">
                  In stock: {product.stock_quantity}
                </span>
              </div>
              
              {getCartItemQuantity(product.id) > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{getCartItemQuantity(product.id)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(product)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(product)}
                  disabled={product.stock_quantity === 0}
                >
                  Add to Cart
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="sticky bottom-20 z-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${(getTotalPrice() / 100).toFixed(2)}</span>
              </div>
              <Button 
                className="w-full mt-2" 
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Checkout'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Shop;
