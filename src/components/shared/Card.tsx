import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  large?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, large = false, className, ...props }, ref) => {
    const classes = [
      "card",
      large && "card-lg",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
