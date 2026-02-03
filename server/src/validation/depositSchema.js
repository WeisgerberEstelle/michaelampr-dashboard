const { z } = require('zod');

const depositSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  rib: z.string().min(1, 'RIB is required'),
  bic: z.string().min(1, 'BIC is required'),
  date: z.string().date('Invalid date (expected YYYY-MM-DD format)'),
  allocations: z.array(
    z.object({
      isin: z.string().min(1, 'ISIN is required'),
      percentage: z.number().min(1).max(100)
    })
  ).min(1, 'At least one allocation is required')
}).refine(
  (data) => data.allocations.reduce((sum, a) => sum + a.percentage, 0) === 100,
  { message: 'Sum of percentages must equal 100%', path: ['allocations'] }
);

module.exports = depositSchema;
