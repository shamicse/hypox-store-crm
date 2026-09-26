"use client";
import { useEffect } from "react";
import { api } from "./storefront";
export default function WebMCP() {
  useEffect(() => {
    const context = (document as any).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: "search_hypox_catalog",
            title: "Search HypoX catalog",
            description:
              "Search the product catalog and return matching products with links. Does not change the page.",
            inputSchema: {
              type: "object",
              properties: { query: { type: "string", maxLength: 100 } },
              required: ["query"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true, untrustedContentHint: true },
            execute: async (input: any) => {
              if (typeof input?.query !== "string" || input.query.length > 100)
                throw new Error("Query must be at most 100 characters.");
              const data = await api(
                "products?q=" + encodeURIComponent(input.query),
              );
              return {
                total: data.total,
                products: data.items.map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  currency: "INR",
                  url: "/product/" + p.id,
                })),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
      Promise.resolve(
        context.registerTool(
          {
            name: "add_hypox_item_to_bag",
            title: "Add an item to your bag",
            description:
              "Add one catalog product to the current shopping bag. Does not place an order or charge money.",
            inputSchema: {
              type: "object",
              properties: {
                productId: { type: "string", maxLength: 100 },
                size: { type: "string", enum: ["S", "M", "L", "XL", "XXL"] },
              },
              required: ["productId", "size"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute: async (input: any) => {
              if (
                typeof input?.productId !== "string" ||
                !input.productId ||
                input.productId.length > 100
              )
                throw new Error("A valid product ID is required.");
              if (!["S", "M", "L", "XL", "XXL"].includes(input.size))
                throw new Error("Choose an available clothing size.");
              await api("cart", {
                productId: input.productId,
                quantity: 1,
                size: input.size,
              });
              window.dispatchEvent(new Event("cart-update"));
              return { added: true, cartUrl: "/cart" };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);
  return null;
}
