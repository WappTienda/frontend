import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { productsAdminApi } from '@/api';
import {
  Button,
  Input,
  Textarea,
  Label,
  Card,
  Badge,
  LoadingSpinner,
} from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/lib/utils';
import type { Product, CreateProductDto, UpdateProductDto } from '@/types';

const productSchema = z.object({
  sku: z.string().min(2, 'SKU requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.number().min(0, 'Precio inválido'),
  salePrice: z.number().min(0).optional().nullable(),
  imageUrl: z.string().optional(),
  isVisible: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          sku: product.sku,
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : undefined,
          imageUrl: product.imageUrl || '',
          isVisible: product.isVisible,
          isActive: product.isActive,
        }
      : {
          isVisible: true,
          isActive: true,
        },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProductDto) => productsAdminApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductDto) =>
      productsAdminApi.update(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onSuccess();
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      ...data,
      salePrice: data.salePrice || undefined,
    };
    if (isEditing) {
      const { sku: _, ...updateData } = payload;
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(payload as CreateProductDto);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                placeholder="SKU-001"
                disabled={isEditing}
                {...register('sku')}
              />
              {errors.sku && (
                <p className="text-sm text-red-500 mt-1">{errors.sku.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" placeholder="Nombre del producto" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del producto..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="salePrice">Precio oferta</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('salePrice', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">URL de imagen</Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              {...register('imageUrl')}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isVisible')} className="rounded" />
              <span className="text-sm">Visible</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isActive')} className="rounded" />
              <span className="text-sm">Activo</span>
            </label>
          </div>

          {error && (
            <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg">
              Error al guardar el producto
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? <Spinner className="h-4 w-4" /> : isEditing ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsAdminApi.getAll({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: productsAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: productsAdminApi.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const products = data?.data || [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay productos</p>
          <Button onClick={() => setShowForm(true)}>Crear primer producto</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center gap-4">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <span className="text-sm text-muted-foreground">({product.sku})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      {formatCurrency(product.salePrice || product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {product.deletedAt ? (
                      <Badge variant="destructive">Eliminado</Badge>
                    ) : (
                      <>
                        <Badge variant={product.isVisible ? 'default' : 'secondary'}>
                          {product.isVisible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                          {product.isVisible ? 'Visible' : 'Oculto'}
                        </Badge>
                        {!product.isActive && <Badge variant="secondary">Inactivo</Badge>}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {product.deletedAt ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restoreMutation.mutate(product.id)}
                      disabled={restoreMutation.isPending}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('¿Eliminar este producto?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}
