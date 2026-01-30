interface ProductNameProps {
  name: string;
  badge?: string;
}

export function ProductName({ name, badge }: ProductNameProps) {
  return (
    <h3
      className="text-sm font-bold text-gray-900"
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: '1.45',
        wordBreak: 'break-word',
        margin: 0,
        padding: 0,
        minHeight: 0,
        fontWeight: 600,
      }}
    >
      {badge && (
        <span
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #C9A961 0%, #E8D399 100%)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '9px',
            lineHeight: '12px',
            fontWeight: '800',
            letterSpacing: '0.3px',
            verticalAlign: 'text-top',
            marginRight: '6px',
            marginTop: '1px',
            textShadow: '0 0.5px 1px rgba(0,0,0,0.15)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          {badge}
        </span>
      )}
      {name}
    </h3>
  );
}

export default ProductName;
