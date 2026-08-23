import { CartItemSchema, ExpenseSchema } from "./schemas";

export const AI_TOOLS = {
  add_to_cart: {
    definition: {
      type: "function",
      function: {
        name: "add_to_cart",
        description: "Add one or more product to shopping cart",
        parameters: CartItemSchema.toJSONSchema(),
      },
    },
    metadata: {
      requireProductData: true,
      schema: CartItemSchema,
      successMessage: "Berhasil menambah item ke keranjang!",
    },
  },
  create_expense: {
    definition: {
      type: "function",
      function: {
        name: "create_expense",
        description: "Extract operational expense data",
        parameters: ExpenseSchema.toJSONSchema(),
      },
    },
    metadata: {
      requireProductData: false,
      schema: ExpenseSchema,
      successMessage: "Berhasil mengekstrak data pengeluaran!",
    },
  },
};
