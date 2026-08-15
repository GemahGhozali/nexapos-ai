import {
  MenuSquareIcon,
  UserMultiple03Icon,
  PackageIcon,
  Tag01Icon,
  CashierIcon,
  RoboticIcon,
  TransactionHistoryIcon,
  Analytics01Icon,
  Money03Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export const operationalMenus = [
  {
    label: "Dashboard",
    segment: null,
    href: "/dashboard",
    icon: MenuSquareIcon,
  },
  {
    label: "Kasir POS",
    segment: "cashier",
    href: "/dashboard/cashier",
    icon: CashierIcon,
  },
  {
    label: "Riwayat Transaksi",
    segment: "transaction",
    href: "/dashboard/transaction",
    icon: TransactionHistoryIcon,
  },
  {
    label: "Kas Operasional",
    segment: "operational-cashflow",
    href: "/dashboard/operational-cashflow",
    icon: Wallet01Icon,
  },
];

export const adminMenus = [
  {
    label: "Laporan Laba Rugi",
    segment: "report",
    href: "/dashboard/report",
    icon: Analytics01Icon,
  },
  {
    label: "Riwayat Mutasi Kas",
    segment: "cashflow-mutation",
    href: "/dashboard/cashflow-mutation",
    icon: Money03Icon,
  },
  {
    label: "AI Business Copilot",
    segment: "copilot",
    href: "/dashboard/copilot",
    icon: RoboticIcon,
  },
];

export const masterDataMenus = [
  {
    label: "Data Pengguna",
    segment: "user",
    href: "/dashboard/user",
    icon: UserMultiple03Icon,
  },
  {
    label: "Data Produk",
    segment: "product",
    href: "/dashboard/product",
    icon: PackageIcon,
  },
  {
    label: "Data Kategori",
    segment: "category",
    href: "/dashboard/category",
    icon: Tag01Icon,
  },
];

const allMenus = [...operationalMenus, ...adminMenus, ...masterDataMenus];

const mappedSegment: Record<string, string> = Object.fromEntries(
  allMenus.filter((menu) => menu.segment !== null).map((menu) => [menu.segment, menu.label]),
);

export const segmentMapping: Record<string, string> = {
  ...mappedSegment,
  create: "Tambah",
  update: "Edit",
};
