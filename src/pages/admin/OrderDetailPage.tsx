import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { ordersAdminApi } from "@/api";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Select,
  Textarea,
  Label,
  LoadingSpinner,
} from "@/components/ui";
import { useConfirmStore } from "@/stores/confirmStore";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";
import { statusLabels, statusVariants, statusOptions } from "@/lib/orderStatus";
import { CustomerInfoCard } from "@/components/orders/CustomerInfoCard";
import { OrderItemsCard } from "@/components/orders/OrderItemsCard";
import type { OrderStatus } from "@/types";
import { isOrderStatus } from "@/types";
import { adminOrderDetailRoute } from "@/routes";

export function OrderDetailPage() {
  const { orderId } = adminOrderDetailRoute.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirmStore((s) => s.confirm);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => ordersAdminApi.getById(orderId),
    enabled: !!orderId,
  });

  const { register, handleSubmit } = useForm({
    values: {
      status: order?.status || "pending",
      adminNote: order?.adminNote || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { status?: OrderStatus; adminNote?: string }) =>
      ordersAdminApi.update(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => ordersAdminApi.delete(orderId),
    onSuccess: () => {
      navigate({ to: "/admin/orders" });
    },
  });

  const onSubmit = (data: { status: string; adminNote: string }) => {
    if (isOrderStatus(data.status)) {
      updateMutation.mutate({
        status: data.status,
        adminNote: data.adminNote,
      });
    } else {
      console.error("Invalid order status:", data.status);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pedido no encontrado</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: "/admin/orders" })}
        >
          Volver a pedidos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate({ to: "/admin/orders" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Pedido #{order.publicId}</h1>
            <Badge variant={statusVariants[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <a
          href={`/order/${order.publicId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm flex items-center gap-1"
        >
          Ver página pública
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CustomerInfoCard
          customer={order.customer}
          customerNote={order.customerNote}
        />
        <OrderItemsCard items={order.items} totalAmount={order.totalAmount} />
      </div>

      {/* Admin Actions */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Gestión del pedido</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Estado</Label>
              <Select
                options={statusOptions}
                {...register("status")}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Nota interna (solo admin)</Label>
              <Textarea
                {...register("adminNote")}
                placeholder="Notas internas sobre este pedido..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  "Guardar cambios"
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  confirm({
                    title: "Eliminar pedido",
                    message:
                      "¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.",
                    confirmLabel: "Eliminar",
                    onConfirm: () => deleteMutation.mutate(),
                  })
                }
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
