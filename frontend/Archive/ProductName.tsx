import Link from "next/link";

type ProductNameProps = {
  name: string;
  slug: string;
  className?: string;
};

export function ProductName({ name, slug, className }: ProductNameProps) {
  return (
    <Link href={`/products/${slug}`} className="min-w-0">
      <h3
        className={[
          "inline min-w-0 m-0",
          "font-medium text-[#333]",
          "leading-snug line-clamp-2",
          "[font-size:clamp(14px,3.2vw,16px)]", // ✅ clamp applied
          className || "",
        ].join(" ")}
      >
        {name}
      </h3>
    </Link>
  );
}
