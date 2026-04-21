// 统一的样式常量

// 颜色主题
export const colors = {
  primary: '#007bff',
  primaryHover: '#0069d9',
  secondary: '#6c757d',
  secondaryHover: '#5a6268',
  success: '#28a745',
  successHover: '#218838',
  danger: '#dc3545',
  dangerHover: '#c82333',
  warning: '#ffc107',
  light: '#f8f9fa',
  dark: '#343a40',
  border: '#ddd',
  borderLight: '#eee',
  text: '#333',
  textSecondary: '#666',
  textLight: '#999',
  background: '#fff',
  backgroundLight: '#f8f9fa',
  backgroundError: '#f8d7da',
  borderError: '#f5c6cb',
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
    sm: '4px',
    md: '8px',
  },
};

// 阴影
export const shadows = {
  sm: '0 2px 4px rgba(0,0,0,0.1)',
  md: '0 5px 15px rgba(0,0,0,0.15)',
};

// 容器样式
export const containers = {
  card: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borders.radius.md,
    boxShadow: shadows.sm,
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
    margin: '0 auto',
    padding: spacing.xl,
  },
  registerContainer: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: spacing.xl,
  },
  productCard: {
    border: `${borders.thin} ${colors.border}`,
    padding: spacing.md,
    borderRadius: borders.radius.md,
    transition: 'all 0.3s ease',
    boxShadow: shadows.sm,
    position: 'relative' as const,
  },
  productCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: shadows.md,
  },
  productGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' as const,
    gap: spacing.lg,
  },
  pageContainer: {
    padding: '1rem',
    maxWidth: '1200px',
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
    fontSize: '2rem',
    fontWeight: 'bold' as const,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  h2: {
    fontSize: '1.5rem',
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
    backgroundColor: colors.primary,
    color: colors.background,
    border: 'none',
    borderRadius: borders.radius.sm,
    cursor: 'pointer' as const,
    fontSize: '1rem',
    fontWeight: '500' as const,
    transition: 'background-color 0.3s',
  },
  primaryHover: {
    backgroundColor: '#0069d9',
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
    transition: 'background-color 0.3s',
  },
  secondaryHover: {
    backgroundColor: '#5a6268',
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
    transition: 'background-color 0.3s',
  },
  successHover: {
    backgroundColor: '#218838',
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
    padding: spacing.sm,
    color: isActive ? colors.primary : colors.text,
    textDecoration: 'none' as const,
    fontWeight: isActive ? 'bold' as const : 'normal' as const,
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