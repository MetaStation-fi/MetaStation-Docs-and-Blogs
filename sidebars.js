/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '📖 Introduction',
    },
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/create-account',
        'getting-started/fund-account',
        'getting-started/security-setup',
        'getting-started/platform-overview',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: '💹 Trading',
      collapsed: false,
      items: [
        'trading/metastation-account',
        'trading/connect-exchange',
        'trading/spot-trading',
        'trading/futures-trading',
        'trading/advanced-orders',
        'trading/account-slots',
        'trading/order-types-reference',
      ],
    },
    {
      type: 'category',
      label: '🤝 Social Trading',
      collapsed: true,
      items: [
        'social-trading/browse-marketplace',
        'social-trading/subscribe-provider',
        'social-trading/copy-settings',
        'social-trading/become-provider',
      ],
    },
    {
      type: 'category',
      label: '🤖 Automation',
      collapsed: true,
      items: [
        'automation/webhook-trading',
        'automation/tradingview-setup',
        'automation/telegram-to-trade',
      ],
    },
    {
      type: 'category',
      label: '💰 Wallet',
      collapsed: true,
      items: [
        'wallet/deposit',
        'wallet/withdraw',
      ],
    },
    {
      type: 'category',
      label: '🔒 Security',
      collapsed: true,
      items: [
        'security/two-factor-auth',
        'security/withdrawal-whitelist',
        'security/api-key-management',
        'security/session-management',
      ],
    },
    {
      type: 'category',
      label: '👨‍💻 Developer Reference',
      collapsed: true,
      items: [
        'developer/webhook-api-overview',
        'developer/json-format',
        'developer/natural-language-format',
        'developer/supported-actions',
        'developer/tradingview-templates',
        'developer/error-codes',
      ],
    },
  ],
};

module.exports = sidebars;
