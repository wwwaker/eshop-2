// 统一的样式常量

// 颜色主题
export const colors = {
  primary: '#4f46e5',
  primaryHover: '#4338ca',
  secondary: '#334155',
  secondaryHover: '#1e293b',
  success: '#059669',
  successHover: '#047857',
  danger: '#dc2626',
  dangerHover: '#b91c1c',
  warning: '#f59e0b',
  light: '#f1f5f9',
  dark: '#0f172a',
  border: '#dbe2ef',
  borderLight: '#eef2ff',
  text: '#0f172a',
  textSecondary: '#475569',
  textLight: '#94a3b8',
  background: '#ffffff',
  backgroundLight: '#f8fafc',
  backgroundError: '#fee2e2',
  borderError: '#fecaca',
  accent: '#06b6d4',
  accentSoft: '#ecfeff',
};

// 间距
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '4rem',
};

// 边框
export const borders = {
  thin: '1px solid',
  radius: {
    sm: '10px',
    md: '16px',
  },
};

// 阴影
export const shadows = {
  sm: '0 8px 24px rgba(15, 23, 42, 0.08)',
  md: '0 16px 40px rgba(79, 70, 229, 0.18)',
};

// 容器样式
export const containers = {
  card: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borders.radius.md,
    boxShadow: shadows.sm,
    border: `${borders.thin} ${colors.borderLight}`,
  },
  form: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: spacing.md,
  },
  formGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: spacing.sm,
  },
  loginContainer: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: spacing.xl,
    borderRadius: borders.radius.md,
    border: `${borders.thin} ${colors.borderLight}`,
    boxShadow: shadows.md,
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  },
  registerContainer: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: spacing.xl,
    borderRadius: borders.radius.md,
    border: `${borders.thin} ${colors.borderLight}`,
    boxShadow: shadows.md,
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  },
  productCard: {
    border: `${borders.thin} ${colors.borderLight}`,
    padding: spacing.md,
    borderRadius: borders.radius.md,
    transition: 'all 0.3s ease',
    boxShadow: shadows.sm,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  },
  productCardHover: {
    transform: 'translateY(-6px)',
    boxShadow: shadows.md,
  },
  productGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' as const,
    gap: spacing.lg,
  },
  pageContainer: {
    padding: '1.25rem',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  flexGap: {
    display: 'flex' as const,
    gap: spacing.md,
  },
  flexBetween: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  flexColumn: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  flexColumnGap: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: spacing.sm,
  },
  errorContainer: {
    textAlign: 'center' as const,
    padding: spacing.xl,
    color: colors.danger,
  },
  loadingContainer: {
    textAlign: 'center' as const,
    padding: spacing.xl,
  },
  emptyContainer: {
    textAlign: 'center' as const,
    padding: spacing.xxl,
  },
};

// 文本样式
export const typography = {
  h1: {
    fontSize: '2.2rem',
    fontWeight: 'bold' as const,
    marginBottom: spacing.lg,
    color: colors.text,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '1.65rem',
    fontWeight: 'bold' as const,
    marginBottom: spacing.md,
    color: colors.text,
  },
  h3: {
    fontSize: '1.1rem',
    fontWeight: 'bold' as const,
    margin: '0 0 0.5rem 0',
    color: colors.text,
  },
  label: {
    fontWeight: '500' as const,
    display: 'block' as const,
    marginBottom: spacing.xs,
  },
  textCenter: {
    textAlign: 'center' as const,
  },
  textSmall: {
    fontSize: '0.9rem',
    color: colors.textSecondary,
  },
  textError: {
    color: colors.danger,
  },
  textSuccess: {
    color: colors.success,
  },
  textRight: {
    textAlign: 'right' as const,
  },
};

// 输入框样式
export const inputs = {
  default: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borders.radius.sm,
    border: `${borders.thin} ${colors.border}`,
    boxSizing: 'border-box' as const,
    fontSize: '1rem',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  },
  search: {
    flex: '1',
    padding: spacing.md,
    border: `${borders.thin} ${colors.border}`,
    borderRadius: '4px 0 0 4px',
    fontSize: '0.9rem',
  },
  select: {
    padding: spacing.md,
    border: `${borders.thin} ${colors.border}`,
    borderRadius: borders.radius.sm,
    fontSize: '0.9rem',
  },
  number: {
    width: '60px',
    padding: spacing.sm,
    textAlign: 'center' as const,
  },
  textarea: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borders.radius.sm,
    border: `${borders.thin} ${colors.border}`,
    resize: 'vertical' as const,
    fontSize: '1rem',
  },
  disabled: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borders.radius.sm,
    border: `${borders.thin} ${colors.border}`,
    backgroundColor: colors.backgroundLight,
    fontSize: '1rem',
  },
};

