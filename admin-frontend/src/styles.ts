// 统一的样式常量

// 颜色主题
export const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
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
    margin: `${spacing.xxl} auto`,
    padding: spacing.xl,
    border: `${borders.thin} ${colors.border}`,
    borderRadius: borders.radius.md,
  },
  grid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing.md,
  },
  gridTwoColumn: {
    display: 'grid' as const,
    gridTemplateColumns: '2fr 1fr',
    gap: spacing.md,
  },
};

// 文本样式
export const typography = {
  h1: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.text,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: '0 0 1rem 0',
    color: colors.textSecondary,
  },
  label: {
    fontWeight: '500',
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
};

// 输入框样式
export const inputs = {
  default: {
    padding: spacing.md,
    borderRadius: borders.radius.sm,
    border: `${borders.thin} ${colors.border}`,
    fontSize: '1rem',
  },
  search: {
    flex: '1',
    padding: '0.5rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px 0 0 4px',
    fontSize: '0.9rem',
  },
  select: {
    padding: '0.5rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    fontSize: '0.9rem',
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
    marginTop: spacing.sm,
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
    marginTop: spacing.sm,
  },
  small: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
    textDecoration: 'none' as const,
  },
  smallPrimary: {
    padding: '0.25rem 0.5rem',
    backgroundColor: colors.primary,
    color: colors.background,
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
    textDecoration: 'none' as const,
  },
  smallSecondary: {
    padding: '0.25rem 0.5rem',
    backgroundColor: colors.secondary,
    color: colors.background,
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
    textDecoration: 'none' as const,
  },
  smallDanger: {
    padding: '0.25rem 0.5rem',
    backgroundColor: colors.danger,
    color: colors.background,
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer' as const,
  },
  search: {
    padding: '0.5rem 1rem',
    backgroundColor: colors.primary,
    color: colors.background,
    border: `1px solid ${colors.primary}`,
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer' as const,
  },
  reset: {
    padding: '0.5rem 1rem',
    backgroundColor: colors.secondary,
    color: colors.background,
    border: `1px solid ${colors.secondary}`,
    borderRadius: '4px',
    cursor: 'pointer' as const,
    fontSize: '0.9rem',
  },
  add: {
    padding: '0.5rem 1rem',
    backgroundColor: colors.primary,
    color: colors.background,
    borderRadius: '4px',
    textDecoration: 'none' as const,
    fontSize: '0.9rem',
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
    marginTop: spacing.sm,
  },
  logout: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.secondary,
    color: colors.background,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer' as const,
    fontSize: '0.9rem',
  },
};

// 导航样式
export const navigation = {
  navLink: (isActive: boolean) => ({
    display: 'block' as const,
    padding: spacing.md,
    borderRadius: '4px',
    textDecoration: 'none' as const,
    color: isActive ? colors.background : '#adb5bd',
    backgroundColor: isActive ? '#495057' : 'transparent',
  }),
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
    padding: '1rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};

// 图片预览样式
export const imagePreview = {
  container: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'cover' as const,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
  },
};

// 表格样式
export const tables = {
  default: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  header: {
    backgroundColor: colors.backgroundLight,
    borderBottom: `${borders.thin} ${colors.border}`,
  },
  headerCell: {
    padding: spacing.md,
    textAlign: 'left' as const,
  },
  row: {
    borderBottom: `${borders.thin} ${colors.borderLight}`,
  },
  cell: {
    padding: spacing.md,
  },
};

// 日志表格样式
export const logTables = {
  container: {
    fontSize: '13px',
    lineHeight: '1.4'
  },
  headerRow: {
    backgroundColor: colors.backgroundLight
  },
  headerCell: {
    padding: '8px',
    fontWeight: '600',
    fontSize: '12px',
  },
  headerCellCenter: {
    padding: '8px',
    fontWeight: '600',
    fontSize: '12px',
    textAlign: 'center' as const,
  },
  cell: {
    padding: '6px 8px',
    verticalAlign: 'top' as const,
    fontSize: '12px'
  },
  cellCenter: {
    padding: '6px 8px',
    textAlign: 'center' as const,
    verticalAlign: 'top' as const,
    fontSize: '12px'
  },
  cellSmall: {
    padding: '6px 8px',
    textAlign: 'center' as const,
    verticalAlign: 'top' as const,
    fontSize: '11px',
    color: colors.textSecondary
  },
  cellWrap: {
    padding: '6px 8px',
    verticalAlign: 'top' as const,
    lineHeight: '1.3',
    whiteSpace: 'normal' as const,
    fontSize: '12px'
  },
  cellEllipsis: {
    padding: '6px 8px',
    verticalAlign: 'top' as const,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    fontSize: '12px'
  },
  levelTag: {
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: '600',
  },
  levelError: {
    backgroundColor: '#ffebee',
    color: '#c62828'
  },
  levelInfo: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32'
  },
};

