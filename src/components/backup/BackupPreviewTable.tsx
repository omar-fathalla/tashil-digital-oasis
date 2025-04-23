
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface Props {
  data: any[];
  rowsPerPage?: number;
}

export const BackupPreviewTable: React.FC<Props> = ({ data, rowsPerPage = 10 }) => {
  const [current, setCurrent] = useState(1);

  const pages = Math.ceil(data.length / rowsPerPage);
  const pageData = useMemo(() => 
    data.slice((current - 1) * rowsPerPage, current * rowsPerPage), 
    [current, data, rowsPerPage]
  );

  if (!data.length) return null;

  const columns = Object.keys(pageData[0] || {});

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => <TableHead key={col}>{col}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((row, i) => (
            <TableRow key={i}>
              {columns.map(col => (
                <TableCell key={col}>{String(row[col] ?? "")}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrent(Math.max(1, current - 1))} />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm">{current} / {pages}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => setCurrent(Math.min(pages, current + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
