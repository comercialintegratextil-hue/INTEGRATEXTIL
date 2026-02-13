import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ item, index }) => {
  const Icon = item.icon;

  const colorClasses = {
    blue: {
      bg: 'bg-brand-indigo/10',
      text: 'text-brand-indigo',
      colorVar: '--brand-indigo'
    },
    green: {
      bg: 'bg-brand-green/10',
      text: 'text-brand-green',
      colorVar: '--brand-green'
    },
    purple: {
      bg: 'bg-brand-purple/10',
      text: 'text-brand-purple',
      colorVar: '--brand-purple'
    },
    orange: {
      bg: 'bg-brand-orange/10',
      text: 'text-brand-orange',
      colorVar: '--brand-orange'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      colorVar: '--accent-yellow'
    },
    red: {
      bg: 'bg-brand-red/10',
      text: 'text-brand-red',
      colorVar: '--brand-red'
    }
  };

  const { bg, text, colorVar } = colorClasses[item.color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-5 rounded-xl card-shadow flex flex-col justify-between relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--bg-secondary) 50%, color-mix(in srgb, var(${colorVar}), transparent 85%) 100%)`,
        borderBottom: `3px solid var(${colorVar})`
      }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {item.title}
          </p>
          <div className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {item.value}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} shadow-sm backdrop-blur-sm`}>
          <Icon className={`w-6 h-6 ${text}`} />
        </div>
      </div>
      {item.change && (
        <div className="flex items-center text-xs mt-4 relative z-10" style={{ color: 'var(--text-secondary)' }}>
          <span>{item.change}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;