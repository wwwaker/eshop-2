import { borders, colors, spacing } from './styles';

export const pageStyles = {
  heroSection: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borders.radius.md,
    border: `1px solid ${colors.borderLight}`,
    background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(6,182,212,0.12) 100%)',
  },
  heroTitle: {
    marginBottom: spacing.xs,
  },
  heroDescription: {
    margin: 0,
    color: colors.textSecondary,
  },
  glassCard: {
    backgroundColor: '#ffffffcc',
  },
  tableCard: {
    overflowX: 'auto' as const,
    backgroundColor: '#ffffffcc',
  },
  loadingWrap: {
    minHeight: '48vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: '44px',
    height: '44px',
    borderRadius: '999px',
    border: `3px solid ${colors.borderLight}`,
    borderTopColor: colors.primary,
    animation: 'eshop-spin 0.8s linear infinite',
    boxShadow: '0 8px 18px rgba(79, 70, 229, 0.2)',
  },
  quantityStepper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.backgroundLight,
    borderRadius: '999px',
    border: `1px solid ${colors.borderLight}`,
    padding: '0.2rem',
    width: 'fit-content',
    margin: '0 auto',
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    borderRadius: '999px',
    border: 'none',
    background: colors.background,
    color: colors.text,
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
    transition: 'all 0.2s ease',
  },
  quantityInput: {
    width: '56px',
    border: 'none',
    backgroundColor: 'transparent',
    fontWeight: 600,
    color: colors.text,
  },
};