// 按钮样式
export const buttons = {
  primary: {
    padding: spacing.md,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    cursor: 'pointer' as const,
    fontSize: '1rem',
    fontWeight: '500' as const,
    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.28)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
  },
  primaryHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 12px 26px rgba(79, 70, 229, 0.34)',
    opacity: 0.96,
  },
  secondary: {
    padding: spacing.md,
    backgroundColor: colors.secondary,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    cursor: 'pointer' as const,
    fontSize: '1rem',
    fontWeight: '500' as const,
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  },
  secondaryHover: {
    backgroundColor: colors.secondaryHover,
    transform: 'translateY(-1px)',
  },
  danger: {
    padding: spacing.md,
    backgroundColor: colors.danger,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    cursor: 'pointer' as const,
    fontSize: '1rem',
    fontWeight: '500' as const,
    transition: 'background-color 0.3s',
  },
  dangerHover: {
    backgroundColor: '#c82333',
  },
  success: {
    padding: spacing.md,
    backgroundColor: colors.success,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    cursor: 'pointer' as const,
    fontSize: '1rem',
    fontWeight: '500' as const,
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  },
  successHover: {
    backgroundColor: colors.successHover,
    transform: 'translateY(-1px)',
  },
  small: {
    padding: '0.3rem 0.6rem',
    borderRadius: borders.radius.sm,
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
    textDecoration: 'none' as const,
  },
  smallPrimary: {
    padding: '0.3rem 0.6rem',
    backgroundColor: colors.primary,
    color: colors.background,
    borderRadius: borders.radius.sm,
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
    textDecoration: 'none' as const,
  },
  smallDanger: {
    padding: '0.3rem 0.6rem',
    backgroundColor: colors.danger,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
  },
  smallSuccess: {
    padding: '0.3rem 0.6rem',
    backgroundColor: colors.success,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
  },
  disabled: {
    padding: spacing.md,
    backgroundColor: colors.secondary,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    cursor: 'not-allowed' as const,
    fontSize: '1rem',
    fontWeight: '500' as const,
  },
  search: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    color: colors.background,
    border: `${borders.thin} ${colors.primary}`,
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer' as const,
  },
  quantity: {
    width: '30px',
    height: '30px',
    textAlign: 'center' as const,
  },
};

// 错误信息样式
export const alerts = {
  error: {
    color: colors.danger,
    backgroundColor: colors.backgroundError,
    padding: spacing.md,
    borderRadius: borders.radius.sm,
    marginBottom: spacing.md,
    border: `${borders.thin} ${colors.borderError}`,
  },
  success: {
    color: colors.success,
    backgroundColor: '#d4edda',
    padding: spacing.md,
    borderRadius: borders.radius.sm,
    marginBottom: spacing.md,
    border: '1px solid #c3e6cb',
  },
};

// 导航样式
export const navigation = {
  navLink: (isActive: boolean) => ({
    padding: `${spacing.sm} ${spacing.md}`,
    color: isActive ? colors.primary : colors.textSecondary,
    textDecoration: 'none' as const,
    fontWeight: isActive ? 'bold' as const : '500' as const,
    borderRadius: borders.radius.sm,
    backgroundColor: isActive ? colors.accentSoft : 'transparent',
    transition: 'all 0.2s ease',
  }),
  navButton: (isActive: boolean) => ({
    width: '100%',
    textAlign: 'left' as const,
    padding: spacing.sm,
    backgroundColor: isActive ? colors.light : 'transparent',
    border: 'none',
    cursor: 'pointer' as const,
    borderRadius: borders.radius.sm,
    transition: 'background-color 0.3s',
  }),
};

// 图片样式
export const images = {
  product: {
    maxWidth: '100%',
    maxHeight: '100%',
    transition: 'transform 0.3s ease',
  },
  productHover: {
    transform: 'scale(1.05)',
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover' as const,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundLight,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  productDetail: {
    maxWidth: '100%',
    maxHeight: '400px',
  },
};

// 表格样式
export const tables = {
  default: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  header: {
    borderBottom: `2px solid ${colors.border}`,
  },
  headerCell: {
    padding: spacing.md,
    textAlign: 'left' as const,
  },
  row: {
    borderBottom: `1px solid ${colors.border}`,
  },
  cell: {
    padding: spacing.md,
  },
  cellCenter: {
    padding: spacing.md,
    textAlign: 'center' as const,
  },
  footer: {
    borderTop: `2px solid ${colors.border}`,
  },
  footerCell: {
    padding: spacing.md,
    fontWeight: 'bold' as const,
  },
};

// 状态标签样式
export const status = {
  order: {
    padding: '0.2rem 0.6rem',
    borderRadius: borders.radius.sm,
    fontSize: '0.8rem',
  },
  orderPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  orderPaid: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  orderShipped: {
    backgroundColor: '#e2e3e5',
    color: '#383d41',
  },
  orderCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  orderCancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  stock: {
    fontSize: '0.8rem',
  },
  stockAvailable: {
    color: colors.success,
  },
  stockUnavailable: {
    color: colors.danger,
  },
};

// 布局样式
export const layout = {
  marginBottom: {
    sm: { marginBottom: spacing.md },
    md: { marginBottom: spacing.lg },
    lg: { marginBottom: spacing.xl },
  },
  marginTop: {
    sm: { marginTop: spacing.md },
    md: { marginTop: spacing.lg },
  },
  gap: {
    sm: { gap: spacing.sm },
    md: { gap: spacing.md },
    lg: { gap: spacing.lg },
  },
  flex: {
    row: {
      display: 'flex' as const,
      alignItems: 'center' as const,
    },
    column: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
    },
  },
  flexWrap: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
  },
  flexBetween: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  grid: {
    display: 'grid' as const,
  },
  gridTwoColumn: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr' as const,
    gap: spacing.lg,
  },
  productDetail: {
    display: 'flex' as const,
    gap: spacing.xl,
    maxWidth: '1000px',
    margin: '0 auto',
  },
  categorySidebar: {
    width: '200px',
  },
  mainContent: {
    flex: 1,
  },
  sortControl: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
  },
  sortControlGroup: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
  },
  sortSelect: {
    padding: '4px 8px',
    borderRadius: borders.radius.sm,
    border: `${borders.thin} ${colors.border}`,
    fontSize: '14px',
  },
  pagination: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  paginationButton: {
    padding: '6px 12px',
    borderRadius: borders.radius.sm,
    border: `${borders.thin} ${colors.border}`,
    backgroundColor: 'white',
    cursor: 'pointer' as const,
    fontSize: '14px',
  },
  paginationButtonDisabled: {
    backgroundColor: colors.light,
    cursor: 'not-allowed' as const,
  },
  paginationInfo: {
    fontSize: '14px',
  },
};