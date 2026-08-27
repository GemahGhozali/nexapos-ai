import {
  Tag01Icon,
  PackageIcon,
  CashierIcon,
  Money03Icon,
  Invoice04Icon,
  MenuSquareIcon,
  Analytics01Icon,
  UserMultiple03Icon,
  ClipboardClockIcon,
  TransactionHistoryIcon,
  ReverseWithdrawal01Icon,
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
    label: "Pengeluaran Shift",
    segment: "shift-expense",
    href: "/dashboard/shift-expense",
    icon: ReverseWithdrawal01Icon,
  },
];

export const adminMenus = [
  {
    label: "Laporan Keuangan",
    segment: "financial-report",
    href: "/dashboard/financial-report",
    icon: Analytics01Icon,
  },
  {
    label: "Riwayat Transaksi",
    segment: "transaction-history",
    href: "/dashboard/transaction-history",
    icon: TransactionHistoryIcon,
  },
  {
    label: "Riwayat Pengeluaran",
    segment: "expense-history",
    href: "/dashboard/expense-history",
    icon: Money03Icon,
  },
  {
    label: "Riwayat Operasional Shift",
    segment: "shift-operational-history",
    href: "/dashboard/shift-operational-history",
    icon: ClipboardClockIcon,
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

const allMenus = [...shiftOperationalMenus, ...adminMenus, ...masterDataMenus];

const mappedSegment: Record<string, string> = Object.fromEntries(
  allMenus.filter((menu) => menu.segment !== null).map((menu) => [menu.segment, menu.label]),
);

export const segmentMapping: Record<string, string> = {
  ...mappedSegment,
  create: "Tambah Data",
  update: "Edit Data",
};

export const sidebarGroups = [
  {
    title: "OPERASIONAL SHIFT",
    items: shiftOperationalMenus,
  },
  {
    title: "REKAP KEUANGAN",
    roles: "admin",
    items: adminMenus,
  },
  {
    title: "DATA MASTER",
    roles: "admin",
    items: masterDataMenus,
  },
];
