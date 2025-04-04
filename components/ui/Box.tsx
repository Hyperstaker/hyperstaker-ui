export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: {
    width?: string;
    p?: number;
    mt?: number;
    display?: string;
    justifyContent?: string;
  };
  children: React.ReactNode;
}

export function Box({ sx, children, ...props }: BoxProps) {
  const styles = {
    width: sx?.width || "auto",
    padding: sx?.p ? `${sx.p * 8}px` : "0",
    marginTop: sx?.mt ? `${sx.mt * 8}px` : "0",
    display: sx?.display || "block",
    justifyContent: sx?.justifyContent || "flex-start",
  };

  return (
    <div style={styles} {...props}>
      {children}
    </div>
  );
}
