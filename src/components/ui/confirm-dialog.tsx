import { Button } from "./button";
import { Card } from "./card";
import { useConfirmStore } from "@/stores/confirmStore";

export function ConfirmDialogContainer() {
  const dialog = useConfirmStore((s) => s.dialog);
  const closeConfirm = useConfirmStore((s) => s.close);

  if (!dialog) return null;

  const handleConfirm = () => {
    dialog.onConfirm();
    closeConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-2">{dialog.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{dialog.message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={closeConfirm}>
            {dialog.cancelLabel || "Cancelar"}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {dialog.confirmLabel || "Confirmar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
