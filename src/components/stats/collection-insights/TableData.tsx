import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopHolderWithRank } from "@/lib/constants";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableDataPagination } from "./TableDataPagination";

type TableDataProps = {
  data: TopHolderWithRank[];
  title: string;
};

function truncateAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 7,
) {
  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength,
  )}`;
}

export function TableData({ data, title }: TableDataProps) {
  const columns: ColumnDef<TopHolderWithRank>[] = [
    {
      id: "rank",
      header: "Rank",
      accessorFn: (row) => row.rank.toString(),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "address",
      header: "Holder",
      cell: (info) => {
        const address = info.getValue() as string;
        return (
          <a
            href={`https://pool.pm/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            {truncateAddress(address)}
          </a>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "NFTs owned",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const baseUrl = "https://pool.pm/";

  return (
    <Card className={title === "The Infamous TAS60" ? "border-yellow-500" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableHead>Rank</TableHead>
            <TableHead>Holder</TableHead>
            <TableHead>NFTs owned</TableHead>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableDataPagination table={table} />
      </CardContent>
    </Card>
  );
}
