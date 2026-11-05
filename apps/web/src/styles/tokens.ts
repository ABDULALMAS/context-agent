// Optional, browser/server-safe references; CSS owns all literal values.
// These strings are CSS values, not resolved numbers for application logic.
type CssVariableReference = `var(--${string})`;
type TokenGroup = Readonly<Record<string, CssVariableReference>>;

export const tokens = {
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: "var(--primary)",
    brand: "var(--brand)",
    brandSoft: "var(--brand-soft)",
    brandTint: "var(--brand-tint)",
    ink: "var(--ink)",
    surface: "var(--surface)",
    mutedForeground: "var(--muted-foreground)",
    border: "var(--border)",
    warning: "var(--warn)",
    success: "var(--ok)",
    error: "var(--bad)",
    live: "var(--live)",
  },
  typography: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
    bodySize: "var(--type-body-size)",
    bodyLeading: "var(--type-body-leading)",
    uiSize: "var(--type-ui-size)",
    uiLeading: "var(--type-ui-leading)",
  },
  spacing: {
    pageInline: "var(--space-page-inline)",
    pageBlock: "var(--space-page-block)",
    contentGap: "var(--space-content-gap)",
    groupGap: "var(--space-group-gap)",
    sectionGap: "var(--space-section-gap)",
    cardPadding: "var(--space-card-padding)",
  },
  radii: {
    control: "var(--radius-md)",
    card: "var(--radius-card)",
    pill: "var(--radius-pill)",
    composer: "var(--radius-chat-composer)",
  },
  shadows: {
    ring: "var(--shadow-ring)",
    elevated: "var(--shadow-elevated)",
    button: "var(--shadow-btn)",
    buttonDark: "var(--shadow-btn-dark)",
  },
  layout: {
    sidebarExpanded: "var(--layout-sidebar-expanded)",
    sidebarCollapsed: "var(--layout-sidebar-collapsed)",
    homeMax: "var(--layout-home-max)",
    chatMax: "var(--layout-chat-max)",
    runPanel: "var(--layout-run-panel)",
  },
  motion: {
    interaction: "var(--motion-interaction)",
    message: "var(--motion-message)",
    panel: "var(--motion-panel)",
    home: "var(--motion-home)",
    progress: "var(--motion-progress)",
  },
} as const satisfies Record<string, TokenGroup>;

export type TokenCategory = keyof typeof tokens;
export type TokenName<C extends TokenCategory> = keyof (typeof tokens)[C];