// 加载状态样式
export const loading = {
  container: {
    textAlign: 'center' as const,
    padding: spacing.xxl,
  },
};

// 进度条样式
export const progressBar = {
  container: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: borders.radius.sm,
    marginBottom: spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: borders.radius.sm,
  },
};

// 图片样式
export const images = {
  thumbnail: {
    width: '40px',
    height: '40px',
    objectFit: 'cover' as const,
    borderRadius: borders.radius.sm,
  },
  placeholder: {
    width: '40px',
    height: '40px',
    backgroundColor: colors.backgroundLight,
    borderRadius: borders.radius.sm,
  },
};

// 图表容器样式
export const charts = {
  container: {
    height: '300px',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    padding: '1rem',
  },
};

// 布局样式
export const layout = {
  marginBottom: {
    sm: {
      marginBottom: spacing.md,
    },
    md: {
      marginBottom: spacing.lg,
    },
    lg: {
      marginBottom: spacing.xl,
    },
  },
  marginTop: {
    sm: {
      marginTop: spacing.md,
    },
  },
  flexBetween: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
  },
  flexColumn: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  gap: {
    sm: {
      gap: spacing.sm,
    },
    md: {
      gap: spacing.md,
    },
  },
  overflowX: {
    auto: {
      overflowX: 'auto' as const,
    },
  },
  filterContainer: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginBottom: spacing.lg,
    padding: '1rem',
    backgroundColor: colors.backgroundLight,
    borderRadius: '4px',
  },
  loading: {
    container: {
      textAlign: 'center' as const,
      padding: '2rem',
    },
  },
  error: {
    container: {
      textAlign: 'center' as const,
      padding: '2rem',
      color: colors.danger,
    },
  },
  product: {
    image: {
      width: '50px',
      height: '50px',
      objectFit: 'cover' as const,
    },
    noImage: {
      width: '50px',
      height: '50px',
      backgroundColor: colors.backgroundLight,
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  },
  orderItem: {
    image: {
      width: '80px',
      height: '80px',
      objectFit: 'cover' as const,
    },
    noImage: {
      width: '80px',
      height: '80px',
      backgroundColor: colors.backgroundLight,
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  },
};

// 状态标签样式
export const status = {
  onSale: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  offSale: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  admin: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    backgroundColor: '#17a2b8',
    color: 'white',
  },
  user: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    backgroundColor: '#28a745',
    color: 'white',
  },
  order: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    color: 'white',
  },
};

// 分页样式
export const pagination = {
  container: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
    marginTop: '1.5rem',
    padding: '1rem 0',
  },
  button: {
    padding: '0.5rem 1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    backgroundColor: colors.background,
    color: colors.text,
    cursor: 'pointer' as const,
    fontSize: '0.9rem',
    minWidth: '40px',
  },
  buttonDisabled: {
    padding: '0.5rem 1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    backgroundColor: colors.backgroundLight,
    color: colors.textLight,
    cursor: 'not-allowed' as const,
    fontSize: '0.9rem',
    minWidth: '40px',
  },
  buttonActive: {
    padding: '0.5rem 1rem',
    border: `1px solid ${colors.primary}`,
    borderRadius: '4px',
    backgroundColor: colors.primary,
    color: colors.background,
    cursor: 'pointer' as const,
    fontSize: '0.9rem',
    minWidth: '40px',
  },
  info: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    color: colors.textSecondary,
  },
  pageSizeSelect: {
    padding: '0.5rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    fontSize: '0.9rem',
    marginLeft: '1rem',
  },
};
