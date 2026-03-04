import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { categoriesAdminApi } from '@/api';
import {
  Button,
  Input,
  Textarea,
  Label,
  Card,
} from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          order: category.order,
          isActive: category.isActive,
        }
      : {
          order: 0,
          isActive: true,
        },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesAdminApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryDto) =>
      categoriesAdminApi.update(category!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      onSuccess();
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as CreateCategoryDto);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" placeholder="Nombre de la categoría" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" placeholder="nombre-de-la-categoria" {...register('slug')} />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la categoría..."
              {...register('description')}
            />
          </div>

          <div>
            <Label htmlFor="order">Orden</Label>
            <Input
              id="order"
              type="number"
              min="0"
              placeholder="0"
              {...register('order', { valueAsNumber: true })}
            />
            {errors.order && (
              <p className="text-sm text-red-500 mt-1">{errors.order.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="rounded" />
            <Label htmlFor="isActive">Activa</Label>
          </div>

          {error && (
            <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg">
              Error al guardar la categoría
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
