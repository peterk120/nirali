interface DepositStatusBadgeProps {
  status: 'held' | 'refunded' | 'refund_initiated';
}

export const DepositStatusBadge: React.FC<DepositStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'held':
        return {
          text: 'Held',
          className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
        };
      case 'refund_initiated':
        return {
          text: 'Refund Initiated',
          className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800'
        };
      case 'refunded':
        return {
          text: 'Refunded',
          className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'
        };
      default:
        return {
          text: 'Unknown',
          className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={config.className}>
      {config.text}
    </span>
  );
};