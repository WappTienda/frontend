import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoriesAdminApi } from "@/api";
import { Button, Card, Badge, LoadingSpinner } from "@/components/ui";
import { useConfirmStore } from "@/stores/confirmStore";
import { CategoryForm } from "@/components/categories/CategoryForm";
import type { Category } from "@/types";

export function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();
  const confirm = useConfirmStore((s) => s.confirm);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => categoriesAdminApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={() => setShowForm(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay categorías</p>
          <Button onClick={() => setShowForm(true)}>
            Crear primera categoría
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{category.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      ({category.slug})
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Orden: {category.order}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      confirm({
                        title: "Eliminar categoría",
                        message:
                          "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.",
                        confirmLabel: "Eliminar",
                        onConfirm: () => deleteMutation.mutate(category.id),
                      })
                    }
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}
