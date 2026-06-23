/**
 * Shared button used across the system. Replaces the many ad-hoc button
 * styles (.header-action-btn, .btn-primary, .btn-proses, inline-styled, and
 * Tailwind bg-blue-600 buttons) with one consistent, token-driven component.
 *
 * Usage:
 *   <Button onClick={...}>Save</Button>                      // primary by default
 *   <Button variant="secondary" onClick={...}>Cancel</Button>
 *   <Button variant="danger" size="sm">Delete</Button>
 *   <Button variant="ghost" icon={<ArrowPathIcon className="w-4 h-4" />}>Refresh</Button>
 *
 * Variants: primary | secondary | danger | success | ghost
 * Sizes:    sm | md (default) | lg
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  icon = null,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const classes = ['btn', `btn--${variant}`, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {icon}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
