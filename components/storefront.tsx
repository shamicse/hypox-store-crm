"use client";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  User,
  ArrowUpRight,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  Plus,
  Grid2X2,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { Product, categories, money } from "@/lib/types";
import CrmHome from './crm-home';
export async function api(path: string, body?: unknown, method?: string) {
  const res = await fetch("/api/" + path, {
    method: method ?? (body ? "POST" : "GET"),
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data: any = await res.json();
  if (!res.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
export function Shell({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(false);
  const [count, setCount] = useState(0);
  const [crm,setCrm]=useState<any>({announcements:[],navigation:[]});
  useEffect(()=>{api('crm-content').then(setCrm).catch(()=>{})},[]);
  useEffect(() => {
    const v = localStorage.getItem("hypox-theme") === "light";
    setLight(v);
    document.documentElement.classList.toggle("light", v);
    const refresh = () =>
      api("cart")
        .then((d) =>
          setCount(d.items.reduce((s: number, i: any) => s + i.quantity, 0)),
        )
        .catch(() => {});
    refresh();
    window.addEventListener("cart-update", refresh);
    return () => window.removeEventListener("cart-update", refresh);
  }, []);
  function theme() {
    const v = !light;
    setLight(v);
    document.documentElement.classList.toggle("light", v);
    localStorage.setItem("hypox-theme", v ? "light" : "dark");
  }
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div className="announce">
        {crm.announcements?.[0] ? <a href={crm.announcements[0].link || '/shop'}>{crm.announcements[0].name}</a> : 'FIRST DROP. YOUR RULES. — FREE INDIA SHIPPING OVER ₹2,999'}
      </div>
      <header className="header">
        <div className="wrap header-inner">
          <a className="brand" href="/">
            Hypo<span>X</span>
          </a>
          <form className="search" action="/shop">
            <Search />
            <input
              aria-label="Search products"
              name="q"
              placeholder="Find your next fit…"
            />
          </form>
          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={theme}
              aria-label="Toggle light or dark mode"
            >
              {light ? <Moon /> : <Sun />}
            </button>
            <a
              className="icon-btn desktop"
              href="/wishlist"
              aria-label="Wishlist"
            >
              <Heart />
            </a>
            <a
              className="icon-btn desktop"
              href="/account"
              aria-label="Your account"
            >
              <User />
            </a>
            <a
              className="icon-btn"
              href="/cart"
              aria-label={`Shopping bag, ${count} items`}
            >
              <ShoppingBag />
              {count > 0 && <span className="count">{count}</span>}
            </a>
          </div>
        </div>
        <nav className="wrap nav" aria-label="Main navigation">
          {crm.navigation?.length>0 ? crm.navigation.map((n:any)=><a key={n.id} href={n.link}>{n.name}</a>) : <a href="/shop">Discover</a>}
          <a href="/shop?sort=newest">New arrivals</a>
          <a href="/categories">Categories</a>
          <a href="/deals">Sale ↗</a>
          <a href="/blog">The edit</a>
          <a href="/about">Our story ↗</a>
        </nav>
      </header>
      <main id="main" className="wrap">
        {children}
        {typeof window !== 'undefined' && window.location.pathname==='/' && <CrmHome/>}
      </main>
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <a href="/" className="brand">
                Hypo<span>X</span>
              </a>
              <p>
                your vive. your x<br />
                Clothing for your own kind of different.
              </p>
            </div>
            <div>
              <h3>Explore</h3>
              {["Shop", "Categories", "Deals", "Blog", "Size guide"].map(
                (s) => (
                  <a key={s} href={"/" + s.toLowerCase().replaceAll(" ", "-")}>
                    {s}
                  </a>
                ),
              )}
            </div>
            <div>
              <h3>Here to help</h3>
              {["Contact", "FAQ", "Shipping", "Returns", "Services"].map(
                (s) => (
                  <a key={s} href={"/" + s.toLowerCase()}>
                    {s}
                  </a>
                ),
              )}
            </div>
            <div>
              <h3>Our world</h3>
              {["About", "Careers", "Privacy policy", "Terms"].map((s) => (
                <a key={s} href={"/" + s.toLowerCase().replaceAll(" ", "-")}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} HypoX</span>
            <span>
              <a href="/privacy-policy">Privacy</a> · <a href="/terms">Terms</a>{" "}
              · <a href="/about">About</a>
            </span>
            <span>INR ₹ · Made for what’s next</span>
          </div>
        </div>
      </footer>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <a href="/shop">
          <Grid2X2 />
          Discover
        </a>
        <a href="/wishlist">
          <Heart />
          Saved
        </a>
        <a href="/orders">
          <Truck />
          Orders
        </a>
        <a href="/account">
          <User />
          You
        </a>
      </nav>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
export async function addToCart(id: string, size = "M") {
  try {
    await api("cart", { productId: id, quantity: 1, size });
    window.dispatchEvent(new Event("cart-update"));
    toast.success("Added to your bag");
  } catch (e: any) {
    toast.error(e.message);
  }
}
export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="product">
      <div className="product-image">
        <a href={"/product/" + p.id}>
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            width="600"
            height="630"
          />
        </a>
        {p.badge && <span className="badge">{p.badge}</span>}
        <button
          className="icon-btn heart"
          aria-label={"Save " + p.name}
          onClick={() =>
            api("wishlist", { productId: p.id })
              .then(() => toast.success("Wishlist updated"))
              .catch((e) => toast.error(e.message))
          }
        >
          <Heart />
        </button>
        <button
          className="icon-btn quick-add"
          aria-label={"Choose size for " + p.name}
          disabled={!p.stock}
          onClick={() => location.assign("/product/" + p.id)}
        >
          <Plus />
        </button>
      </div>
      <div className="product-meta">
        <span>{p.brand.toUpperCase()}</span>
        <span className="rating">
          <Star />
          {p.reviewCount ? p.rating.toFixed(1) : "New"}
          {p.reviewCount > 0 && ` (${p.reviewCount})`}
        </span>
      </div>
      <a href={"/product/" + p.id}>
        <h3>{p.name}</h3>
      </a>
      <div className="price">
        {money(p.price)}
        {p.comparePrice > p.price && <del>{money(p.comparePrice)}</del>}
      </div>
    </article>
  );
}
export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All clothing");
  const [error, setError] = useState("");
  useEffect(() => {
    api("products?limit=8&category=" + encodeURIComponent(category))
      .then((d) => setProducts(d.items))
      .catch((e) => setError(e.message));
  }, [category]);
  return (
    <Shell>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">HYPOX / THE FIRST DROP</span>
          <h1>
            Your vive.
            <br />
            <em>Your x.</em>
          </h1>
          <p>
            Heavyweight layers. Oversized essentials.
            <br />
            Wear it your way. Leave your mark.
          </p>
          <a className="btn" href="/shop">
            Explore the drop <ArrowUpRight />
          </a>
          <div className="proof">
            <span>
              <ShieldCheck /> Original energy
            </span>
            <span>
              <RotateCcw /> Easy returns
            </span>
          </div>
        </div>
        <a className="hero-photo" href="/shop?category=Hoodies">
          <img
            src="/images/editorial.jpg"
            alt="Streetwear look in a concrete parking garage"
          />
          <div className="photo-overlay" />
          <div className="photo-caption">
            <div>
              <span className="pill">OFF THE GRID</span>
              <h2>
                No dress code.
                <br />
                Just you.
              </h2>
              <span className="small">Explore the first collection</span>
            </div>
            <span
              className="icon-btn"
              style={{ background: "#d5fc51", color: "#111", border: 0 }}
            >
              <ArrowUpRight />
            </span>
          </div>
        </a>
      </section>
      <div className="benefits">
        <span>
          <Truck /> Free shipping over ₹2,999
        </span>
        <span>
          <ShieldCheck /> Secure checkout
        </span>
        <span>
          <RotateCcw /> 7-day return requests
        </span>
        <span>
          <Headphones /> A little help, whenever
        </span>
      </div>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">THE EVERYDAY, REDEFINED.</span>
            <h2 style={{ marginTop: 8 }}>Build your rotation.</h2>
          </div>
          <a href="/shop" className="small">
            Shop the collection{" "}
            <ArrowRight style={{ display: "inline", width: 16 }} />
          </a>
        </div>
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={"chip " + (c === category ? "active" : "")}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {error ? (
          <div className="notice">{error}</div>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
      <section className="banner">
        <div>
          <span className="eyebrow" style={{ color: "#42501d" }}>
            YOUR FIRST FIT HITS DIFFERENT
          </span>
          <h2>A fresh start. A better fit.</h2>
          <p>Take 10% off eligible orders with HYPOX10. Up to ₹1,000 off.</p>
        </div>
        <a href="/deals" className="btn">
          Find your fit <ArrowUpRight />
        </a>
      </section>
    </Shell>
  );
}

