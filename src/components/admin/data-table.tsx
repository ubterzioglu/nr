import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Tablo başlığında gösterilen özet (ör. "12 kayıt"). */
  summary?: string;
  emptyMessage?: string;
  /** Satır sonunda gösterilen aksiyonlar (düzenle/sil vb.). */
  actions?: (row: T) => React.ReactNode;
}

/**
 * Admin modüllerinin ortak liste tablosu. Server component'tir;
 * hücre içeriği `render` ile, satır aksiyonları `actions` ile verilir.
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  summary,
  emptyMessage = "Henüz kayıt yok.",
  actions,
}: DataTableProps<T>) {
  return (
    <Card>
      {summary && (
        <CardHeader>
          <CardTitle className="text-base font-medium text-muted-foreground">
            {summary}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`pb-3 pr-4 font-medium ${column.className ?? ""}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {actions && <th className="pb-3 text-right font-medium">İşlemler</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/50">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`py-3 pr-4 align-middle ${column.className ?? ""}`}
                      >
                        {column.render
                          ? column.render(row)
                          : ((row as Record<string, unknown>)[column.key] as React.ReactNode) ?? "—"}
                      </td>
                    ))}
                    {actions && (
                      <td className="py-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
