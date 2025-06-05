import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import ProductForm from './ProductForm';
import ServiceForm from './ServiceForm';

type Product = Tables<'products'>;
type Service = Tables<'services'>;

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, servicesResponse] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('services').select('*')
      ]);

      if (productsResponse.error) throw productsResponse.error;
      if (servicesResponse.error) throw servicesResponse.error;

      setProducts(productsResponse.data);
      setServices(servicesResponse.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceStatusChange = async (id: string, isPremium: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_premium: isPremium })
        .eq('id', id);

      if (error) throw error;

      setServices(services.map(s => s.id === id ? { ...s, is_premium: isPremium } : s));

      toast({
        title: "Success",
        description: "Service status updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchData();
  };

  const handleServiceEdit = (service: Service) => {
    setSelectedService(service);
    setIsServiceFormOpen(true);
  };

  const handleServiceFormSuccess = () => {
    fetchData();
  };

  const handleProductDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      fetchData();
      toast({ title: 'Deleted', description: 'Product deleted.' });
    }
  };

  const handleServiceDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      fetchData();
      toast({ title: 'Deleted', description: 'Service deleted.' });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>Add Product</Button>
          <Button onClick={() => { setSelectedService(undefined); setIsServiceFormOpen(true); }}>Add Service</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock_quantity}</td>
                <td>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleProductDelete(product.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filteredProducts.length === 0 && (
          <div className="text-center text-muted-foreground">No products found</div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Services</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>${service.price.toFixed(2)}</td>
                <td>{service.duration} min</td>
                <td>
                  <Badge variant={service.is_premium ? "default" : "secondary"}>
                    {service.is_premium ? "Premium" : "Standard"}
                  </Badge>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleServiceEdit(service)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleServiceStatusChange(service.id, !service.is_premium)}>
                      {service.is_premium ? "Make Standard" : "Make Premium"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleServiceDelete(service.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filteredServices.length === 0 && (
          <div className="text-center text-muted-foreground">No services found</div>
        )}
      </div>

      <ProductForm
        product={selectedProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      <ServiceForm
        service={selectedService}
        isOpen={isServiceFormOpen}
        onClose={() => setIsServiceFormOpen(false)}
        onSuccess={handleServiceFormSuccess}
      />
    </div>
  );
};

export default ProductsTable; 