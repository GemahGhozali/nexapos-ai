import {
  Tag01Icon,
  PackageIcon,
  CashierIcon,
  RoboticIcon,
  Money03Icon,
  Wallet01Icon,
  Invoice04Icon,
  MenuSquareIcon,
  Analytics01Icon,
  UserMultiple03Icon,
  ClipboardClockIcon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";

export const shiftOperationalMenus = [
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
    label: "Transaksi Shift",
    segment: "shift-transaction",
    href: "/dashboard/shift-transaction",
    icon: Invoice04Icon,
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
    label: "Laporan Keuangan",
    segment: "report",
    href: "/dashboard/report",
    icon: Analytics01Icon,
  },
  {
    label: "AI Business Copilot",
    segment: "copilot",
    href: "/dashboard/copilot",
    icon: RoboticIcon,
  },
];

export const historyMenus = [
  {
    label: "Riwayat Shift",
    segment: "shift",
    href: "/dashboard/shift",
    icon: ClipboardClockIcon,
  },
  {
    label: "Riwayat Transaksi",
    segment: "transaction",
    href: "/dashboard/transaction",
    icon: TransactionHistoryIcon,
  },
  {
    label: "Riwayat Mutasi Kas",
    segment: "cashflow-mutation",
    href: "/dashboard/cashflow-mutation",
    icon: Money03Icon,
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

const allMenus = [...shiftOperationalMenus, ...adminMenus, ...historyMenus, ...masterDataMenus];

const mappedSegment: Record<string, string> = Object.fromEntries(
  allMenus.filter((menu) => menu.segment !== null).map((menu) => [menu.segment, menu.label]),
);

export const segmentMapping: Record<string, string> = {
  ...mappedSegment,
  create: "Tambah Data",
  update: "Edit Data",
};
